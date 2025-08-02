<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLinkedin, faGithub, faYoutube, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { faHeart, faCode } from '@fortawesome/free-solid-svg-icons'
import { ref, onMounted, onUnmounted } from 'vue'
import yhyImage from './assets/yhy.jpg'

const birthDate = new Date(2005, 2, 6, 12, 40)
const codingDate = new Date(2020, 6, 17, 9, 40)

const ageStr = ref('')
const codingStr = ref('')

let intervalId = null

function formatDiff(diff) {
  const MS_PER_MIN = 60 * 1000
  const MS_PER_HOUR = 60 * MS_PER_MIN
  const MS_PER_DAY = 24 * MS_PER_HOUR
  const MS_PER_MONTH = 30.44 * MS_PER_DAY
  const MS_PER_YEAR = 365.25 * MS_PER_DAY

  const years = Math.floor(diff / MS_PER_YEAR)
  diff -= years * MS_PER_YEAR
  const months = Math.floor(diff / MS_PER_MONTH)
  diff -= months * MS_PER_MONTH
  const days = Math.floor(diff / MS_PER_DAY)
  diff -= days * MS_PER_DAY
  const hours = Math.floor(diff / MS_PER_HOUR)
  diff -= hours * MS_PER_HOUR
  const minutes = Math.floor(diff / MS_PER_MIN)

  return `${years}Y ${months}M ${days}D ${hours}H ${minutes}M`
}

function updateTime() {
  const now = new Date()
  ageStr.value = formatDiff(now - birthDate)
  codingStr.value = formatDiff(now - codingDate)
}

