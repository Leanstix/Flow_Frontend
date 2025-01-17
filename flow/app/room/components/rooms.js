'use client';

import React, { useState, useRef } from 'react';
import { createRoom, joinRoom } from '@/app/lib/api';
import {
  initWebSocket,
  sendSignal,
  closeWebSocket,
} from '@/app/lib/api';
import {
  startLocalStream,
  createPeerConnection,
  createOffer,
  createAnswer,
  setRemoteDescription,
  addIceCandidate,
} from '@/app/lib/webrtc';
import { useRouter } from 'next/navigation';

const JoinCreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [callStatus, setCallStatus] = useState(''); // Added for status messages
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const router = useRouter();

  const handleCreateRoom = async () => {
    setLoading(true);
    setCallStatus('Creating room...');
    try {
      const data = await createRoom();
      setRoomName(data.room_name);
      router.push(`/room/${data.room_name}`);
    } catch (error) {
      alert('Failed to create room. Please try again.');
    } finally {
      setLoading(false);
      setCallStatus('');
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomName) {
      alert('Please enter a room name.');
      return;
    }
    setLoading(true);
    setCallStatus('Joining room...');
    try {
      const data = await joinRoom(roomName);
      router.push(`/room/${data.room_name}`);
    } catch (error) {
      alert('Failed to join room. Please check the room name and try again.');
    } finally {
      setLoading(false);
      setCallStatus('');
    }
  };

  const handleStartCall = async () => {
    if (!roomName) {
      alert('Please create or join a room first.');
      return;
    }
    setLoading(true);
    setCallStatus('Starting call...');
    try {
      initWebSocket(roomName, handleSignalMessage);
      await startLocalStream(localVideoRef);

      createPeerConnection(remoteVideoRef, (candidate) => {
        sendSignal({ type: 'new-ice-candidate', candidate });
      });

      const offer = await createOffer();
      sendSignal({ type: 'offer', offer });
      setInCall(true);
      setCallStatus('Call started.');
    } catch (error) {
      alert('Failed to start the call. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerCall = async (offer) => {
    try {
      setCallStatus('Answering call...');
      await setRemoteDescription(offer);
      const answer = await createAnswer();
      sendSignal({ type: 'answer', answer });
      setCallStatus('Call connected.');
    } catch (error) {
      alert('Failed to answer the call.');
    }
  };

  const handleSignalMessage = async (message) => {
    try {
      switch (message.type) {
        case 'offer':
          handleAnswerCall(message.offer);
          break;
        case 'answer':
          await setRemoteDescription(message.answer);
          setCallStatus('Call connected.');
          break;
        case 'new-ice-candidate':
          await addIceCandidate(message.candidate);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error handling signal message:', error);
    }
  };

  const handleToggleMute = () => {
    const localStream = localVideoRef.current.srcObject;
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = muted;
      setMuted(!muted);
    }
  };

  const handleEndCall = () => {
    setLoading(true);
    setCallStatus('Ending call...');
    try {
      const localStream = localVideoRef.current.srcObject;
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      closeWebSocket();
      setInCall(false);
      setRoomName('');
      setCallStatus('Call ended.');
    } catch (error) {
      console.error('Error ending the call:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Join or Create a Room</h2>
        <div className="space-y-4">
          {!inCall ? (
            <>
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
              <button
                onClick={handleStartCall}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                disabled={!roomName || loading}
              >
                {loading ? 'Starting Call...' : 'Start Call'}
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-4">
                <video ref={localVideoRef} autoPlay muted className="w-1/2 rounded-lg" />
                <video ref={remoteVideoRef} autoPlay className="w-1/2 rounded-lg" />
              </div>
              <div className="flex justify-around">
                <button
                  onClick={handleToggleMute}
                  className={`${
                    muted ? 'bg-red-600' : 'bg-green-600'
                  } text-white py-2 px-4 rounded-lg`}
                >
                  {muted ? 'Unmute' : 'Mute'}
                </button>
                <button
                  onClick={handleEndCall}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg"
                  disabled={loading}
                >
                  {loading ? 'Ending Call...' : 'End Call'}
                </button>
              </div>
            </div>
          )}
          {callStatus && <p className="text-center text-gray-600">{callStatus}</p>}
        </div>
      </div>
    </div>
  );
};

export default JoinCreateRoom;
