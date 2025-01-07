import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// POST method for login
export async function POST(req) {
  const { identifier, password } = await req.json();

  try {
    // Try fetching from the `students` table first by email or username
    let user = await prisma.students.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    // If not found in `students`, try fetching from `staffs`
    if (!user) {
      user = await prisma.staffs.findFirst({
        where: {
          OR: [{ email: identifier }, { username: identifier }],
        },
      });
    }

    // If no user is found, return invalid credentials
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid email/username or password" }),
        { status: 401 }
      );
    }

    // Check if account is active
    if (!user.active) {
      return new NextResponse(
        JSON.stringify({ message: "Account is inactive" }),
        { status: 401 }
      );
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid email/username or password" }),
        { status: 401 }
      );
    }

    // Generate access and refresh tokens
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: user.id,
          email: user.email,
          username: user.username,
          userType: user.userType.toLowerCase(), // Include userType in the token
          role: user.roles || "unknown", // Assuming `role` is stored in both tables
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "8h" }
    );

    const refreshToken = jwt.sign(
      {
        UserInfo: {
          id: user.id,
          email: user.email,
          username: user.username, // Include username in the token
          role: user.roles || "unknown", // Assuming `role` is stored in both tables
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookies with access and refresh tokens
    const accessTokenCookie = cookie.serialize("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
      path: "/",
    });

    const refreshTokenCookie = cookie.serialize("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      path: "/",
    });

    // Send cookies in the response headers
    const headers = new Headers();
    headers.append("Set-Cookie", accessTokenCookie);
    headers.append("Set-Cookie", refreshTokenCookie);

    return new NextResponse(
      JSON.stringify({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role || "unknown",
        },
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET method to verify the session
export async function GET(req) {
  const cookies = req.cookies;
  const accessToken = cookies.accessToken;

  if (!accessToken) {
    return new NextResponse(JSON.stringify({ message: "No token found" }), {
      status: 401,
    });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    // Check the role from the decoded JWT and query the correct table (students or staff)
    const user =
      decoded.UserInfo.role === "Student"
        ? await prisma.students.findUnique({
            where: { id: decoded.UserInfo.id },
          })
        : await prisma.staffs.findUnique({
            where: { id: decoded.UserInfo.id },
          });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 401,
      });
    }

    return new NextResponse(JSON.stringify({ user }), { status: 200 });
  } catch (error) {
    console.error("Session verification failed:", error);
    return new NextResponse(
      JSON.stringify({ message: "Invalid or expired token" }),
      { status: 401 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
