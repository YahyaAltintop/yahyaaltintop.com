<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLinkedin, faGithub, faYoutube, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { faHeart, faCode, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import yhyImage from './assets/yhy.jpg'

const isDarkMode = ref(true)

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  
  applyTheme()
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === null) {
      isDarkMode.value = e.matches
      applyTheme()
    }
  })
})

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  applyTheme()
}

const applyTheme = () => {
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
}

// Date calculations
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
  "REST APIs",
  "VS Code",
  "Postman",
  "Rider"
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
  <div class="app-container">
    <section class="profile-section">
      <canvas id="bg-canvas" class="background-canvas"></canvas>
      
      <button class="theme-toggle" @click="toggleTheme" aria-label="Toggle theme">
        <FontAwesomeIcon :icon="isDarkMode ? faSun : faMoon" />
      </button>
      
      <div class="container">
        <div class="profile-content">
          <div class="avatar-container" @mouseenter="onAvatarEnter" @mouseleave="onAvatarLeave">
            <div class="avatar">
              <img :src="yhyImage" alt="Yahya ALTINTOP" />
            </div>
            <transition name="zoom">
              <div v-if="showTooltip" class="avatar-tooltip">
                <img :src="yhyImage" alt="Yahya ALTINTOP" class="avatar-tooltip-img" />
              </div>
            </transition>
          </div>
          
          <div class="profile-info">
            <h1 class="profile-name">Yahya ALTINTOP</h1>
            
            <div class="profile-stats">
              <div class="stat-item">
                <span class="stat-icon">
                  <FontAwesomeIcon :icon="faHeart" beat-fade />
                </span>
                <span class="stat-label">Alive</span>
                <span class="stat-value">{{ ageStr }}</span>
              </div>
              
              <div class="stat-item">
                <span class="stat-icon">
                  <FontAwesomeIcon :icon="faCode" flip />
                </span>
                <span class="stat-label">Coding</span>
                <span class="stat-value">{{ codingStr }}</span>
              </div>
            </div>
            
            <div class="profile-title">
              <h2>Full Stack Developer</h2>
              <div class="typing-container">
                <span class="typing-text">{{ typingTitle }}</span>
                <span class="typing-cursor" v-if="typingCursor">|</span>
              </div>
            </div>
            
            <div class="social-links">
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
      </div>
    </section>
  </div>
</template>

<style>

:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f7;
  --text-primary: #1d1d1f;
  --text-secondary: #515154;
  --text-color: rgb(92, 90, 90);
  --accent-primary: #0066cc;
  --accent-secondary: #147ce5;
  --border-color: rgba(0, 0, 0, 0.1);
  --card-bg: rgba(255, 255, 255, 0.8);
  --card-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
  --gradient-start: #f0f0f3;
  --gradient-end: #ffffff;
  --icon-color: #1d1d1f;
}

[data-theme="dark"] {
  --bg-primary: #000000;
  --bg-secondary: #1d1d1f;
  --text-primary: #f5f5f7;
  --text-secondary: #a1a1a6;
  --text-color: #eee;
  --accent-primary: #0a84ff;
  --accent-secondary: #5ac8fa;
  --border-color: rgba(255, 255, 255, 0.15);
  --card-bg: rgba(29, 29, 31, 0.8);
  --card-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  --gradient-start: #1d1d1f;
  --gradient-end: #2c2c2e;
  --icon-color: #f5f5f7;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  line-height: 1.5;
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

h1 {
  font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.05;
  margin-bottom: 0.5em;
}

h2 {
  font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 3.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 0.5em;
}

p {
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.25rem;
  line-height: 1.5;
  margin-bottom: 1em;
}

a {
  color: var(--accent-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--accent-secondary);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 1024px) {
  h1 { font-size: 4rem; }
  h2 { font-size: 3rem; }
  p { font-size: 1.125rem; }
}

@media (max-width: 768px) {
  h1 { font-size: 3.5rem; }
  h2 { font-size: 2.5rem; }
  p { font-size: 1.125rem; }
  .container { padding: 0 20px; }
}

@media (max-width: 480px) {
  h1 { font-size: 2.5rem; }
  h2 { font-size: 2rem; }
  p { font-size: 1rem; }
  .container { padding: 0 16px; }
}
</style>

<style scoped>
.profile-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  overflow: hidden;
}

