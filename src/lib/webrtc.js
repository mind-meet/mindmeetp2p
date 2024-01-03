import Peer from "peerjs";

// import { getMicrophoneVolumeIndicator, stopMicrophoneProcessing } from "./speak-detection";
// import { MicVAD } from "@ricky0123/vad-web";

const DEBUG_LEVEL = 0;

let myvad = null
 
class EventEmitter {
  constructor() {
    this.events = {};
  };

  dispatchEvent = (e, data) => {
    if (!this.events[e]) return;
    this.events[e].forEach(callback => callback(data));
  };

  addEventListener = (event, callback) => {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  };

  removeEventListener = (event) => {
    if (!this.events[event]) return;
    delete this.events[event];
  };
};

export const P2PSymbol = Symbol('P2P');

export default class P2P extends EventEmitter {
    constructor() {
        super();
        this.localStream = null;
        this.remoteStream = null;
        this.peerConnection = null;
        this.dataChannel = null;
        this.mediaConnection = null;
        this.configuration = {
            iceServers: [
                {
                    urls: [
                        'stun:stun3.l.google.com:19302',
                        'stun:stun4.l.google.com:19302'
                    ]
                }
            ],
            iceCandidatePoolSize: 10
        };
        this.connected = false;
    };

    createPeer = async (pid) => {
        return new Promise(async (resolve, reject) => {
            this.peerConnection = new Peer(pid, {
                debug: DEBUG_LEVEL,
                config: this.configuration
            });
            this.remoteStream = new MediaStream();

            this.openReceiveDataChannel();
            this.openReiceveMediaChannel();

            this.peerConnection.on('open', () => {
                console.log('peer opened');
                resolve(true);
                this.dispatchEvent('peer-opened', pid);
            });

            this.peerConnection.on('error', (err) => {
                reject(err);
                console.log(err);
            });

            this.peerConnection.on('close', () => {
                this.dispatchEvent('peer-closed');
                this.peerConnection.destroy();
                this.peerConnection = null;
            });

            try { 
                this.localStream = await navigator.mediaDevices.getUserMedia(
                    { 
                    audio: true,
                    video: true
                    }
                );

                console.log('local stream available');
                this.dispatchEvent('local-stream-received');
                
                // TODO: handle errors starting vad
                // TODO: dispatch only one event for vad speech-detect(status)
                // this work but is slow
                myvad = await vad.MicVAD.new({
                    onSpeechStart: () => {
                        this.dispatchEvent('speech-start')
                    },

                    onSpeechEnd: (audio) => {
                        this.dispatchEvent('speech-end')
                    }
                })

                myvad.start()
            
                return true;
            } catch(err) {
                console.log(err);
                reject(err);
                return false;
            };
        });
    }

    // TODO: Refactor to use only one method for call and answer
    call = (pid) => {
        this.mediaConnection = this.peerConnection.call(pid, this.localStream);
        this.dataChannel = this.peerConnection.connect(pid);

        this.mediaConnection.on('stream', (stream) => {
            this.remoteStream = stream;
            console.log('remote stream received');
            this.dispatchEvent('remote-stream-received');
        });

        this.mediaConnection.on('close', () => {
            this.dispatchEvent('media-connection-closed');
        });

        this.mediaConnection.on('error', (err) => {
            console.log(err);
        });

        this.dataChannel.on('open', () => {
            this.connected = true;
            this.dispatchEvent('data-channel-opened');
        });

        this.dataChannel.on('data', (data) => {
            const msg = {data: JSON.parse(data), time: new Date().toLocaleTimeString(), type: 'received'};
            this.dispatchEvent('data-received', msg);
        });

        this.dataChannel.on('close', () => {
            this.dispatchEvent('data-channel-closed');
        })

        this.dataChannel.on('error', (err) => {
            console.log(err);
        });
    }
        

    openReceiveDataChannel = () => {
        this.peerConnection.on('connection', (conn) => {
            console.log('data channel opened');
            this.dataChannel = conn;
            this.dispatchEvent('connection-opened');

            this.dataChannel.on('open', () => {
                this.connected = true;
                this.dispatchEvent('data-channel-opened');
            });

            this.dataChannel.on('data', (data) => {
                const msg = {data: JSON.parse(data), time: new Date().toLocaleTimeString(), type: 'received'};
                this.dispatchEvent('data-received', msg);
            });
        })
    }

    openReiceveMediaChannel = () => {
        this.peerConnection.on('call', (call) => {
            this.mediaConnection = call;
            this.dispatchEvent('call-received');
            this.mediaConnection.answer(this.localStream);
            this.mediaConnection.on('stream', (stream) => {
                this.remoteStream = stream;
                console.log('remote stream received');
                this.dispatchEvent('remote-stream-received');
            });
        });
    }

    init = async (pid) => {
        const success = await this.createPeer(pid);
        if(!success) {
            throw new Error('Failed to create peer');
        }
    }

    close = () => {
        if(this.peerConnection) {
            this.peerConnection.destroy();
            this.peerConnection = null;
            this.dataChannel = null;
            this.mediaConnection = null;

            // stopMicrophoneProcessing()
            if (myvad) myvad.pause()

            // stop local stream
            this.localStream.getTracks().forEach((track) => {
                track.stop();
            });

            this.localStream = null;
            this.remoteStream = null;

            this.connected = false;

            this.dispatchEvent('peer-closed');
        }
    }

    muteAudio = (mute) => {
        this.localStream.getAudioTracks().forEach((track) => {
            track.enabled = !mute;
        });
    }

    pauseVideo = (pause) => {
        this.localStream.getVideoTracks().forEach((track) => {
            track.enabled = !pause;
        });
    }

    send = (payload) => {
        if(this.dataChannel) {
            this.dataChannel.send(JSON.stringify(payload));
        }
    }
}