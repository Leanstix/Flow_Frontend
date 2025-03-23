"use client";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import FriendRequest from "./FriendRequest";
import Post from "./Post";
import ActiveUsers from "./ActiveUsers";
import Announcement from "./Announcement";
import Messages from "./Messages"; // Example: Add other components

const Layout = () => {
  const [activeSection, setActiveSection] = useState("home"); // State to track selected section

  return (
    <div className="bg-[#070007] min-h-screen">
      <Header />
      <div className="bg-[#070007] h-screen grid grid-cols-12 mt-5">
        
        {/* Left Sidebar */}
        <div className="col-span-3 bg-[#070007] border-r border-white h-screen p-3">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>

        {/* Middle Section (Content changes based on selected section) */}
        <div className="col-span-6 h-screen overflow-y-auto p-5">
          {activeSection === "home" && (
            <>
              <div className="flex space-x-4 mb-4">
                {["User1", "User2", "User3", "User4"].map((user, index) => (
                  <FriendRequest key={index} username={user} />
                ))}
              </div>
              <Post name="John Doe" username="johndoe" content="Great developers don’t just write code—they architect solutions." />
              <Post name="Jane Doe" username="janedoe" content="Build with purpose and make an impact." />
              <Post name="Jane Doe" username="janedoe" content="Build with purpose and make an impact."/>
              <Post name="Jane Doe" username="janedoe" content="Build with purpose and make an impact."/>
              <Post name="John Doe" username="johndoe" content="Great developers don’t just write code—they architect solutions."/>
              <Post name="Jane Doe" username="janedoe" content="Build with purpose and make an impact."/>
              <Post name="Jane Doe" username="janedoe" content="Build with purpose and make an impact."/>
            </>
          )}
          {activeSection === "messages" && <Messages />}
          {activeSection === "notifications" && <p className="text-white">Notifications Page</p>}
          {activeSection === "market" && <p className="text-white">Market Section</p>}
        </div>

        {/* Right Sidebar (Can change based on selection if needed) */}
        <div className="col-span-3 text-white border-l h-screen p-3">
          <ActiveUsers users={["UserA", "UserB", "UserC", "UserD", "UserE"]} />
          <Announcement />
        </div>
      </div>
    </div>
  );
};

export default Layout;
