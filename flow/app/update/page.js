"use client";
import UpdateUserProfile from "./components/UpdateUserProfile";
import { useState, useEffect } from "react";

export default function Update() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div>
      <UpdateUserProfile />
    </div>
  );
}
