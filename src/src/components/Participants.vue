<script setup>
import { ref, defineProps } from 'vue';
import { ref as dbRef, onValue, set } from "firebase/database";

const props = defineProps({
  db: {
    type: Object,
    required: true
  },
  userUrl: {
    type: String,
    required: true
  }
});

const db = props.db;
const userRef = dbRef(db, props.userUrl);

const users = ref([]);

let userNick = 'Anonymus_' + props.userUrl.toString().slice(-4);
const userNickRef = ref("");

const usersRef = dbRef(props.db, '/users');

const user = {
  name: userNick,
  refresh: false,
  count: 0
}

set(userRef, user);

onValue(usersRef, (snapshot) => {
  users.value = Object.values(snapshot.val());
});

const userNickDbRef = dbRef(db, props.userUrl + "/name");

let userNickTimeout;

const setNewNick = () => {
  clearTimeout(userNickTimeout);

  userNickTimeout = setTimeout(() => {
    userNick = userNickRef.value;
    user.name = userNick;
    set(userNickDbRef, userNick);
  }, 300);
};

</script>

<template>
  <div class="user-list">
    <h3>Active Users</h3>
    <ul>
      <li v-for="user in users" :key="user.name" :class="{ 'current-user': user.name === userNick }">
        <span>{{ user.name }}</span>
        <span class="count-badge">{{ user.count }}</span>
      </li>
    </ul>
    
    <input 
      type="text" 
      :placeholder="'Change nick - ' + userNick" 
      v-model="userNickRef" 
      maxlength="20"
      @input="setNewNick" 
      class="nick-input">
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

.current-user {
  color: red;
}

.user-list h3 {
  margin-top: 0;
  font-size: 1.2em;
}

.user-list ul {
  list-style-type: none;
  max-height: 300px;
  overflow-y: auto;
  padding: 0 5px;
}

.count-badge {
  background-color: #eee;
  color: black;
  padding: 1px 5px;
  border-radius: 10px;
  font-size: 0.7em;
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
  padding: 5px;
  font-size: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
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