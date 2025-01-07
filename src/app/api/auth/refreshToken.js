import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: `Method '${req.method}' Not Allowed` });
  }

  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh Token is required" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Fetch the user from the database using Prisma
    const user = await prisma.user.findUnique({
      where: { id: decoded.UserInfo.id },
    });

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    // Extract avatar URL if it exists (you may need to adjust this depending on your database schema)
    let avatarUrl = user.profile?.avatar || null;
    if (avatarUrl) {
      const avatarKey = avatarUrl.split(".com/")[1]; // Extract the key from the URL
      avatarUrl = ""; // Update this line if you need to modify the avatar URL
    }

    // User information to be included in the new access token
    const userInfo = {
      id: user.id,
      username: user.username,
      userType: user.userType.toLowerCase(),
      roles: user.roles,
      image: avatarUrl,
      active: user.active,
      inactiveReason: user.inactiveReason,
    };

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { UserInfo: userInfo },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "8h" }
    );

    // Return the new access token
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    res.status(403).json({ error: "Invalid refresh token" });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after each request
  }
}
