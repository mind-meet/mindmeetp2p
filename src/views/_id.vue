<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isHost = ref(route.query.host === 'true')
const hostPeerID = ref(route.params.id)
const usernameInput = ref('')

onBeforeMount(() => {
  // remove query 
  router.replace({ query: {} })
})

function startCall(username) {
  console.log(username)
  // call openConnection(hostPeerID) function if isHost is true
  // call joinConnection(hostPeerID) function if isHost is false
}

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
  <div>
    <!-- Informations -->
    <div>
      Host ID: {{ hostPeerID }}
      <br>
      Is Host: {{ isHost }}
    </div>

    <br>
    <!-- Pre Call -->
    <div>
      Pre Call
      <div>
        <div>
          <label for="name">Username:</label>
          <input type="text" id="name" name="name" placeholder="Enter with a username" v-model="usernameInput" maxlength="20">
        </div>
        <button @click="startCall(usernameInput)">Start Call</button>
      </div>
    </div>

    <br>
    <!-- Call -->
    <div>
      Call
    </div>
  </div> 
</template>

<style scoped>
</style>
