<script setup>
import { ref } from 'vue'
import { ref as dbRef, set, onValue } from "firebase/database"

const props = defineProps({
  db: {
    type: Object,
    required: true
  },
  userUrl: {
    type: String,
    required: true
  }
})

const db = props.db
const countRef = dbRef(db, '/count')
const userCountRef = dbRef(db, props.userUrl + '/count')

const count = ref(null)
const userCount = ref(null)
const loading = ref(true)

onValue(userCountRef, (snapshot) => {
  userCount.value = snapshot.val()
})

onValue(countRef, (snapshot) => {
  count.value = snapshot.val()
  loading.value = false
})

const increment = (event) => {
  if (!event.isTrusted) {
    return
  }

  set(countRef, count.value + 1)
  set(userCountRef, userCount.value + 1)
}

</script>

<template>
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
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 2;
  background-color: var(--background-color);
  border: 2px solid #eee;
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