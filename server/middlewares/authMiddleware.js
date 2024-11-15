import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const response = await User.findById(decodedToken.userId).select(
        "isAdmin email"
      );

      console.log("authMiddleware response", response);

      req.user = {
        email: response.email,
        isAdmin: response.isAdmin,
        userId: decodedToken.userId,
      };
      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized. Login again." });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ status: false, message: "Unauthorized. Login again." });
  }
};

const isAdminRoute = async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
};

export { protectRoute, isAdminRoute };
