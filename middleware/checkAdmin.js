import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js"; // adjust path if your models directory is elsewhere

dotenv.config();

export default async function checkAdmin(req, res, next) {
  try {
    // Expecting header: Authorization: Bearer <token>
    const auth = req.headers.authorization;
    if (!auth) {
      return res
        .status(401)
        .json({ status: false, message: "No token provided" });
    }

    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ status: false, message: "Admins only" });
    }

    // attach user to req if you like:
    req.user = user;
    next();
  } catch (err) {
    console.error("checkAdmin error:", err);
    return res
      .status(401)
      .json({ status: false, message: "Invalid or expired token" });
  }
}
