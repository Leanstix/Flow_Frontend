"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ActivateAccount = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      // Store the token in localStorage or state
      localStorage.setItem("activation_token", token);
      setMessage("Account activated successfully! Redirecting to login...");
      
      // Redirect to login page after a delay
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      setMessage("Invalid activation link.");
      setError(true);
    }
  }, [token, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 p-6 shadow-lg bg-white rounded-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">
          {error ? "Activation Failed" : "Activating Account"}
        </h1>
        <p className={error ? "text-red-600" : "text-green-600"}>{message}</p>
      </div>
    </div>
  );
};

export default ActivateAccount;
