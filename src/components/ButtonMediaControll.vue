<script setup>
import { Button } from './ui/button'

const props = defineProps({
    srOnly: {
        type: String,
        required: false,
        default: ""
    },
    active: {
        type: Boolean,
        required: false,
        default: false
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
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