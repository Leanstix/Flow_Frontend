'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  endCall,
} from '@/app/lib/webrtc';

const Room = ({ params }) => {
  const { chatRoom } = params;
  const [loading, setLoading] = useState(true);
  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [callStatus, setCallStatus] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleSignalMessage = async (message) => {
      try {
        switch (message.type) {
          case 'offer':
            await handleAnswerCall(message.offer);
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

    const startCall = async () => {
      setLoading(true);
      setCallStatus('Starting call...');
      try {
        console.log('Initializing WebSocket...');
        initWebSocket(chatRoom, handleSignalMessage);
        console.log('Starting local stream...');
        await startLocalStream(localVideoRef);
        console.log('Local stream started.');

        createPeerConnection(remoteVideoRef, (candidate) => {
          sendSignal({ type: 'new-ice-candidate', candidate });
        });

        const offer = await createOffer();
        sendSignal({ type: 'offer', offer });
        setInCall(true);
        setCallStatus('Call started.');
      } catch (error) {
        console.error('Failed to start the call:', error);
        alert('Failed to start the call. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    startCall();

    return () => {
      endCall(remoteVideoRef);
      closeWebSocket();
    };
  }, [chatRoom]);

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
      endCall(remoteVideoRef);
      closeWebSocket();
      setInCall(false);
      setCallStatus('Call ended.');
      router.push('/');
    } catch (error) {
      console.error('Error ending the call:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Room: {chatRoom}</h2>
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
          {callStatus && <p className="text-center text-gray-600">{callStatus}</p>}
        </div>
      </div>
    </div>
  );
};

export default Room;
