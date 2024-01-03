<script setup>
import  { Button } from '../components/ui/button'

import Medias from '../components/Medias.vue'
import ButtonMediaControll from '../components/ButtonMediaControll.vue'

import { ref, onBeforeMount, onMounted, inject, onBeforeUnmount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import useMediaControll from '../composables/useMediaControll';
import { generateRandomHash } from '../lib/hash-generator'
import { P2PSymbol } from '../lib/webrtc'

import { 
    PhMicrophone,
    PhMicrophoneSlash,
    PhVideoCamera,
    PhVideoCameraSlash,
    PhPhoneDisconnect,
    PhGearSix
} from "@phosphor-icons/vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { isAudioOn, isVideoOn, setVideoOn, setAudioOn } = useMediaControll()

const PC = inject(P2PSymbol)

const isHost = ref(route.query.host === 'true')
const hostPeerID = ref(route.params.id)

const isSpeaking = ref(false)

// TODO: handle call status
// waiting, connecting, connected, failed, closed
const callStatus = ref('') 

onBeforeMount(async () => {
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

function handleSpeechStartEnd(){
  isSpeaking.value = !isSpeaking.value
  if(PC.connected) PC.send({ type: 'speech', payload: isSpeaking.value })
}

PC.addEventListener("speech-start", handleSpeechStartEnd)
PC.addEventListener("speech-end", handleSpeechStartEnd)

onBeforeUnmount(() => {
  PC.removeEventListener("speech-start")
  PC.removeEventListener("speech-end")
});


// button icon

const buttonMicIcon = computed(() => {
    return isAudioOn.value ? PhMicrophone : PhMicrophoneSlash
})

const buttonCameraIcon = computed(() => {
    return isVideoOn.value ? PhVideoCamera : PhVideoCameraSlash
})

const buttonCloseIcon = computed(() => {
    return PhPhoneDisconnect
})

const buttonConfigIcon = computed(() => {
    return PhGearSix
})

</script>

<template>
<div class="bg-back-mm h-screen flex flex-col pt-4 px-2">
    <!-- <div class="flex justify-end">
        <div class=" bg-sec-back-mm pt-1 pb-1 rounded-2xl flex">
            <p class="font-medium text-regal-green">00:00:00</p>
            <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5 3.59375C9.79414 3.59375 8.12659 4.0996 6.70821 5.04732C5.28984 5.99505 4.18435 7.34209 3.53154 8.91811C2.87874 10.4941 2.70793 12.2283 3.04073 13.9014C3.37353 15.5745 4.19498 17.1113 5.40121 18.3175C6.60744 19.5238 8.14426 20.3452 9.81735 20.678C11.4904 21.0108 13.2246 20.84 14.8006 20.1872C16.3767 19.5344 17.7237 18.4289 18.6714 17.0105C19.6192 15.5922 20.125 13.9246 20.125 12.2188C20.1224 9.93206 19.2128 7.73978 17.5959 6.12284C15.979 4.50591 13.7867 3.59637 11.5 3.59375ZM11.5 19.4062C10.0785 19.4062 8.68882 18.9847 7.50684 18.1949C6.32486 17.4052 5.40362 16.2826 4.85962 14.9693C4.31561 13.6559 4.17328 12.2108 4.45061 10.8165C4.72794 9.4223 5.41248 8.14161 6.41767 7.13642C7.42286 6.13123 8.70355 5.44669 10.0978 5.16936C11.492 4.89202 12.9372 5.03436 14.2505 5.57837C15.5639 6.12237 16.6864 7.04361 17.4762 8.22559C18.266 9.40757 18.6875 10.7972 18.6875 12.2188C18.6854 14.1243 17.9274 15.9513 16.58 17.2987C15.2325 18.6462 13.4056 19.4041 11.5 19.4062ZM15.6023 8.11648C15.6691 8.18324 15.7221 8.26251 15.7583 8.34976C15.7945 8.43702 15.8131 8.53055 15.8131 8.625C15.8131 8.71945 15.7945 8.81298 15.7583 8.90024C15.7221 8.98749 15.6691 9.06676 15.6023 9.13352L12.0085 12.7273C11.9417 12.794 11.8625 12.847 11.7752 12.8832C11.688 12.9193 11.5944 12.9379 11.5 12.9379C11.4056 12.9379 11.312 12.9193 11.2248 12.8832C11.1375 12.847 11.0583 12.794 10.9915 12.7273C10.9247 12.6605 10.8717 12.5812 10.8356 12.494C10.7995 12.4067 10.7809 12.3132 10.7809 12.2188C10.7809 12.1243 10.7995 12.0308 10.8356 11.9435C10.8717 11.8563 10.9247 11.777 10.9915 11.7102L14.5852 8.11648C14.652 8.04966 14.7313 7.99664 14.8185 7.96047C14.9058 7.9243 14.9993 7.90568 15.0938 7.90568C15.1882 7.90568 15.2817 7.9243 15.369 7.96047C15.4562 7.99664 15.5355 8.04966 15.6023 8.11648ZM8.625 1.4375C8.625 1.24688 8.70073 1.06406 8.83552 0.929267C8.97031 0.794475 9.15313 0.71875 9.34375 0.71875H13.6563C13.8469 0.71875 14.0297 0.794475 14.1645 0.929267C14.2993 1.06406 14.375 1.24688 14.375 1.4375C14.375 1.62812 14.2993 1.81094 14.1645 1.94573C14.0297 2.08052 13.8469 2.15625 13.6563 2.15625H9.34375C9.15313 2.15625 8.97031 2.08052 8.83552 1.94573C8.70073 1.81094 8.625 1.62812 8.625 1.4375Z" fill="#4ABD7F"/>
            </svg>
        </div>
    </div> -->
    <Medias />
    <footer class="flex justify-between items-center p-4">
        <div class="flex justify-center space-x-2 flex-1 items-center">
          <ButtonMediaControll
            srOnly="Microphone"
            :active="isAudioOn"
            @click="handleClickMicrophone"
          >
            <component :is="buttonMicIcon" class="w-8 h-8" weight="fill" />
          </ButtonMediaControll>
          <ButtonMediaControll
            srOnly="'Webcam'"
            :active="isVideoOn"
            @click="handleClickCamera"
          >
            <component :is="buttonCameraIcon" class="w-8 h-8" weight="fill" /> 
          </ButtonMediaControll>
          <ButtonMediaControll
            srOnly="Sair"
            @click="handleClickClose"
            class="bg-red-500 hover:bg-red-400 hover:opacity-80"
          >
            <component :is="buttonCloseIcon" class="w-8 h-8" weight="fill" />
          </ButtonMediaControll>
          <ButtonMediaControll
            srOnly="Configurações"
            :active="isAudioOn"
            :disabled="false"
            @click=""
          >
            <component :is="buttonConfigIcon" class="w-8 h-8" weight="fill" /> 
          </ButtonMediaControll>
        </div>
    </footer>
</div>
</template>

<style scoped>
</style>
