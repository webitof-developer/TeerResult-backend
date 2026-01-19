import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Fetch user from database to get current info
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: "Account is blocked" });
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      isActive: user.isActive
    };

    next();
  } catch (err) {
    console.error("Auth Error:", err);
    return res.status(500).json({ message: "Middleware error" });
  }
};

export default authMiddleware;
