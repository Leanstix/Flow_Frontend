"use client";

import HomePage from "./components/UserHome";
import { useState, useEffect } from "react";

export default function UserHome() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Ensures rendering happens only after mounting

  return (
    <div>
      <HomePage />
    </div>
  );
}
