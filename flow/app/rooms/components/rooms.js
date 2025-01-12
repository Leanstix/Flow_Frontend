'use client';

import React, { useState } from 'react';
import { createRoom, joinRoom } from '@/app/lib/api'
import { useRouter } from 'next/navigation';

const JoinCreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const data = await createRoom();
      router.push(`/room/${data.room_name}`);
    } catch (error) {
      alert('Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomName) {
      alert('Please enter a room name.');
      return;
    }
    setLoading(true);
    try {
      const data = await joinRoom(roomName);
      router.push(`/room/${data.room_name}`);
    } catch (error) {
      alert('Failed to join room. Please check the room name and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Join or Create a Room</h2>
        <div className="space-y-4">
          <button
            onClick={handleCreateRoom}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Creating Room...' : 'Create Room'}
          </button>
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <input
              type="text"
              placeholder="Enter Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Joining Room...' : 'Join Room'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateRoom;
