<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <h1>{{ msg }} <i>Official web site</i></h1>

  <div class="card">
    <button type="button" @click="count++">counter <b>{{ count }}</b></button>
  </div>
</template>

<style scoped>
:root {
  --background-color-light: #ffffff;
  --background-color-dark: #333333;
  --text-color-light: #333333;
  --text-color-dark: #ffffff;
  --button-background-light: #4CAF50;
  --button-background-dark: #2E7D32;
  --button-hover-light: #45a049;
  --button-hover-dark: #1B5E20;
}

[data-theme="light"] {
  background-color: var(--background-color-light);
  color: var(--text-color-light);
}

[data-theme="dark"] {
  background-color: var(--background-color-dark);
  color: var(--text-color-dark);
}

h1 {
  font-family: 'Arial', sans-serif;
  text-align: center;
  margin-top: 20px;
}

.card {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
