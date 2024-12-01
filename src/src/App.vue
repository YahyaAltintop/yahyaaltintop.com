<script setup>
import Counter from './components/Counter.vue'
import Participants from './components/Participants.vue'
import BannedUserSpinner from './components/BannedUserSpinner.vue'

import { ref } from 'vue'
import { initializeApp } from "firebase/app"
import { getDatabase, ref as dbRef, remove, onValue } from "firebase/database"
import { getFirebaseConfig } from "./config"

import { getAuth, signInAnonymously, deleteUser } from "firebase/auth"

const firebaseConfig = getFirebaseConfig()

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

let db = null
let dbReady = ref(false)

const banUser = ref(false)

const userId = Date.now()
const userUrl = `/users/user${userId}`

let userRef = null

signInAnonymously(auth).then(() => {
  db = getDatabase(app)
  userRef = dbRef(db, userUrl)

  const userRefreshDbRef = dbRef(db, userUrl + "/refresh")

  onValue(userRefreshDbRef, refreshUserCallback)

  setTimeout(() => {
    dbReady.value = true
  }, 200)
})

const handleBeforeUnload = async () => {
  remove(userRef)
  await deleteUser(auth.currentUser)
}

window.addEventListener('beforeunload', handleBeforeUnload);
window.addEventListener('unload', handleBeforeUnload);

function refreshUserCallback(snapshot) {
  const refreshUser = snapshot.val()

  if (refreshUser) {
    banUser.value = true
    handleBeforeUnload()
    setTimeout(_ => location.reload(), 2500)
  }
}

</script>

<template>
  <template v-if="banUser">
    <BannedUserSpinner :show="banUser" />
  </template>
  <template v-else>
    <div class="container" v-if="dbReady">
      <Participants :db="db" :userUrl="userUrl" />
      <Counter :db="db" :userUrl="userUrl" />
    </div>
    <span v-else class="loader"></span>
  </template>
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

.loader {
  color: var(--color);
  font-family: Consolas, Menlo, Monaco, monospace;
  font-weight: bold;
  font-size: 85px;
  opacity: 0.8;
}

.loader:before {
  content: "{";
  display: inline-block;
  animation: pulse 0.4s alternate infinite ease-in-out;
}

.loader:after {
  content: "}";
  display: inline-block;
  animation: pulse 0.4s 0.3s alternate infinite ease-in-out;
}

@keyframes pulse {
  to {
    transform: scale(0.8);
    opacity: 0.5;
  }
}
</style>