let localStream;
let remoteStream;
let peerConnection;

const servers = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }], // Public STUN server
};

export const startLocalStream = async (localVideoRef) => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = localStream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
};

export const createPeerConnection = (remoteVideoRef, onIceCandidate) => {
  peerConnection = new RTCPeerConnection(servers);

  peerConnection.ontrack = (event) => {
    if (!remoteStream) {
      remoteStream = new MediaStream();
      remoteVideoRef.current.srcObject = remoteStream;
    }
    remoteStream.addTrack(event.track);
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });
};

export const createOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  return offer;
};

export const createAnswer = async () => {
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  return answer;
};

export const setRemoteDescription = async (description) => {
  const remoteDesc = new RTCSessionDescription(description);
  await peerConnection.setRemoteDescription(remoteDesc);
};

export const addIceCandidate = async (candidate) => {
  try {
    await peerConnection.addIceCandidate(candidate);
  } catch (error) {
    console.error('Error adding ICE candidate:', error);
  }
};
