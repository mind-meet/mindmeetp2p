<script setup>
import Peer from 'peerjs';
import  {ref, onMounted} from "vue";

const localPeerID = ref("");
const remotePeerID = ref("");

const isLoading = ref(false);

const localMediaRef = ref(null);
const remoteMediaRef = ref(null);

onMounted(() => {
  isLoading.value = true;

  localPeer = new Peer()
  escutar_eventos_do_peer()
})

// TODO: change name
function escutar_eventos_do_peer(){
  if(!localPeer) throw "Local Peer Does not exist"
  
  localPeer.on('open', function(id) {
    localPeerID.value = id;
    console.log('My peer ID is: ' + id);
    isLoading.value = false;
  });

  localPeer.on('connection', function(connection) {
    dataConnection = connection;

    dataConnection.on('open', function() {

      dataConnection.on('data', function(data) {
        console.log('Received', data);
      });

      dataConnection.send('hi!');
    });

  });

  localPeer.on('call', async function(call) {
      const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
      localMediaRef.value.srcObject = stream;
      call.answer(stream);

      call.on('stream', function(remoteStream) {
        remoteMediaRef.value.srcObject = remoteStream;
      });
  });

  localPeer.on('close', function(id) {
  });

  localPeer.on('error', function(err) {
    switch(err.type){
      case "browser-incompatible":
        browserSupported.value = false;
        break;
      default:
        console.log(err)
    }
  });
}

function connectRemotePeer(remoteid){
  const conn = localPeer.connect(remoteid);
  conn.on('open', function() {

	  // Receive messages
	  conn.on('data', function(data) {
	    console.log('Received', data);
	  });

  	// Send "Hello"
	  conn.send('Hello!');
  }); 
}

function callRemotePeer(remoteid){
  window.navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
    const call = localPeer.call(remoteid, stream);

    localMediaRef.value.srcObject = stream;

    call.on('close', function() {
      console.log("Call closed")
    });

    call.on('stream', function(remoteStream) {
      remoteMediaRef.value.srcObject = remoteStream;
    });

    call.on('error', function(err) {
      switch(err.type){
        case "unavailable-id":
          console.log("Unavailable ID")
          break;
        case "invalid-id":
          console.log("Invalid ID")
          break;
        case "browser-incompatible":
          browserSupported.value = false;
          break;
        case "webrtc":
          console.log("WebRTC error")
          break;
        default:
          console.log(err)
      }
    });

  }).catch(err => {
    console.log(err)
  })
}



</script>

<template>
  <header>Header</header>
  <main>
    <div v-if="isLoading">
      Carregando...
    </div>

    <div v-if="localPeerID">
      <p>Local Peer ID: {{localPeerID}}</p>
    </div>

    <!-- Block TextArea -->
    <div v-if="!isLoading">
      <input type="text" v-model="remotePeerID">
      <button @click="connectRemotePeer(remotePeerID)">Connect</button>
    </div>

    <!-- Block Call -->
    <div v-if="!isLoading">
      <input type="text" v-model="remotePeerID">
      <button @click="callRemotePeer(remotePeerID)">Call</button>
    </div>

    <div class="medias">
      Local
      <video ref="localMediaRef" id="localMedia" autoplay playsinline muted></video>

      Remote
      <video  ref="remoteMediaRef" id="remoteMedia" autoplay playsinline></video>
    </div>

  </main>
  <footer>Footer</footer>
</template>

<style scoped>
</style>
