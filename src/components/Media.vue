<script setup>
import {ref} from 'vue'

const loading = ref(true)
const playable = ref(false)

const props = defineProps({
    stream: {
        type: MediaStream,
        required: false,
    }
})

function onLoadedMetadata() {
    loading.value = true;
}

function onCanPlay() {
    loading.value = false;
    playable.value = true;
}

function onCanPlayThrough() {
    loading.value = false;
    playable.value = true;
}

</script>
<template>
<video 
    class="h-full w-full object-cover"
    v-show="!loading && playable"
    :srcObject="stream"
    autoplay 
    muted 
    playsinline 
    @loadedmetadata="onLoadedMetadata"
    @canplay="onCanPlay"
    @canplaythrough="onCanPlayThrough"
></video>
<div
    v-if="loading"
    class="bg-gray-800 bg-opacity-60 w-full h-full flex justify-center animate-pulse"
    role="status">
</div>  
</template>

