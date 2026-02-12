<script setup lang="ts">
import WheelFortune from './components/WheelFortune.vue'

const demoSlices = [
  { id: '1', label: '100', color: '#F87171' },
  { id: '2', label: '200', color: '#FBBF24' },
  { id: '3', label: '300', color: '#34D399' },
  { id: '4', label: '400', color: '#60A5FA' },
  { id: '5', label: '500', color: '#A78BFA' },
  { id: '6', label: 'JACKPOT', color: '#F472B6', weight: 0.5 }
]
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
    <h1 class="text-3xl font-bold">Wheel of Fortune Demo</h1>
    <WheelFortune :slices="demoSlices" :size="360" />
  </div>
 </template>

<style scoped>
</style>
