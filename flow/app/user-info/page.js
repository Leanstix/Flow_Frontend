"use client";
import UserProfileUpdate from "./components/User-Info";
import { useState, useEffect } from "react";

export default function Login() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // This ensures that LoginComponent renders only after mounting

  return (
    <div><UserProfileUpdate /></div>
  );
}
