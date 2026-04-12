import User from "../models/user.model.js";

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("email role");

    if (!user) {
      return res.status(404).json({ message: "user does not found" });
    }

    const hasAdminEmail = adminEmails.includes((user.email || "").toLowerCase());
    const hasAdminRole = user.role === "ADMIN";

    if (!hasAdminEmail && !hasAdminRole) {
      return res.status(403).json({ message: "Admin access required." });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: `isAdmin error ${error}` });
  }
};

export default isAdmin;
