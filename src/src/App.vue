<script setup>
import Counter from './components/Counter.vue'
import Participants from './components/Participants.vue'

import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, set, onValue } from "firebase/database";
import { getFirebaseConfig } from "./config";

import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = getFirebaseConfig();

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

signInAnonymously(auth);

const db = getDatabase(app);

</script>

<template>
  <div class="container">
    <Participants :db="db" />
    <Counter :db="db" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
}
</style>