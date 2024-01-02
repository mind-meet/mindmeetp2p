<script setup>
import Media from './Media.vue';

import { inject, ref, onBeforeUnmount } from 'vue';
import { P2PSymbol } from '../lib/webrtc'

import useMediaControll from '../composables/useMediaControll'

const PC = inject(P2PSymbol)

const { setVideoOn, setAudioOn } = useMediaControll()

const remoteStream = ref(null)
function handleRemoteStreamAvailable() {
    remoteStream.value = PC.remoteStream
}

const localStream = ref(null)
function handleLocalStreamAvailable() {
    localStream.value = PC.localStream
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
        Local <Media :stream="localStream" />
        Remote <Media :stream="remoteStream" />
    </div>
</template>

<style scoped>

</style>