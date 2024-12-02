"use client";

import { useEffect } from "react";
import { refreshToken } from "../lib/api";

// Function to decode JWT and check expiration
const isTokenExpired = (token) => {
  try {
    const [, payload] = token.split(".");
    const decodedPayload = JSON.parse(atob(payload));
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decodedPayload.exp <= currentTime; // Check if token has expired
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Assume token is expired if decoding fails
  }
};

// Function to ensure access token validity
const ensureValidToken = async () => {
  const accessToken = localStorage.getItem("authToken");
  if (!accessToken || isTokenExpired(accessToken)) {
    try {
      console.log("Access token expired. Attempting to refresh...");
      const newToken = await refreshToken();
      console.log("Token refreshed successfully:", newToken);
    } catch (error) {
      console.error("Failed to refresh token:", error.response?.data || error.message);
    }
  } else {
    console.log("Access token is valid.");
  }

  // Recursive call to check token validity again after a short delay
  setTimeout(ensureValidToken, 5 * 60 * 1000); // Check every 5 minutes
};

export default function TokenValidator() {
  useEffect(() => {
    ensureValidToken(); // Start the token validity checker
  }, []);

  return null; // This component only performs a side effect
}
