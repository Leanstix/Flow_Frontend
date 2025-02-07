"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  logout,
  createPost,
  getPosts,
  toggleLike,
  addComment,
  repost,
  reportPost,
  acceptFriendRequest,
  getFriendRequests,
  getFriends,
  fetchComments,
  sendMessage,
  createConversation,
  searchPostsByUser,
  getFeedPosts,
} from "@/app/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [postComments, setPostComments] = useState({});
  const [showPostPopup, setShowPostPopup] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [friends, setFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const [activePostId, setActivePostId] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const cookieData = Cookies.get("user_data");
    if (cookieData) {
      setUserData(JSON.parse(cookieData));
    }
    fetchPosts();
  }, []);
  

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getFeedPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  const getUserPosts = async () => {
    try {
      setLoading(true); // Show loading indicator
      const response = await searchPostsByUser(searchQuery);
      
     setPosts(response.data)
    } catch (err) {
      console.error("Error fetching user posts:", err.message);
      setError(err.message); // Set error state
    } finally {
      setLoading(false); // 
    }
  };
  

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    getUserPosts()
  };


  const handleSendMessage = async (ConversationId) => {
    if (!messageContent.trim()) {
      console.log("Message content cannot be empty!");
      return;
    }
    try {
      const conversation = ConversationId
      const message = await sendMessage(conversation, messageContent);
      console.log("Message sent!");
      setMessageContent("");
      setSelectedFriendId(null);
    } catch (error) {
      console.error("Failed to send message:", error);
      console.log("Failed to send message. Please try again.");
    }
  };

  const getComments = async (postId) => {
    try {
      const response = await fetchComments(postId);
      setPostComments((prev) => ({
        ...prev,
        [postId]: response.results,
      }));
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setPostComments((prev) => ({
        ...prev,
        [postId]: [],
      }));
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const fetchedRequests = await getFriendRequests();
      setFriendRequests(fetchedRequests);
    } catch (err) {
      console.error("Failed to fetch friend requests:", err);
      console.log("Could not load friend requests. Please try again later.");
    }
  };

  const fetchFriends = async () => {
    try {
      const fetchedFriends = await getFriends();
      setFriends(fetchedFriends);
    } catch (err) {
      console.error("Failed to fetch friends:", err);
      console.log("Could not load friends. Please try again later.");
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await acceptFriendRequest(requestId);
      console.log("Accept Friend Request Response:", response);
  
      // Validate response structure
      if (!response || typeof response.from_user_id === "undefined" || typeof response.to_user_id === "undefined") {
        throw new Error("Invalid response structure from acceptFriendRequest");
      }
  
      // Remove the accepted request from state
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
      console.log("Friend request accepted:", response);
  
      // Create a conversation
      const conversationResponse = await createConversation([
        response.from_user_id,
        response.to_user_id,
      ]);
      console.log("Conversation created:", conversationResponse);
    } catch (err) {
      console.error("Error accepting friend request:", err);
      alert("Failed to accept friend request. Please try again."); // User feedback
    }
  };
  
  

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      console.log("Post content cannot be empty!");
      return;
    }
    try {
      const response = await createPost(newPostContent);
      setPosts([response, ...posts]);
      setNewPostContent("");
      setShowPostPopup(false);
      console.log("Post created successfully!");
    } catch (err) {
      console.error("Failed to create post:", err);
      console.log("Failed to create post. Please try again.");
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentContent.trim()) {
      console.log("Comment cannot be empty!");
      return;
    }
    try {
      const newComment = await addComment(postId, commentContent);
      setPostComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));
      setCommentContent("");
      setActivePostId(null);
      console.log("Comment added!");
    } catch (err) {
      console.error("Failed to add comment:", err);
      console.log("Failed to add comment. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Cookies.remove("user_data");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      console.log("Logout failed. Please try again.");
    }
  };

  const openMessageModal = (friendId) => {
    setSelectedFriendId(friendId);
  };

  const loadMorePosts = () => {
    if (hasMore && !loading) {
      getUserPosts(currentPage + 1);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { first_name, last_name, email, bio, profile_picture } = userData;
  const profile_pic = userData.profile_picture || "https://via.placeholder.com/200";

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Flow</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        {/* User Profile */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-6">
            <img
              src={profile_pic}
              alt="Profile Picture"
              width={200}
              height={200}
              className="rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">
                {first_name} {last_name}
              </h2>
              <p className="text-gray-600">{email}</p>
              <p className="mt-2 text-gray-700 italic">{bio}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => {
              setShowFriendRequests(true);
              fetchFriendRequests();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            View Flow Requests
          </button>
          <button
            onClick={() => {
              setShowFriends(true);
              fetchFriends();
            }}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
          >
            View Friends
          </button>
          <button
            onClick={() => setShowPostPopup(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            New Post
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search your posts..."
            value={searchQuery}
            onChange={handleInputChange}
            style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
          />
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white shadow rounded-lg p-4 flex flex-col space-y-2"
              >
                <h3 className="font-bold text-lg">{post.author}</h3>
                <p>{post.content}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleString()}
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-4 text-blue-500">
                  <button onClick={() => toggleLike(post.id)}>Like</button>
                  <button onClick={() => setActivePostId(post.id)}>Comment</button>
                  <button onClick={() => repost(post.id)}>Repost</button>
                  <button
                    onClick={() => {
                      setActivePostId(post.id);
                      getComments(post.id);
                    }}
                  >
                    View Comments
                  </button>
                </div>

                {/* Comments Section */}
                <div className="mt-2 space-y-2">
                  {activePostId === post.id && postComments[post.id] ? (
                    postComments[post.id].length > 0 ? (
                      postComments[post.id].map((comment, index) => (
                        <div key={index} className="p-2 border-b">
                          <p>
                            <strong>{comment.user.username}:</strong> {comment.content}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="italic text-gray-500">No comments yet.</p>
                    )
                  ) : null}
                </div>

                {/* Add Comment Section */}
                {activePostId === post.id && (
                  <div className="mt-2">
                    <textarea
                      className="w-full p-2 border rounded-md"
                      rows="2"
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Type your comment here..."
                    ></textarea>
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2"
                    >
                      Submit Comment
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No posts available.</p>
          )}
        </div>
      </div>

      {/* Friend List Modal */}
      {showFriends && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Friends List</h2>
            {Array.isArray(friends) && friends.length > 0 ? (
              friends.map((friend, index) => (
                <div key={index} className="grid grid-cols-2">
                  <div className="flex justify-between items-center mb-4">
                    <p>{friend.user_name}</p>
                    <button
                      onClick={() => openMessageModal(friend.conversation_id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Message
                    </button>
                  </div>
                </div>
                
              ))
            ) : (
              <p>No friends found.</p>
            )}
            <button
              onClick={() => setShowFriends(false)}
              className="mt-4 w-full bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Friend Requests Modal */}
      {showFriendRequests && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
            {Array.isArray(friendRequests) && friendRequests.length > 0 ? (
              friendRequests.map((request) => (
                <div key={request.id} className="flex justify-between items-center mb-4">
                  <p>{request.sender}</p>
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Accept
                  </button>
                </div>
              ))
            ) : (
              <p>No friend requests.</p>
            )}
            <button
              onClick={() => setShowFriendRequests(false)}
              className="mt-4 w-full bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {selectedFriendId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Send a Message</h2>
              <textarea
                className="w-full p-2 border rounded-md"
                rows="4"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message here..."
              ></textarea>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleSendMessage(selectedFriendId)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Send
                </button>
                <button
                  onClick={() => setSelectedFriendId(null)}
                  className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      {/* New Post Modal */}
      {showPostPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            <textarea
              className="w-full p-2 border rounded-md"
              rows="4"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind?"
            ></textarea>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleCreatePost}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Post
              </button>
              <button
                onClick={() => setShowPostPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
