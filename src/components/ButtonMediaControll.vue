<script setup>
import { Button } from './ui/button'

const props = defineProps({
    srOnly: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    disabled: {
        type: Boolean,
        required: true
    }
})

</script>

<template>
<Button 
    size="icon" 
    type="button" 
    >
    <slot></slot>
    <span class="sr-only">
        {{ props.srOnly }}
    </span>
</Button>
</template>