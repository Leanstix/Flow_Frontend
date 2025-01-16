"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user_data");

    if (!userData) {
      router.push("/login");
      setLoading(false);
      return;
    }

    const refresh_token = localStorage.getItem("refreshToken");
    const cookieData = Cookies.get("user_data");

    const isTokenValid = (token) => {
      try {
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) return false;
        const payload = JSON.parse(atob(tokenParts[1]));
        return payload.exp * 1000 > Date.now();
      } catch {
        return false;
      }
    };
    if (cookieData) {
      const { university_id } = JSON.parse(data);
      if (isTokenValid(refresh_token)) {
        setIsAuthenticated(true);
        console.log("User is authenticated");
        router.push(`/${university_id}`);
      } else {
        console.log("User is not authenticated");
        router.push("/login");
      }
    }
    setLoading(false);
  }, [router]);

  if (loading) return <p>Loading...</p>;

  if (!isAuthenticated) return null;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Existing content here */}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* Existing footer here */}
      </footer>
    </div>
  );
}
