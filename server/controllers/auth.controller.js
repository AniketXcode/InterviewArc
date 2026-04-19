import genToken from "../config/token.js";
import User from "../models/user.model.js";

export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    const isAdminEmail = adminEmails.includes(normalizedEmail);
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        role: isAdminEmail ? "ADMIN" : "USER",
      });
    } else if (isAdminEmail && user.role !== "ADMIN") {
      user.role = "ADMIN";
      await user.save();
    }
    let token = await genToken(user._id);
   res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000
});

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Google auth error ${error}` });
  }
};

export const logOut = async (req, res) => {
  try {
    await res.clearCookie("token");
    return res.status(200).json({ message: "LogOut Successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Logout error ${error}` });
  }
};
