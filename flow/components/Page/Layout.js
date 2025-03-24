"use client";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import FriendRequest from "./FriendRequest";
import Post from "./Post";
import ActiveUsers from "./ActiveUsers";
import Announcement from "./Announcement";
import ChatComponent from "@/app/messages/components/messages";

const Layout = () => {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div className="bg-[#070007] min-h-screen">
      <Header />
      <div className="bg-[#070007] h-screen grid grid-cols-12 mt-5">
        
        {/* Left Sidebar */}
        <div className="col-span-3 bg-[#070007] border-r border-white h-screen p-3">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>

        {/* Middle Section (Content changes based on selection) */}
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
            </>
          )}
          {activeSection === "message" && <ChatComponent />}
          {activeSection === "trending" && <p className="text-white">Trending Content</p>}
          {activeSection === "requests" && <p className="text-white">Friend Requests</p>}
          {activeSection === "groups" && <p className="text-white">Groups Section</p>}
          {activeSection === "market" && <p className="text-white">Marketplace</p>}
          {activeSection === "notification" && <p className="text-white">Notifications</p>}
          {activeSection === "events" && <p className="text-white">Upcoming Events</p>}
          {activeSection === "logout" && <p className="text-white">Logging out...</p>}
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 text-white border-l h-screen p-3">
          <ActiveUsers users={["UserA", "UserB", "UserC", "UserD", "UserE", "UserA", "UserB", "UserC", "UserD", "UserE"]} />
          <Announcement />
        </div>
      </div>
    </div>
  );
};

export default Layout;
