<script setup>
import P2P from "./lib/webrtc";
import { P2PSymbol } from "./lib/webrtc";

import { provide } from "vue";

const PC = new P2P();

provide(P2PSymbol, PC);

</script>

<template>
    <router-view></router-view>
</template>

<style scoped>
</style>
