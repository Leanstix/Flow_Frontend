"use client";
import HomePage from "./components/UserHomePage";
import { useState, useEffect } from "react";

export default function UserHome() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // This ensures that LoginComponent renders only after mounting

  return (
    <div><HomePage /></div>
  );
}
