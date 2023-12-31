<script setup>
import { inject, ref } from 'vue';
import { P2PSymbol } from '../lib/webrtc'

const PC = inject(P2PSymbol)

const remoteVideo = ref(null)
const localVideo = ref(null)

function handleRemoteStreamAvailable() {
    remoteVideo.value.srcObject = PC.remoteStream
}

function handleLocalStreamAvailable() {
    localVideo.value.srcObject = PC.localStream
}

PC.addEventListener('remote-stream-received', handleRemoteStreamAvailable)
PC.addEventListener('local-stream-received', handleLocalStreamAvailable)

</script>

<template>
    Medias
    <div>
        Local
        <video autoplay muted playsinline ref="localVideo"></video>
        Remote
        <video autoplay playsinline ref="remoteVideo"></video>
    </div>
</template>

<style scoped>

</style>