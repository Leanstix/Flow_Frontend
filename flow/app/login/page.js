"use client";
import LoginComponent from "./components/LogIn";
import { useState, useEffect } from "react";

export default function Login() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // This ensures that LoginComponent renders only after mounting

  return (
    <div><LoginComponent /></div>
  );
}
