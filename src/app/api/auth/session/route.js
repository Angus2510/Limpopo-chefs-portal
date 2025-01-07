import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { parse } from "cookie";

export async function GET(req) {
  try {
    // Parse cookies from the request headers
    const cookies = parse(req.headers.get("cookie") || "");
    const accessToken = cookies.accessToken;

    if (!accessToken) {
      console.warn("Access token not found in cookies.");
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized: Token missing." }),
        { status: 401 }
      );
    }

    // Ensure the secret key exists in environment variables
    if (!process.env.ACCESS_TOKEN_SECRET) {
      console.error("Environment variable ACCESS_TOKEN_SECRET is not defined.");
      return new NextResponse(
        JSON.stringify({ error: "Server misconfiguration." }),
        { status: 500 }
      );
    }

    // Verify token using the JWT secret key
    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET)
    );

    // Log the entire payload to ensure it contains the necessary user info
    console.log("JWT Payload:", payload); // This will help identify the structure of the payload
    console.log("JWT successfully verified for user:", payload.UserInfo);

    // Return the user information including userType if available
    return new NextResponse(
      JSON.stringify({ user: payload.UserInfo, message: "Session valid." }),
      { status: 200 }
    );
  } catch (error) {
    // Handle token verification errors
    if (error.name === "JWTExpired") {
      console.warn("JWT expired:", error);
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized: Token expired." }),
        { status: 401 }
      );
    }

    // Log and return error if the JWT verification failed
    console.error("JWT verification failed:", error);
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized: Invalid token." }),
      { status: 401 }
    );
  }
}
