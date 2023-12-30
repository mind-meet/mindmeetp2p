// put webrtc methods here 
// controll connection here (peer and data channel)
import Peer from 'peerjs';

let localPeer = null;
let dataChannel = null;

let localStream = null;
let remoteStream = null;