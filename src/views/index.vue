<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import {generateRandomHash} from '../lib/hash-generator'

const router = useRouter()

const roomKey = ref('')

onMounted(() => {
    updateRoomKey()
})

function updateRoomKey() {
    roomKey.value = generateRandomHash()
}

function joinRoom(roomKey) {
    if (roomKey) {
        router.push(`/join/${roomKey}`)
    }
}

function copyRoomKeyToClipboard() {
    navigator.clipboard.writeText(roomKey.value)
    // TODO: show notification
}    

</script>

<template>
    <div>
        <h1>Home</h1>
        <div>
            <div type="text"> 
                {{ roomKey  }}
                <button @click="copyRoomKeyToClipboard">Copy Room Key</button>
            </div>
            <br>
            <button @click="joinRoom(roomKey)">Join</button> 
            <button @click="updateRoomKey">Generate New Room Key</button>
        </div>
    </div>
</template>

<style scoped>

</style>