<script setup>
import { util } from 'peerjs'

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {PhSignIn, PhCopy, PhArrowsClockwise} from '@phosphor-icons/vue';

import { onMounted, ref, watch, onBeforeMount, nextTick } from 'vue';
import { useRouter } from 'vue-router';

import { useToast } from "vue-toastification";

import {generateRandomHash} from '../lib/hash-generator'

const router = useRouter()
const toast = useToast()

const generateIcon = ref(null)
const roomKey = ref('')

const buttonGenerateRoomKeyClickable = ref(true)
const buttonCreateRoomClickable = ref(false)
const buttonJoinRoomClickable = ref(false)
const supportsCall = ref(false)

onMounted( async () => {
    updateRoomKey()

    const supported = checkSupportsCall()

    if (!supported) {
        toast.error('Your browser does not support audio/video calls')
    }

    const allowedPermissions = await checkAudioVideoPermissions()

    if (!allowedPermissions) {
        toast.error('Please allow audio/video permissions to use this app')
    }

    supportsCall.value = supported && allowedPermissions
})

function updateRoomKey() {
    roomKey.value = generateRandomHash()
}

async function joinRoom(roomKey, isHost = false) {
    if (!roomKey && roomKey.length !== 8) return
    // TODO: If host=true Check if host already exists here
    await router.push(`/join/${roomKey}` + (isHost ? '?host=true' : ''))
}

async function animateGenerateRoomKeyIcon() {
    generateIcon.value.$el.classList.add('animate-spin')
    return new Promise(resolve => {
        setTimeout(() => {
            generateIcon.value.$el.classList.remove('animate-spin')
            resolve()
        }, 500)
    })
}

async function handleClickGenerateRoomKey() {
    buttonGenerateRoomKeyClickable.value = false;

    try {
        await animateGenerateRoomKeyIcon()
        updateRoomKey()
        buttonGenerateRoomKeyClickable.value = true;
    } catch (error) {
        console.error(error)
    }
}

async function handleCopyRoomKeyToClipboard() {
    try {
        await copyRoomKeyToClipboard()
        toast.success('Room key copied to clipboard')
    } catch (error) {
        console.error(error)
    }

}

async function copyRoomKeyToClipboard() {
    return navigator.clipboard.writeText(roomKey.value) 
}    

function checkSupportsCall() {
    if (!util.supports.audioVideo || !util.supports.data) {
        return false
    }   
    return true
}

async function checkAudioVideoPermissions() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        stream.getTracks().forEach(track => track.stop())
        return true
    } catch (error) {
        return false
    }
}

watch(() => roomKey.value, (value) => {
    if (value.length === 8) {
        buttonCreateRoomClickable.value = true
        buttonJoinRoomClickable.value = true
    } else {
        buttonCreateRoomClickable.value = false
        buttonJoinRoomClickable.value = false
    }
})

</script>

<template>
    <div class="h-screen w-full flex flex-col items-center justify-center space-y-4">
        <div>
            <h2 class="text-center font-medium tracking-wide text-2xl text-gray-800 mb-4">MINDMEET P2P</h2>
            <div class="flex items-center">
                <div class="flex border bg-white rounded-md p-1"> 
                    <input class="bg-transparent p-2 focus:outline-none" type="text" v-model="roomKey" minlength="8" maxlength="8" placeholder="Insira o ID da sala" />
                    <Button @click="handleCopyRoomKeyToClipboard()" class="text-gray-400 bg-transparent hover:bg-transparent hover:text-gray-500 w-10 h-10" size="icon">
                        <ph-copy :size="24" />
                    </Button>
                </div>
                <Button class="ml-2 p-0 h-10 w-10" size="default" @click="handleClickGenerateRoomKey()" :disabled="!buttonGenerateRoomKeyClickable">
                    <ph-arrows-clockwise :size="32" ref="generateIcon"/> 
                </Button>
            </div>
            <div class="mt-2 flex">
                <Button class="flex items-center space-x-2 mr-2 flex-1" @click="joinRoom(roomKey)" :disabled="!buttonJoinRoomClickable || !supportsCall">
                    <span>Entrar</span>
                    <ph-sign-in :size="24" @click="joinRoom(roomKey)"></ph-sign-in>
                </Button>
                <Button class="flex-1" @click="joinRoom(roomKey, true)" :disabled="!buttonJoinRoomClickable || !supportsCall">Criar Sala</Button>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>