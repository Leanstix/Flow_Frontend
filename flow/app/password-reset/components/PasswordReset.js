"use client";
import { useState } from "react";
import { requestPasswordReset } from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function PasswordResetComponent() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const response = await requestPasswordReset(email);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err) {
      setError("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-96 p-6 shadow-2xl bg-white rounded-[30px]">
        <h1 className="text-3xl block text-center font-semibold">
          <i className="fa-solid fa-envelope"></i> Reset Password
        </h1>
        <hr className="mt-3" />
        <form onSubmit={handleSubmit}>
          <div className="mt-3">
            <label htmlFor="email" className="block text-base mb-2">
              Enter your email
            </label>
            <input
              type="email"
              id="email"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="border-2 border-purple-800 bg-purple-800 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-purple-800 font-semibold"
            >
              <i className="fa-solid fa-paper-plane"></i> Send Reset Link
            </button>
          </div>
          {message && <p className="text-green-500 text-center mt-3">{message}</p>}
          {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        </form>
        <div className="mt-3 text-center">
          <p>
            Remember your password?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
