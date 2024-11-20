"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // For accessing cookies
import { logout } from "@/app/lib/api";
import { useRouter } from "next/navigation"; // For navigation
import Image from "next/image"; // Import Next.js Image component

export default function HomePage() {
  const [userData, setUserData] = useState(null);
  const router = useRouter(); // Initialize router for navigation

  // Fetch user data from cookies on component mount
  useEffect(() => {
    const cookieData = Cookies.get("user_data");
    if (cookieData) {
      setUserData(JSON.parse(cookieData));
    }
  }, []);

  if (!userData) {
    return <div>Loading...</div>; // Show a loading indicator while fetching user data
  }

  const {
    first_name,
    last_name,
    email,
    UserName,
    bio,
    posts = [],
  } = userData;

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout API
      Cookies.remove("user_data"); // Remove user data cookie
      router.push("/login"); // Redirect to the login page
    } catch (err) {
      console.error("Logout failed:", err);
      alert("An error occurred during logout. Please try again.");
    }
  };

  return (
    <div className="w-screen text-black bg-white flex items-center justify-center">
      <div className="block justify-center items-center m-6">
        {/* User Profile Section */}
        <div className="flex items-center">
            <Image
                src="https://via.placeholder.com/200"
                alt="User profile"
                className="rounded-full mb-2"
                width={200}
                height={200}
                unoptimized // Disables optimization for this image
            />
        </div>
        <div>
            <div className="font-bold text-[26px]">
            {first_name} {last_name} (
            <span className="font-normal text-[18px]">{email}</span>)
            </div>
            <div className="font-light text-center">
            {bio}
            </div>
        </div>
        <div className="flex mt-6">
          <div className="bg-purple-500 px-3 rounded-lg w-fit py-1 text-[26px] text-white font-bold">
            Messages
          </div>
          <div className="bg-purple-500 px-3 rounded-lg w-fit py-1 text-[26px] text-white font-bold mx-5">
            Flowmates
          </div>
          <div className="bg-purple-500 px-3 rounded-lg w-fit py-1 text-[26px] text-white font-bold">
            Followers
          </div>
        </div>
        <div className="-ml-6">
          <div className="mt-3 bg-purple-500 w-fit px-3 py-1 font-bold text-white rounded-lg">
            New Post
          </div>
        </div>
        {/* Logout Button */}
        <div className="mt-5">
          <button
            onClick={handleLogout}
            className="border-2 border-red-500 bg-red-500 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-red-500 font-semibold"
          >
            Logout
          </button>
        </div>
        {/* User Posts Section */}
        <div>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={index} className="mt-3 flex w-fit py-1 font-bold rounded-lg">
                <Image
                  src="https://via.placeholder.com/60"
                  width={60}
                  height={60}
                  className="rounded-full -ml-6"
                  alt="Post user profile"
                  priority // Optimized for performance
                />
                <p className="ml-1 text-[20px]">
                  {UserName} (<span className="text-gray-600 text-[16px]">{email}</span>)
                </p>
                <p>posted on {post.date}</p>
                <div>
                  <p>{post.content}</p>
                  <hr />
                  <div className="grid grid-cols-4">
                    <div className="col-span-1">❤({post.likes})</div>
                    <div className="col-span-1">comments({post.comments})</div>
                    <div className="col-span-1">Reposts({post.reposts})</div>
                    <div className="col-span-1">Report Post</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
