"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const ActivateAccount = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromURL = searchParams.get("token");

  useEffect(() => {
    // Check if the token is present in the URL
    if (tokenFromURL) {
      // Send the token to the API for activation
      axios
        .post("http://127.0.0.1:8000/api/activate/", { token: tokenFromURL })
        .then((response) => {
          // If activation is successful, set success message and redirect
          setMessage("Account activated successfully! Redirecting to login...");
          setError(false);

          // Redirect to login page after a delay
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        })
        .catch((err) => {
          // If request fails, log error details and show failure message
          console.error("Activation failed:", err);
          setMessage("Activation failed. Please try again.");
          setError(true);
        });
    } else {
      setMessage("Invalid activation link.");
      setError(true);
    }
  }, [tokenFromURL, router]);

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
