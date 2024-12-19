// utils/auth.ts
import { jwtVerify } from "jose";
import { User } from "@/types/types";

export async function fetchServerSession(
  headers: Record<string, string>
): Promise<User | null> {
  try {
    const cookies = headers.cookie; // Get cookies from headers
    if (!cookies) {
      return null; // Return null if no cookies are found
    }

    // Extract accessToken from cookies
    const accessToken = cookies
      ?.split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) {
      return null; // Return null if accessToken is not found
    }

    // Verify the JWT using the secret key
    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET)
    );
    return payload.UserInfo as User; // Return the user info from the payload
  } catch (error) {
    console.error("Error fetching session:", error); // Log any errors
    return null; // Return null if an error occurs
  }
}
