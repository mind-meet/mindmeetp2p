import Peer from 'peerjs';

let localPeer = null;
let dataChannel = null;

let localPeerIsOpen = false;

let localStream = null;
let remoteStream = null;

// TODO: Error handle and Toast messages

const init = (id) => {
    localPeer = null;
    localPeerIsOpen = false;

    localPeer = new Peer(id);

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
    })


    localPeer.on('call', (call) => {
        console.log('peer call');
        call.answer(localStream);
        call.on('stream', (stream) => {
            console.log('peer call stream');
            remoteStream = stream;
        });
    });
}

const connect = (id) => {
    if (!localPeerIsOpen) return false;

    const conn = localPeer.connect(id);
    dataChannel = conn;

    dataChannel.on('open', () => {
        console.log('data channel open');

        dataChannel.on('data', (data) => {
            console.log('data channel data', data);
        });
        
        // REMOVE THIS
        sendToChannel('hello');
    });
}

const call = (id) => {
    const call = localPeer.call(id, localStream);
    call.on('stream', (stream) => {
        console.log('peer call stream');
    });
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
    getDataChannel
}