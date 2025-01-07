import jwt from "jsonwebtoken";
import User from "../models/User";
import dbConnect from "../utils/dbConnect";

const authMiddleware = async (req, res, next) => {
  await dbConnect();

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("User not found");
      return res.status(403).json({ message: "User not found" });
    }

    // Check individual user permissions
    const method = req.method.toLowerCase();
    const routes = req.url.split("/").filter(Boolean);
    let userHasPermission = false;

    user.userPermissions.forEach((userPermission) => {
      if (routes.includes(userPermission.page)) {
        if (method === "get" && userPermission.permissions.view) {
          userHasPermission = true;
        }
        if (method === "post" && userPermission.permissions.upload) {
          userHasPermission = true;
        }
        if (
          (method === "put" || method === "patch" || method === "delete") &&
          userPermission.permissions.edit
        ) {
          userHasPermission = true;
        }
      }
    });

    if (!userHasPermission) {
      return res.status(403).json({ message: "Permission denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token is not valid:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
