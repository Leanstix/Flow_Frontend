"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";// Import useRouter from next/navigation
import Cookies from "js-cookie"; // Import js-cookie library
import { login } from "@/app/lib/api";

export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState([])
  const [mounted, setMounted] = useState(false);
  const router = useRouter(); // Initialize router here

  // Ensure the component only mounts on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
  
      if (!response) throw new Error('Empty response from login API');
  
      const {
        access,
        email: userEmail,
        user_id,
        university_id,
        refresh,
        ...extraContents
      } = response;
  
      //console.log("Login response:", response);
  
      const additionalFieldsExist = Object.keys(extraContents).length > 0;
  
      // Save the full response as a cookie
      Cookies.set("user_data", JSON.stringify(response), {
        expires: 7, // 7 days expiration
        secure: true,
        sameSite: "strict",
      });
  
      if (additionalFieldsExist) {
        if (mounted) {
          const cookieData = Cookies.get("user_data");
          if (cookieData) {
            const parsedData = JSON.parse(cookieData); // Parse the cookie data
            const { university_id } = parsedData; // Extract user_name
            setUserData(parsedData); // Set the full user data
            router.push(`/${university_id}`); // Dynamically navigate to the user_name route
          }
        }
      } else {
        if (mounted) router.push("/user-info");
      }
    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    }
  };

  if (!mounted) return null; // Prevents server-side rendering issues

  return (
    <div className="flex justify-center items-center h-screen bg-[#070007]">
      <div className="w-96 p-6 shadow-2xl bg-white rounded-[30px]">
        <h1 className="text-3xl block text-center font-semibold">
          <i className="fa-solid fa-user"></i> Log In
        </h1>
        <hr className="mt-3" />
        <form onSubmit={handleSubmit}>
          <div className="mt-3">
            <label htmlFor="email" className="block text-base mb-2">
              Username
            </label>
            <input
              type="email"
              id="email"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-3">
            <label htmlFor="password" className="block text-base mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mt-3 flex justify-between items-center">
            <div>
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe" className="ml-1">
                Remember Me
              </label>
            </div>
            <div>
            <a
              onClick={() => router.push("/password-reset")}
              className="text-purple-800 font-semibold cursor-pointer hover:underline"
            >
              Forgot Password?
            </a>
            </div>
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="border-2 border-purple-800 bg-purple-800 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-purple-800 font-semibold"
            >
              <i className="fa-solid fa-right-to-bracket"></i> Login
            </button>
          </div>
          {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        </form>
        
        {/* Signup link */}
        <div className="mt-3 text-center">
          <p>
            Don&apos;t have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Signup
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}