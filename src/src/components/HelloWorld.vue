<script setup>
import { ref } from 'vue';
import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, set, onValue } from "firebase/database";
import { getFirebaseConfig } from '../config';

const firebaseConfig = getFirebaseConfig();

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const countRef = dbRef(db, '/count');
const usersRef = dbRef(db, '/users');

const count = ref(null);
const loading = ref(true);
const users = ref([]);

const userId = Date.now();
const userRef = dbRef(db, `/users/user${userId}`);

let userNick = 'Anonymus_' + userId.toString().slice(-4);
const userNickRef = ref("");

set(userRef, userNick);

onValue(usersRef, (snapshot) => {
  users.value = Object.values(snapshot.val());
});

onValue(countRef, (snapshot) => {
  count.value = snapshot.val();
  loading.value = false;
});

const increment = () => {
  set(countRef, count.value + 1);
};

let userNickTimeout;

const setNewNick = () => {
  clearTimeout(userNickTimeout);

  userNickTimeout = setTimeout(() => {
    userNick = userNickRef.value;
    set(userRef, userNickRef.value);
  }, 300);
};

window.addEventListener('beforeunload', () => set(userRef, null));

</script>
<template>
  <div class="container">
    <div class="user-list">
      <h3>Active Users</h3>
      <ul v-for="user in users" :key="user">
        <li>{{ user }}</li>
      </ul>
    </div>
    <div class="card">
      <button type="button" @click="increment" class="counter-button">
        <b v-if="loading">
          <span class="spinner"></span>
        </b>
        <b v-else>{{ count }}</b>
      </button>
      <p>
        <code>This counter is infinite and increases in real time whenever it is clicked.</code>
      </p>
      <div>
        <input type="text" :placeholder="'Your nick - ' + userNick" v-model="userNickRef" maxlength="20" @input="setNewNick" class="nick-input">
      </div>
    </div>
  </div>
</template>

<style scoped>

.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  background-color: var(--background-color);
  color: var(--text-color);
}

.user-list {
  flex: 1;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-list h3 {
  margin-top: 0;
}

.user-list ul {
  list-style-type: none;
  padding: 0;
}

.user-list li {
  background-color: var(--user-card-bg);
  border: 1px solid var(--user-card-border);
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.card {
  flex: 2;
  background-color: var(--background-color);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.counter-button {
  background-color: var(--button-bg);
  color: var(--text-color);
  border: 2px solid #eee;
  user-select: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.counter-button:hover {
  background-color: var(--button-hover-bg);
}

.nick-input {
  background-color: var(--input-bg);
  border: 1px solid #eee;
  color: var(--input-text);
  padding: 10px;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 10px;
}

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