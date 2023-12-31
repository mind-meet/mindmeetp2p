<script setup>
import { inject, ref, onBeforeUnmount } from 'vue';
import { P2PSymbol } from '../lib/webrtc'

import useMediaControll from '../composables/useMediaControll'

const PC = inject(P2PSymbol)

const { isAudioOn, isVideoOn, setVideoOn, setAudioOn } = useMediaControll()

const remoteVideo = ref(null)
const localVideo = ref(null)

function handleRemoteStreamAvailable() {
    remoteVideo.value.srcObject = PC.remoteStream
}

function handleLocalStreamAvailable() {
    localVideo.value.srcObject = PC.localStream
    setAudioOn(true)
    setVideoOn(true)
}

PC.addEventListener('remote-stream-received', handleRemoteStreamAvailable)
PC.addEventListener('local-stream-received', handleLocalStreamAvailable)

onBeforeUnmount(() => {
    PC.removeEventListener('remote-stream-received', handleRemoteStreamAvailable)
    PC.removeEventListener('local-stream-received', handleLocalStreamAvailable)
})

</script>

<template>
    Medias
    <div>
        Local - Audio : {{ isAudioOn ? 'On' : 'Off' }} - Video : {{ isVideoOn ? 'On' : 'Off' }}
        <video autoplay muted playsinline ref="localVideo"></video>
        Remote
        <video autoplay playsinline ref="remoteVideo"></video>
    </div>
</template>

<style scoped>

</style>