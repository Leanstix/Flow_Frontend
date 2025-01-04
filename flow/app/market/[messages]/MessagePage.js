"use client";

import Message from "./components/mesage";
import { useState, useEffect } from "react";
import ErrorBoundary from "@/app/lib/ErrorBoundary";

export default function MessagePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div>
      <ErrorBoundary>
        <Message />
      </ErrorBoundary>
    </div>
  );
}
