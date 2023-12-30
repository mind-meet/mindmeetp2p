<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { init, connect, call, setLocalStream, get } from '../lib/webrtc'
import { generateRandomHash } from '../lib/hash-generator'

const route = useRoute();
const router = useRouter();

const isHost = ref(route.query.host === 'true')
const hostPeerID = ref(route.params.id)
const usernameInput = ref('')

onBeforeMount(() => {
  // remove query 
  router.replace({ query: {} })
})

async function startCall(username) {
  console.log('start call', username)

  const peerid = isHost.value ? hostPeerID.value : generateRandomHash()
  await init(peerid)

  if (!isHost.value) {
    await joinConnection(hostPeerID.value)

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })

    setLocalStream(stream)

    await call(hostPeerID.value)
  }

}

function openConnection(peerID) {
  // do nothing
}

async function joinConnection(peerID) {
  await connect(peerID)
}

async function onToggleVideo() {
}

function onToggleAudio() {
  // toggle audio
}

function onEndCall() {
  // end call
}

/**
# FLOW

1. A user enter the page by a link 

example: https://localhost:8080/join/lksadkjh

where lksadkjh is the peer id of the room host

2. The user will make in a pre call page for input with your name and config the media devices (video and audio)

3. After the user confirm the pre call page, the user will be make a request to the host peer id (lksadkjh) to join the room

4. The host will receive the request and will accept or reject the request

5. If the host accept the request, the host will send a signal to the user to start the call

6. The user will receive the signal and will start the call

*/

</script>

<template>
  <div>
    <!-- Informations -->
    <div>
      Host ID: {{ hostPeerID }}
      <br>
      Is Host: {{ isHost }}
    </div>

    <br>
    <!-- Pre Call -->
    <div>
      Pre Call
      <div>
        <div>
          <label for="name">Username:</label>
          <input type="text" id="name" name="name" placeholder="Enter with a username" v-model="usernameInput" maxlength="20">
        </div>
        <button @click="startCall(usernameInput)">Start Call</button>
      </div>
    </div>

    <br>
    <!-- Call -->
    <div>
      <div>
        <div>
          Local
          <video id="localStream" autoplay playsinline muted></video>
        </div>
        <div>
          Remote
          <video id="remoteStream" autoplay playsinline></video>
        </div>
      </div>
      <footer>
        <button
          @click="onToggleVideo()"
        >Toggle Video</button>
        <button
          @click="onToggleAudio()"
        >Toggle Audio</button>
        <button
          @click="onEndCall()"
        >End Call</button>
      </footer>
    </div>
  </div> 
</template>

<style scoped>
</style>
