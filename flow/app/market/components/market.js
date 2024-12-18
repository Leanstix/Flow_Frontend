"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  fetchAdvertisements,
  fetchAdvertisementDetails,
  sendMessageToSeller,
  createAdvertisement,
} from "@/app/lib/api"; // Import API functions

export default function Marketplace() {
  const [advertisements, setAdvertisements] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isAdDetailsModalOpen, setIsAdDetailsModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [sellerEmail, setSellerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [adData, setAdData] = useState({ title: "", description: "", price: "", imageURL: "" });
  const [isMounted, setIsMounted] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setIsMounted(true);
    loadAdvertisements();
  }, []);

  // Fetch advertisements
  const loadAdvertisements = async () => {
    try {
      const ads = await fetchAdvertisements();
      setAdvertisements(ads);
    } catch (error) {
      console.error("Error loading advertisements:", error);
    }
  };

  // Open advertisement details modal
  const openAdDetails = async (adId) => {
    try {
      const adDetails = await fetchAdvertisementDetails(adId);
      setSelectedAd(adDetails);
      setIsAdDetailsModalOpen(true);
    } catch (error) {
      console.error("Error fetching advertisement details:", error);
    }
  };

  const closeAdDetailsModal = () => {
    setIsAdDetailsModalOpen(false);
    setSelectedAd(null);
  };

  // Open and close message modal
  const openMessageModal = (email) => {
    setSellerEmail(email);
    setIsMessageModalOpen(true);
  };
  const closeMessageModal = () => {
    setIsMessageModalOpen(false);
    setMessage("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdData({ ...adData, image: file });
    }
  };

  // Open and close the ad posting modal
  const openAdModal = () => setIsAdModalOpen(true);
  const closeAdModal = () => {
    setIsAdModalOpen(false);
    setAdData({ title: "", description: "", price: "", image: "" });
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const messageData = { message };
      await sendMessageToSeller(selectedAd?.id, messageData);
      alert("Message sent successfully!");
      closeMessageModal();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Handle creating a new advertisement
  const handleCreateAd = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", adData.title);
      formData.append("description", adData.description);
      formData.append("price", adData.price);
      formData.append("image", adData.image); // Image file
  
      const newAd = await createAdvertisement(formData); // Pass FormData
      console.log("Advertisement created:", newAd);
      closeAdModal();
      loadAdvertisements();
    } catch (error) {
      console.error("Failed to create advertisement:", error);
    }
  };

  if (!isMounted) return null; // Prevent rendering until mounted

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Market Place</h1>
          <button
            onClick={openAdModal}
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100"
          >
            Post Advertisement
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advertisements.map((ad) => (
            <div key={ad.id} className="bg-white shadow-md rounded-md overflow-hidden">
              <Image
                src={ad.image_url || "https://via.placeholder.com/400x300"}
                alt={ad.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="text-lg font-semibold">{ad.title}</div>
                <div className="text-gray-600 mt-2 text-sm">
                  {ad.description?.slice(0, 60)}...
                </div>
                <p className="text-blue-600 mt-2 font-bold">${ad.price}</p>
              </div>
              <div className="flex justify-between items-center p-4 border-t">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => openAdDetails(ad.id)}
                >
                  View Details
                </button>
                <button
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                  onClick={() => openMessageModal(ad.seller_email)}
                >
                  Message Seller
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Post Advertisement Modal */}
      {isAdModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-md w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Post Advertisement</h2>
            <form onSubmit={handleCreateAd}>
              <input
                className="w-full border rounded-md p-2 mb-4"
                placeholder="Title"
                value={adData.title}
                onChange={(e) => setAdData({ ...adData, title: e.target.value })}
              />
              <textarea
                className="w-full border rounded-md p-2 mb-4"
                placeholder="Description"
                rows="4"
                value={adData.description}
                onChange={(e) => setAdData({ ...adData, description: e.target.value })}
              />
              <input
                className="w-full border rounded-md p-2 mb-4"
                placeholder="Price"
                type="number"
                value={adData.price}
                onChange={(e) => setAdData({ ...adData, price: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-md p-2 mb-4"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeAdModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Post Ad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advertisement Details Modal */}
      {isAdDetailsModalOpen && selectedAd && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-md w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold mb-4">{selectedAd.title}</h2>
            <Image
              src={selectedAd.image_url || "https://via.placeholder.com/400x300"}
              alt={selectedAd.title}
              width={400}
              height={300}
              className="w-full h-48 object-cover mb-4"
            />
            <p className="text-gray-700 mb-4">{selectedAd.description}</p>
            <p className="text-blue-600 font-bold mb-4">${selectedAd.price}</p>
            <div className="flex justify-end">
              <button
                onClick={closeAdDetailsModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
              >
                Close
              </button>
              <button
                onClick={() => openMessageModal(selectedAd.seller_email)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Message Seller
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Seller Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-md w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Send Message</h2>
            <form onSubmit={handleSendMessage}>
              <textarea
                className="w-full border rounded-md p-2 mb-4"
                placeholder="Write your message here..."
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeMessageModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
