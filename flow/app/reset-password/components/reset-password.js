"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/lib/api";

export default function ResetPasswordComponent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const uid = searchParams.get("uid");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await resetPassword(uid, token, password);
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-96 p-6 shadow-2xl bg-white rounded-[30px]">
        <h1 className="text-3xl block text-center font-semibold">
          <i className="fa-solid fa-lock"></i> Set New Password
        </h1>
        <hr className="mt-3" />
        <form onSubmit={handleSubmit}>
          <div className="mt-3">
            <label htmlFor="password" className="block text-base mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter new password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mt-3">
            <label htmlFor="confirmPassword" className="block text-base mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Confirm new password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="border-2 border-purple-800 bg-purple-800 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-purple-800 font-semibold"
            >
              <i className="fa-solid fa-check"></i> Reset Password
            </button>
          </div>
          {message && <p className="text-green-500 text-center mt-3">{message}</p>}
          {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        </form>
        <div className="mt-3 text-center">
          <p>
            Remembered your password?{" "}
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
