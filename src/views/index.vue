<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useToast } from "vue-toastification";

import {generateRandomHash} from '../lib/hash-generator'

const router = useRouter()
const toast = useToast()

const roomKey = ref('')

onMounted(() => {
    updateRoomKey()
})

function updateRoomKey() {
    roomKey.value = generateRandomHash()
}

async function joinRoom(roomKey, isHost = false) {
    if (!roomKey && roomKey.length !== 8) return
    // TODO: If host=true Check if host already exists here
    await router.push(`/join/${roomKey}` + (isHost ? '?host=true' : ''))
}

async function copyRoomKeyToClipboard() {
    try {
        await navigator.clipboard.writeText(roomKey.value)
        toast.success('Room key copied to clipboard')
    } catch (error) {
        console.error(error)
    }
}    

</script>

<template>
    <div>
        <h1>Home</h1>
        <div>
            <div>
                <div> 
                    <input type="text" v-model="roomKey" minlength="8" maxlength="8" placeholder="Enter Room Key" />
                    <button @click="copyRoomKeyToClipboard()">Copy</button>
                </div>
                <button @click="updateRoomKey()">Generate New Room Key</button>
            </div>
            <br>
            <button @click="joinRoom(roomKey)">Join Room</button>
            <button @click="joinRoom(roomKey, true)">Create Room</button>
        </div>
    </div>
</template>

<style scoped>

</style>