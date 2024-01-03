<script setup>
import Media from './Media.vue';

import { inject, ref, onBeforeUnmount } from 'vue';
import { P2PSymbol } from '../lib/webrtc'



import useMediaControll from '../composables/useMediaControll'

const PC = inject(P2PSymbol)

const isSpeaking = ref(false)
const isRemoteSpeaking = ref(false)

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

function handleSpeechStartEnd(){
  isSpeaking.value = !isSpeaking.value
  if(PC.connected) PC.send({ type: 'speech', payload: isSpeaking.value })
}

PC.addEventListener("speech-start", handleSpeechStartEnd)
PC.addEventListener("speech-end", handleSpeechStartEnd)

PC.addEventListener('remote-stream-received', handleRemoteStreamAvailable)
PC.addEventListener('local-stream-received', handleLocalStreamAvailable)

PC.addEventListener('data-received', (msg) => {
    if(msg.data.type === 'speech') isRemoteSpeaking.value = msg.data.payload
})

onBeforeUnmount(() => {
    PC.removeEventListener('remote-stream-received', handleRemoteStreamAvailable)
    PC.removeEventListener('local-stream-received', handleLocalStreamAvailable)
    PC.removeEventListener("speech-start")
    PC.removeEventListener("speech-end")
    PC.removeEventListener('data-received')
})

</script>

<template>
    
    <div class="flex flex-1 space-x-4 justify-center items-center">
        <div class="relative w-1/2  h-full rounded-xl bg-green-50 max-w-lg md:max-w-3xl">
            <Media :stream="localStream" />
            <!-- voice activity -->
            <div 
                v-show="isSpeaking"
                class="absolute bottom-0 right-0 w-full h-full border-green-500 border-4 rounded-xl">
            </div>
        </div>
        <div class="relative w-1/2  h-full rounded-xl bg-green-50 max-w-lg md:max-w-3xl">
            <Media :stream="remoteStream" />
            <!-- voice activity -->
            <div 
                v-show="isRemoteSpeaking"
                class="absolute bottom-0 right-0 w-full h-full border-green-500 border-4 rounded-xl">
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>