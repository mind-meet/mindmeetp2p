<script setup>
import { onMounted, onUnmounted, ref, reactive, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute();

/**
# FLOW

1. A user enter the page by a link 

example: https://localhost:8080/join/lksadkjh

where lksadkjh is the peer id of the room host

2. The user will make in a pre call page for input with your name and config the media devices (video and audio)

3. After the user confirm the pre call page, the user will be make a request to the host peer id (lksadkjh) to join the room

4. The host will receive the request and will accept or reject the request

5. If the host accept the request, the host will send a signal to the user to start the call

6. The user will receive the signal and will start the call

*/

</script>

<template>
  <main>
    Host ID: {{ route.params.id }}
    <!-- Pre Call -->
    <div>
      Pre Call
    </div>

    <!-- Call -->
    <div>
      Call
    </div>
  </main> 
</template>

<style scoped>
</style>
