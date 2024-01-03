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
    
    <div class="flex flex-1 space-x-4 justify-center items-center">
        <div class="w-1/2  h-full rounded-xl bg-green-50 max-w-lg md:max-w-3xl">
            <Media :stream="localStream" />
        </div>
        <div class="w-1/2  h-full rounded-xl bg-green-50 max-w-lg md:max-w-3xl">
            <Media :stream="remoteStream" />
        </div>
    </div>
</template>

<style scoped>

</style>