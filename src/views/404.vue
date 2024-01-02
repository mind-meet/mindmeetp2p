<script setup>
import {RouterLink} from 'vue-router'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'

</script>
<template>
<div class="flex items-center justify-center h-screen">
    <Card class="w-[420px] shadow-md">
    <CardHeader class="text-center">
        <CardTitle class="lg:text-7xl text-4xl text-gray-800">404</CardTitle>
        <CardDescription>
            A pagina que você está procurando não existe.
        </CardDescription>
    </CardHeader>
    <CardFooter class="flex justify-center">
        <Button>
            <router-link to="/">Ir para a Home</router-link>
        </Button>
    </CardFooter>
    </Card>
</div> 
</template>