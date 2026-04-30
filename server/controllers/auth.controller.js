import genToken from "../config/token.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import { sendWelcomeEmail } from "../utils/sendEmail.js";

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const sanitizeUser = (user) => {
  const payload = user.toObject ? user.toObject() : user;
  delete payload.passwordHash;
  return payload;
};

const issueAuthResponse = async (res, user, status = 200) => {
  const token = await genToken(user._id);
  res.cookie("token", token, getCookieOptions());
  return res.status(status).json({
    ...sanitizeUser(user),
    token,
  });
};

const queueWelcomeEmail = (user) => {
  sendWelcomeEmail(user.email, user.name).catch((error) => {
    console.error("Welcome email failed:", error);
  });
};

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password, passwordHash = "") => {
  const [salt, storedHash] = passwordHash.split(":");
  if (!salt || !storedHash) return false;

  const hashBuffer = crypto.scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(storedHash, "hex");
  return storedBuffer.length === hashBuffer.length && crypto.timingSafeEqual(storedBuffer, hashBuffer);
};

const validateEmailPassword = (email, password) => {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { error: "Please enter a valid email address." };
  }

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  return { normalizedEmail };
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const adminEmails = getAdminEmails();
    const isAdminEmail = adminEmails.includes(normalizedEmail);
    let user = await User.findOne({ email: normalizedEmail });
    const isNewUser = !user;
    if (!user) {
      user = await User.create({
        name,
        email: normalizedEmail,
        role: isAdminEmail ? "ADMIN" : "USER",
        authProvider: "GOOGLE",
      });
    } else {
      if (user.authProvider === "EMAIL") {
        user.authProvider = "BOTH";
      }
      if (isAdminEmail && user.role !== "ADMIN") {
        user.role = "ADMIN";
      }
      await user.save();
    }

    if (isNewUser) {
      queueWelcomeEmail(user);
    }

    return issueAuthResponse(res, user);
  } catch (error) {
    return res.status(500).json({ message: `Google auth error ${error}` });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { normalizedEmail, error } = validateEmailPassword(email, password);

    if (error) return res.status(400).json({ message: error });
    if (!name?.trim() || name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters." });
    }

    const existingUser = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
    if (existingUser?.passwordHash) {
      return res.status(409).json({ message: "Account already exists. Please login." });
    }

    const adminEmails = getAdminEmails();
    const isAdminEmail = adminEmails.includes(normalizedEmail);

    if (existingUser) {
      existingUser.name = existingUser.name || name.trim();
      existingUser.passwordHash = hashPassword(password);
      existingUser.authProvider = existingUser.authProvider === "GOOGLE" ? "BOTH" : "EMAIL";
      if (isAdminEmail) existingUser.role = "ADMIN";
      await existingUser.save();
      return issueAuthResponse(res, existingUser, 200);
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      role: isAdminEmail ? "ADMIN" : "USER",
      authProvider: "EMAIL",
    });

    queueWelcomeEmail(user);

    return issueAuthResponse(res, user, 201);
  } catch (error) {
    return res.status(500).json({ message: `Signup error ${error}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { normalizedEmail, error } = validateEmailPassword(email, password);

    if (error) return res.status(400).json({ message: error });

    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return issueAuthResponse(res, user);
  } catch (error) {
    return res.status(500).json({ message: `Login error ${error}` });
  }
};

export const logOut = async (req, res) => {
  try {
    await res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    return res.status(200).json({ message: "LogOut Successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Logout error ${error}` });
  }
};