.background-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.theme-toggle {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 100;
  background: var(--bg-secondary);
  color: var(--icon-color);
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.profile-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 60px;
  flex-wrap: wrap;
}

.avatar-container {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid var(--border-color);
  background: var(--bg-secondary);
  box-shadow: var(--card-shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.avatar:hover {
  transform: scale(1.03);
  box-shadow: 0 25px 65px rgba(0, 0, 0, 0.25);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-tooltip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  pointer-events: none;
}

.avatar-tooltip-img {
  width: 450px;
  height: 450px;
  border-radius: 50%;
  border: 8px solid var(--border-color);
  box-shadow: var(--card-shadow);
  object-fit: cover;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.profile-info {
  flex: 1;
  min-width: 300px;
  max-width: 650px;
}

.profile-name {
  font-size: 6rem;
  font-weight: 700;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--text-color));
  -webkit-background-clip: text;
  background-clip: text;
  line-height: 1.1;
}


.profile-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 16px 24px;
  gap: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  flex-wrap: wrap;
  border: 2px solid var(--border-color);
}

.stat-icon {
  font-size: 1.5rem;
  width: 40px;
  color: var(--text-color);
  display: flex;
  justify-content: center;
}

.stat-label {
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.stat-value {
  font-family: "SF Mono", monospace;
  font-weight: 500;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.profile-title {
  margin-bottom: 40px;
}

.profile-title h2 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.typing-container {
  font-family: "SF Mono", monospace;
  font-size: 1.75rem;
  color: var(--accent-primary);
  height: 2.5rem;
  display: flex;
  align-items: center;
}

.typing-text {
  color: var(--accent-primary);
}

.typing-cursor {
  display: inline-block;
  margin-left: 2px;
  font-weight: 700;
  animation: blink 0.8s step-end infinite;
  color: var(--accent-primary);
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}

.social-links {
  display: flex;
  gap: 20px;
}

.social-links a {
  color: var(--text-secondary);
  font-size: 28px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.social-links a:hover {
  transform: translateY(-5px);
  color: var(--text-primary);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.social-links a[aria-label="LinkedIn"]:hover { color: #0077B5; }
.social-links a[aria-label="GitHub"]:hover { color: var(--text-primary); }
.social-links a[aria-label="YouTube"]:hover { color: #FF0000; }
.social-links a[aria-label="X"]:hover { color: #1DA1F2; }

@media (max-width: 1024px) {
  .profile-name {
    font-size: 5rem;
  }
  
  .profile-title h2 {
    font-size: 3rem;
  }
  
  .typing-container {
    font-size: 1.5rem;
  }
  
  .avatar {
    width: 250px;
    height: 250px;
  }
  
  .avatar-tooltip-img {
    width: 350px;
    height: 350px;
  }
}

@media (max-width: 768px) {
  .profile-section {
    padding: 60px 0;
  }
  
  .profile-content {
    flex-direction: column;
    text-align: center;
    gap: 40px;
  }
  
  .profile-name {
    font-size: 4rem;
  }
  
  .profile-title h2 {
    font-size: 2.5rem;
  }
  
  .profile-stats {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .theme-toggle {
    top: 16px;
    right: 16px;
    width: 44px;
    height: 44px;
  }

  .typing-container {
    margin-left: 25px;
  }
}

@media (max-width: 480px) {
  .profile-name {
    font-size: 3rem;
  }
  
  .profile-title h2 {
    font-size: 2rem;
  }
  
  .typing-container {
    font-size: 1.25rem;
    height: 2rem;
  }
  
  .avatar {
    width: 200px;
    height: 200px;
  }
  
  .avatar-tooltip-img {
    width: 280px;
    height: 280px;
  }
  
  .stat-item {
    padding: 12px 16px;
    width: 100%;
    justify-content: center;
  }
  
  .theme-toggle {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}
</style>