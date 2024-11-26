"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { logout, createPost, getPosts } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const [userData, setUserData] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [showPostPopup, setShowPostPopup] = useState(false);
  const router = useRouter();

  // Fetch user data and posts on component mount
  useEffect(() => {
    const cookieData = Cookies.get("user_data");
    if (cookieData) {
      const parsedData = JSON.parse(cookieData);
      setUserData(parsedData);
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      alert("An error occurred while fetching posts. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Cookies.remove("user_data");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("An error occurred during logout. Please try again.");
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      alert("Post content cannot be empty!");
      return;
    }
    try {
      const response = await createPost(newPostContent);
      setPosts([response, ...posts]);
      setNewPostContent("");
      setShowPostPopup(false);
    } catch (err) {
      console.error("Failed to create post:", err);
      alert("An error occurred while creating the post. Please try again.");
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { first_name, last_name, email, UserName, bio } = userData;

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
            unoptimized
          />
        </div>
        <div>
          <div className="font-bold text-[26px]">
            {first_name} {last_name} (
            <span className="font-normal text-[18px]">{email}</span>)
          </div>
          <div className="font-light text-center">{bio}</div>
        </div>
        {/* Buttons */}
        <div className="flex mt-6">
          <div className="bg-purple-500 px-3 rounded-lg w-fit py-1 text-[26px] text-white font-bold">
            Messages
          </div>
          <button
            onClick={() => router.push("/flowmates")}
            className="bg-purple-500 px-3 rounded-lg w-fit py-1 text-[26px] text-white font-bold mx-5"
          >
            Flowmates
          </button>
          <div className="bg-purple-500 px-3 rounded-lg w-fit py-1 text-[26px] text-white font-bold">
            Followers
          </div>
        </div>
        {/* New Post Button */}
        <button
          onClick={() => setShowPostPopup(true)}
          className="mt-3 bg-purple-500 w-fit px-3 py-1 font-bold text-white rounded-lg"
        >
          New Post
        </button>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-5 border-2 border-red-500 bg-red-500 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-red-500 font-semibold"
        >
          Logout
        </button>
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
                  priority
                />
                <p className="ml-1 text-[20px]">
                  {UserName} (<span className="text-gray-600 text-[16px]">{email}</span>)
                </p>
                <p>posted on {post.date}</p>
                <div>
                  <p>{post.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>
        {/* New Post Popup */}
        {showPostPopup && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full h-24 border rounded-md p-2"
                placeholder="What's on your mind?"
              ></textarea>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => setShowPostPopup(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