onMounted(() => {
  updateTime()
  intervalId = setInterval(updateTime, 1000 * 5)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

const showTooltip = ref(false)
const onAvatarEnter = () => (showTooltip.value = true)
const onAvatarLeave = () => (showTooltip.value = false)

const titles = [
  "JavaScript",
  "HTML & CSS",
  "Vue.js",
  "React.js",
  "Express.js",
  "jQuery",
  "Bootstrap",
  "Material UI",
  "Microsoft SQL Server",
  "PostgreSQL",
  "C#",
  "ASP.NET Core",
  "Git & GitHub",
]

const typingTitle = ref("")
const typingCursor = ref(true)
const typingSpeed = 100
const erasingSpeed = 50
const delayAfterTyping = 1500
const delayAfterErasing = 300

let typingCharIndex = 0

let titleIndex = 0
let typingIntervalId = null
let erasingTimeoutId = null

function typeTitle() {
  typingCursor.value = true
  if (typingCharIndex < titles[titleIndex].length) {
    typingTitle.value += titles[titleIndex][typingCharIndex]
    typingCharIndex++
    typingIntervalId = setTimeout(typeTitle, typingSpeed)
  } else {
    typingIntervalId = setTimeout(eraseTitle, delayAfterTyping)
  }
}

function eraseTitle() {
  typingCursor.value = true
  if (typingCharIndex > 0) {
    typingTitle.value = typingTitle.value.slice(0, -1)
    typingCharIndex--
    typingIntervalId = setTimeout(eraseTitle, erasingSpeed)
  } else {
    titleIndex = (titleIndex + 1) % titles.length
    typingIntervalId = setTimeout(typeTitle, delayAfterErasing)
  }
}

onMounted(() => {
  typingTitle.value = ""
  typingCharIndex = 0
  titleIndex = 0
  typeTitle()
})

onUnmounted(() => {
  if (typingIntervalId) clearTimeout(typingIntervalId)
  if (erasingTimeoutId) clearTimeout(erasingTimeoutId)
})

</script>

<template>
  <div class="bg">
    <div class="profile-card">
      <div class="avatar-container" @mouseenter="onAvatarEnter" @mouseleave="onAvatarLeave">
        <div class="avatar">
          <img :src="yhyImage" alt="Yahya ALTINTOP" />
        </div>
        <transition name="fade">
          <div v-if="showTooltip" class="avatar-tooltip">
            <img :src="yhyImage" alt="Yahya ALTINTOP" class="avatar-tooltip-img" />
          </div>
        </transition>
      </div>
      <h1 class="name">Yahya ALTINTOP</h1>
      <p class="subInfo"><b>
          <FontAwesomeIcon :icon="faHeart" beat-fade />
          Alive
        </b> {{ ageStr }}</p>
      <p class="subInfo"><b>
          <FontAwesomeIcon :icon="faCode" flip />
          Coding
        </b> {{ codingStr }}</p>
      <p class="title">
        Full Stack Developer
      </p>
      <p class="title-detail">
        <span class="typing">{{ typingTitle }}</span>
        <span class="typing-cursor" v-if="typingCursor">|</span>  
      </p>
      <div class="socials">
        <a href="https://linkedin.com/in/yahyaaltintop" target="_blank" aria-label="LinkedIn">
          <FontAwesomeIcon :icon="faLinkedin" />
        </a>
        <a href="https://github.com/YahyaAltintop" target="_blank" aria-label="GitHub">
          <FontAwesomeIcon :icon="faGithub" />
        </a>
        <a href="https://youtube.com/@yahyaaltintop" target="_blank" aria-label="YouTube">
          <FontAwesomeIcon :icon="faYoutube" />
        </a>
        <a href="https://twitter.com/Yahyaltintop" target="_blank" aria-label="X">
          <FontAwesomeIcon :icon="faXTwitter" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>

:root {
  --apple-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", Arial, sans-serif;
  --apple-sans-heavy: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  --apple-mono: "SF Mono", ui-monospace, "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace;
}

.bg {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #181c23 0%, #23262b 60%, #373b42 100%);
  font-family: var(--apple-sans);
}

.profile-card {
  backdrop-filter: blur(18px);
  background: rgba(34, 37, 41, 0.85);
  border-radius: 1.6rem;
  box-shadow: 0 6px 30px 0 rgba(20, 22, 28, 0.19);
  border: 1.7px solid rgba(255, 255, 255, 0.08);
  padding: 3.2rem 2.1rem 2.3rem 2.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 480px;
  min-width: 300px;
  width: 94vw;
  transition: transform 0.18s;
  margin: 1.5rem 0;
  font-family: var(--apple-sans);
}

.avatar-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2.1rem;
}

.avatar {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 14px 0 rgba(0,0,0,0.14);
  border: 5px solid #23262b;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.22s, box-shadow 0.22s;
  z-index: 5;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.22s cubic-bezier(.38, 1.17, .7, 1.05);
}

.avatar-tooltip {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
  z-index: 10;
  padding: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.avatar-tooltip-img {
  width: 500px;
  height: 500px;
  border-radius: 50%;
  border: 7px solid #23262b;
  box-shadow: 0 6px 24px 0 rgba(111, 168, 220, 0.15), 0 2px 14px 0 #0007;
  background: #fff;
  object-fit: cover;
  pointer-events: none;
  animation: avatar-zoom-in 0.13s cubic-bezier(.38, 1.17, .7, 1.05);
}

@keyframes avatar-zoom-in {
  from { transform: scale(0.7); opacity: 0.45; }
  to { transform: scale(1); opacity: 1; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.name {
  font-family: var(--apple-sans-heavy);
  font-size: 2.2rem;
  font-weight: 900;
  color: #ecf2fa;
  margin-bottom: 0.4rem;
  letter-spacing: -0.01em;
  text-align: center;
  text-shadow: 0 1px 8px #23262b66;
}

.title {
  font-family: var(--apple-mono);
  font-size: 1.15rem;
  margin-top: 1rem;
  color: #b2c4d9;
  text-align: center;
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1.42;
  min-height: 2.0em;
}

.title-detail {
  font-family: var(--apple-mono);
  font-size: 1.15rem;
  margin-bottom: 0.5rem;
  color: #b2c4d9;
  text-align: center;
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1.42;
  min-height: 2.0em;
}

.typing {
  font-family: var(--apple-mono);
  font-weight: 400;
  letter-spacing: 0.01em;
}

.typing-cursor {
  display: inline-block;
  width: 1ch;
  color: #b5c8de;
  animation: blink 0.9s steps(1) infinite;
  font-weight: 900;
  font-size: 1.18em;
  font-family: var(--apple-mono);
}

@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

.subInfo {
  color: #9be0d6;
  font-size: 1.04rem;
  margin-bottom: 0.75rem;
  text-align: center;
  font-family: var(--apple-sans);
  letter-spacing: 0.01em;
}

.subInfo b {
  font-family: var(--apple-mono);
  font-weight: 700;
  letter-spacing: 0.02em;
}

.socials {
  display: flex;
  gap: 1.09rem;
}

.socials a {
  color: #6fa8dc;
  font-size: 2.1rem;
  transition: color 0.16s, background 0.13s, transform 0.13s;
  border-radius: 50%;
  padding: 0.27rem;
  background: transparent;
  outline: none;
}

.socials a[aria-label="LinkedIn"]:hover { color: #0077b5;  }
.socials a[aria-label="GitHub"]:hover { color: #ecf2fa;  }
.socials a[aria-label="YouTube"]:hover { color: #ff4d4f;  }
.socials a[aria-label="X"]:hover { color: #1da1f2;  }

@media (max-width: 700px) {
  .profile-card {
    padding: 1.1rem 0.2rem 0.7rem 0.2rem;
    max-width: 99vw;
    min-width: unset;
  }
  .name { font-size: 1.12rem; }
  .avatar { width: 85px; height: 85px; margin-bottom: 0.7rem; }
  .avatar-tooltip-img { width: 110px; height: 110px; border-width: 3px; }
}

</style>