import HomePage from "./components/[home]";
import { useState, useEffect } from "react";

export async function generateStaticParams() {
  return [
    { params: { home: 'home1' } },
    { params: { home: 'home2' } },
    { params: { home: 'home3' } }
  ];
}

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
