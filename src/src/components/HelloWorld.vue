<script setup>
import { ref } from 'vue';
import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, set, onValue } from "firebase/database";
import { getFirebaseConfig } from '../config';

const firebaseConfig = getFirebaseConfig();

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const countRef = dbRef(db, '/count');
const count = ref(null);
const loading = ref(true);

onValue(countRef, (snapshot) => {
  count.value = snapshot.val();

  if (loading.value) {
    setTimeout(() => {
      loading.value = false;
    }, 200);
  }
});

const increment = async () => {
  count.value++;
  set(countRef, count.value);
};

</script>

<template>
  <h2>Click</h2>

  <div class="card">
    <button type="button" @click="increment" class="counter-button">
      <b v-if="loading">
        <span class="spinner"></span>
      </b>
      <b v-else>{{ count }}</b>
    </button>
    <p>
      <code>This counter is infinite and increases in real time on click.</code>
    </p>
  </div>
</template>

<style scoped>
.spinner {
  border: 0.1em solid var(--spinner-color, #000000);
  border-top-color: var(--spinner-color, #fff3f3);
  border-radius: 50%;
  display: inline-block;
  height: 1em;
  width: 1em;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>