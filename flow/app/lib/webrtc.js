let localStream;
let remoteStream;
let peerConnection;

const servers = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }], // Public STUN server
};

/**
 * Starts the local media stream (video/audio) and assigns it to the provided video element.
 * @param {object} localVideoRef - React ref for the local video element.
 */
export const startLocalStream = async (localVideoRef) => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = localStream;
    console.log('Local stream started.');
  } catch (error) {
    console.error('Error accessing media devices:', error);
    alert('Failed to access camera and microphone. Please check your permissions.');
  }
};

/**
 * Creates a peer connection and sets up event listeners for tracks and ICE candidates.
 * @param {object} remoteVideoRef - React ref for the remote video element.
 * @param {function} onIceCandidate - Callback to handle new ICE candidates.
 */
export const createPeerConnection = (remoteVideoRef, onIceCandidate) => {
  peerConnection = new RTCPeerConnection(servers);

  peerConnection.ontrack = (event) => {
    if (!remoteStream) {
      remoteStream = new MediaStream();
      remoteVideoRef.current.srcObject = remoteStream;
      console.log('Remote stream started.');
    }
    remoteStream.addTrack(event.track);
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log('New ICE candidate:', event.candidate);
      onIceCandidate(event.candidate);
    }
  };

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  console.log('Peer connection created and local tracks added.');
};

/**
 * Creates an SDP offer and sets it as the local description.
 * @returns {object} - The SDP offer.
 */
export const createOffer = async () => {
  try {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log('SDP offer created:', offer);
    return offer;
  } catch (error) {
    console.error('Error creating SDP offer:', error);
    throw new Error('Failed to create offer.');
  }
};

/**
 * Creates an SDP answer and sets it as the local description.
 * @returns {object} - The SDP answer.
 */
export const createAnswer = async () => {
  try {
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    console.log('SDP answer created:', answer);
    return answer;
  } catch (error) {
    console.error('Error creating SDP answer:', error);
    throw new Error('Failed to create answer.');
  }
};

/**
 * Sets the remote description for the peer connection.
 * @param {object} description - The remote SDP description.
 */
export const setRemoteDescription = async (description) => {
  try {
    const remoteDesc = new RTCSessionDescription(description);
    await peerConnection.setRemoteDescription(remoteDesc);
    console.log('Remote description set:', description);
  } catch (error) {
    console.error('Error setting remote description:', error);
    alert('Failed to set remote description.');
  }
};

/**
 * Adds a new ICE candidate to the peer connection.
 * @param {object} candidate - The ICE candidate to add.
 */
export const addIceCandidate = async (candidate) => {
  try {
    await peerConnection.addIceCandidate(candidate);
    console.log('ICE candidate added:', candidate);
  } catch (error) {
    console.error('Error adding ICE candidate:', error);
    alert('Failed to add ICE candidate.');
  }
};

/**
 * Ends the call by stopping local stream tracks and closing the peer connection.
 * Also clears the remote video element.
 * @param {object} remoteVideoRef - React ref for the remote video element.
 */
export const endCall = (remoteVideoRef) => {
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    console.log('Local stream stopped.');
  }

  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
    console.log('Peer connection closed.');
  }

  if (remoteStream) {
    remoteStream = null;
    remoteVideoRef.current.srcObject = null;
    console.log('Remote stream cleared.');
  }
};
