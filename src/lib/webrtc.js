import Peer from 'peerjs';

let localPeer = null;
let dataChannel = null;
let peerCall = null;

let localPeerIsOpen = false;

let localStream = null;
let remoteStream = null;

const init = (id) => {
    localPeer = null;
    localPeerIsOpen = false;

    localPeer = new Peer(id);

    // TODO : MAKE A BEATIFUL PROMISSE WITH RESOLVE AND REJECT
    return new Promise((resolve, reject) => {
        localPeer.on('open', () => {
            console.log('peer open');
            localPeerIsOpen = true;
            resolve();
        });

        localPeer.on('connection', (conn) => {
            console.log('peer connection');
            dataChannel = conn;

            dataChannel.on('open', () => {
                console.log('data channel open');

                dataChannel.on('data', (data) => {
                    console.log('data channel data', data);
                });

                // REMOVE THIS
                sendToChannel('hello');
            });
        });

        localPeer.on('error', (err) => {
            console.log('peer error', err);
            reject(err);
        })

        localPeer.on('call', async (call) => {
            console.log('peer call');
            peerCall = call;
            
            console.log('peer call answer');
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            call.answer(localStream);
            call.on('stream', (stream) => {
                console.log('peer call stream');
                remoteStream = stream;
            });
        });
    })
}

async function connect(id){
    if (!localPeerIsOpen) return false;

    const conn = localPeer.connect(id);
    dataChannel = conn;

    // TODO : MAKE A BEATIFUL PROMISSE WITH RESOLVE AND REJECT
    return new Promise((resolve, reject) => {
        dataChannel.on('open', () => {
            console.log('data channel open');

            dataChannel.on('data', (data) => {
                console.log('data channel data', data);
            });
        
            // REMOVE THIS
            sendToChannel('hello');

            resolve();
        });

        dataChannel.on('error', (err) => {
            console.log('data channel error', err);
            reject(err);
        });
    }
)}   

const call = async (id) => {
    if (!localStream || typeof localStream === 'undefined') return false;

    const call = localPeer.call(id, localStream);
    peerCall = call;

    // TODO : MAKE A BEATIFUL PROMISSE WITH RESOLVE AND REJECT
    return new Promise((resolve, reject) => {
        peerCall.on('stream', (stream) => {
            console.log('peer call stream');
            remoteStream = stream;
            resolve();
        });

        peerCall.on('error', (err) => {
            console.log('peer call error', err);
            reject(err);
        });
    })
}

function sendToChannel(data) {
    if(!dataChannel) return
    dataChannel.send(data); 
}

const getLocalStream = () => {
    return localStream;
}

const setLocalStream = (stream) => {
    localStream = stream;
}

function muteLocalAudioTracks(mute=true) {
    localStream.getAudioTracks().forEach((track) => {
        track.enabled = !mute;
    });
}

function closeStreamTrack(stream, type) {
    stream.getTracks().forEach((track) => {
        if(track.kind === type) {
            track.stop();
        }
    });
}

function closeStream(stream){
    stream.getTracks().forEach((track) => {
        track.stop();
    });
}

function addVideoTrack(stream) {
    closeStreamTrack(localStream, 'video');
    localStream.addTrack(stream.getVideoTracks()[0]);
}

function addAudioTrack(stream) {
    closeStreamTrack(localStream, 'audio');
    localStream.addTrack(stream.getAudioTracks()[0]);
}

function closeLocalStream(){
    closeStream(localStream);
}

function closeRemoteStream(){
    closeStream(remoteStream);
}


const getRemoteStream = () => {
    return remoteStream;
}

const getDataChannel = () => {
    return dataChannel;
}

export {
    init,
    connect,
    call,
    getLocalStream,
    setLocalStream,
    getRemoteStream,
    getDataChannel,
    muteLocalAudioTracks,
    closeStreamTrack,
    closeLocalStream,
    closeRemoteStream,
    addVideoTrack,
    addAudioTrack
}