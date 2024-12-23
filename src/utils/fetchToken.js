import axios from "axios";
import { decodeJwt } from "jose";

// Modify fetchToken to bypass token fetching for password reset
export const fetchToken = async (isPasswordResetRequest = false) => {
  try {
    // If it's a password reset request, no token is needed
    if (isPasswordResetRequest) {
      console.log(
        "[fetchToken] Skipping token fetch for password reset request"
      );
      return null; // No token needed for password reset
    }

    console.log("[fetchToken] Attempting to fetch token");

    const response = await fetch("/api/auth/get-access-token");
    const text = await response.text();
    console.log("[fetchToken] Full response text:", text);

    if (!response.ok) {
      console.error(
        "[fetchToken] Failed to fetch access token, response not OK"
      );
      throw new Error("Failed to fetch access token");
    }

    const data = JSON.parse(text);
    console.log("[fetchToken] Parsed JSON data:", data);

    const token = data.token;
    console.log("[fetchToken] Access token:", token);

    if (!token || isTokenExpired(token)) {
      console.log(
        "[fetchToken] Token is expired or not found, attempting to refresh"
      );

      const refreshResponse = await axios.post(
        "/api/auth/refresh",
        {},
        {
          withCredentials: true,
        }
      );

      const refreshData = refreshResponse.data;
      console.log("[fetchToken] Refreshed token data:", refreshData);

      if (!refreshData.accessToken) {
        console.error(
          "[fetchToken] Failed to refresh access token, no access token in response"
        );
        throw new Error("Failed to refresh access token");
      }

      return refreshData.accessToken;
    }

    return token;
  } catch (error) {
    console.error(
      "[fetchToken] Error loading or refreshing access token:",
      error
    );
    return null;
  }
};

export const isTokenExpired = (token) => {
  try {
    const decoded = decodeJwt(token);
    if (!decoded.exp) {
      console.error("[isTokenExpired] Token has no expiration date");
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    const isExpired = decoded.exp < now;
    console.log(
      `[isTokenExpired] Token expiration check: now=${now}, exp=${decoded.exp}, isExpired=${isExpired}`
    );
    return isExpired;
  } catch (error) {
    console.error("[isTokenExpired] Error decoding token:", error);
    return true;
  }
};
