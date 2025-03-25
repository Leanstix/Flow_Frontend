import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatComponent from "@/app/messages/components/messages";
import FriendRequest from "./FriendRequest";
import Post from "./Post";
import ActiveUsers from "./ActiveUsers";
import Announcement from "./Announcement";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import api from "@/app/api"; // Ensure you have this import

const Layout = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const accessToken = localStorage.getItem("authToken");
        if (!accessToken) {
          throw new Error("User not authenticated. Please log in.");
        }
        const config = { headers: { Authorization: `Bearer ${accessToken}` } };
        const response = await api.get("/friend-requests/", config);
        setFriendRequests(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  return (
    <div className="bg-[#070007] h-screen">
      <Header />
      <div className="bg-[#070007] h-screen grid grid-cols-12 mt-5">
        {/* Left Sidebar */}
        <div className="col-span-3 bg-[#070007] border-r border-white h-screen p-3">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>

        {/* Middle Section */}
        <div className="col-span-6 h-screen overflow-y-auto p-5">
          {activeSection === "home" && (
            <>
              {/* Friend Request Splide Carousel */}
              {loading ? (
                <p className="text-gray-500">Loading friend requests...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : friendRequests.length === 0 ? (
                <p className="text-gray-500">No friend requests</p>
              ) : (
                <Splide
                  options={{
                    type: "slide",
                    perPage: 4,
                    breakpoints: {
                      1024: { perPage: 3 },
                      768: { perPage: 2 },
                      480: { perPage: 1 },
                    },
                    perMove: 1,
                    pagination: false,
                    arrows: true,
                    gap: "1rem",
                  }}
                  className="mb-4"
                >
                  {friendRequests.map((user, index) => (
                    <SplideSlide key={index}>
                      <FriendRequest username={user.username} />
                    </SplideSlide>
                  ))}
                </Splide>
              )}

              {/* Posts Section */}
              <Post name="John Doe" username="johndoe" content="Great developers don’t just write code—they architect solutions." />
              <Post name="Jane Doe" username="janedoe" content="Build with purpose and make an impact." />
            </>
          )}

          {activeSection === "message" && selectedConversationId && (
            <ChatComponent 
              selectedConversationId={selectedConversationId}
              setSelectedConversationId={setSelectedConversationId}
              showOnlyMessages
              className="h-screen overflow-y-auto"
            />
          )}

          {activeSection === "message" && !selectedConversationId && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-xl">Select a conversation to start chatting</p>
            </div>
          )}

          {activeSection !== "message" && <p className="text-white">{activeSection} Content</p>}
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 text-white border-l h-screen p-3 flex flex-col">
          {activeSection === "message" ? (
            <ChatComponent 
              setSelectedConversationId={setSelectedConversationId}
              showOnlyConversations
              className="h-screen overflow-y-auto"
            />
          ) : (
            <>
              <div className="h-1/2 overflow-y-auto">
                <ActiveUsers users={["UserA", "UserB", "UserC", "UserD", "UserE", "UserF", "UserG", "UserH"]} />
              </div>
              <div className="h-1/2 overflow-y-auto mt-2">
                <Announcement />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
