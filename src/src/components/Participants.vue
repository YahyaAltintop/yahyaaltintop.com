<script setup>
import { ref, defineProps, onMounted, onBeforeUnmount } from 'vue';
import { ref as dbRef, onValue, set } from "firebase/database";

const props = defineProps({
  db: {
    type: Object,
    required: true
  }
});

const db = props.db;

const users = ref([]);
const userId = Date.now();

const userRef = dbRef(db, `/users/user${userId}`);

let userNick = 'Anonymus_' + userId.toString().slice(-4);
const userNickRef = ref("");

const usersRef = dbRef(props.db, '/users');
set(userRef, userNick);

onValue(usersRef, (snapshot) => {
  users.value = Object.values(snapshot.val());
});

let userNickTimeout;

const setNewNick = () => {
  clearTimeout(userNickTimeout);

  userNickTimeout = setTimeout(() => {
    userNick = userNickRef.value;
    set(userRef, userNickRef.value);
  }, 300);
};

const handleBeforeUnload = () => {
  set(userRef, null);
};

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

</script>

<template>
  <div class="user-list">
    <h3>Active Users</h3>
    <ul>
        <li v-for="user in users" :key="user">{{ user }}</li>
    </ul>
    <input type="text" 
          :placeholder="'Change nick - ' + userNick" 
          v-model="userNickRef" 
          maxlength="20"
          @input="setNewNick" class="nick-input">
  </div>
</template>

<style scoped>
.user-list {
  border: 2px solid #eee;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
}

.user-list h3 {
  margin-top: 0;
  font-size: 1.2em; 
}

.user-list ul {
  list-style-type: none;
  max-height: 300px;
  overflow-y: auto; 
}

.user-list ul::-webkit-scrollbar {
  width: 8px;
}

.user-list ul::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.user-list ul::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.user-list ul::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.user-list li {
  background-color: var(--user-card-bg);
  border: 1px solid var(--user-card-border);
  border-radius: 4px;
  padding: 5px;
  margin-bottom: 5px;
  font-size: 0.9em; /* Adjust the font size as needed */
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

@media (min-width: 768px) {
  .user-list {
    max-width: 250px;
  }
}
</style>