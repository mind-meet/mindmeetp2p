<script setup>
import Medias from '../components/Medias.vue'

import { ref, onBeforeMount, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import useMediaControll from '../composables/useMediaControll';
import { generateRandomHash } from '../lib/hash-generator'
import { P2PSymbol } from '../lib/webrtc'

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { isAudioOn, isVideoOn, setVideoOn, setAudioOn } = useMediaControll()

const PC = inject(P2PSymbol)

const isHost = ref(route.query.host === 'true')
const hostPeerID = ref(route.params.id)

onBeforeMount(async () => {
  // TODO: remove this later
  router.replace({ query: {} })

  try {
    const pid = isHost.value ? hostPeerID.value : generateRandomHash()

    await PC.init(pid)

    // TODO: handle errors here (if host is not available)
    if(!isHost.value) {
        console.log('calling host', hostPeerID.value)
        await PC.call(hostPeerID.value)
    }

  } catch (error) {
    toast.error(error.message)
  }

})

function handleClickMicrophone() {
    const prevState = isAudioOn.value
    setAudioOn(!isAudioOn.value)
    PC.muteAudio(prevState)
}

function handleClickCamera() {
    const prevState = isVideoOn.value
    setVideoOn(!isVideoOn.value)
    PC.pauseVideo(prevState)
}

function handleClickClose() {
    PC.close()
    router.push('/')
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
    <Medias /> 
    <footer>
      <button @click="handleClickMicrophone">
        {{ 
          isAudioOn ? 'Mute Microphone' : 'Unmute Microphone' 
        }} 
      </button>
      <button @click="handleClickCamera">
        {{ 
          isVideoOn ? 'Pause Camera' : 'Unpause Camera' 
        }}
      </button>
      <button @click="handleClickClose">Close</button>
    </footer>
</template>

<style scoped>
</style>
