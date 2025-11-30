<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLinkedin, faGithub, faYoutube, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { faHeart, faCode, faSun, faMoon, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { ref, onMounted, onUnmounted } from 'vue'
import yhyImage from './assets/yhy.png'

import { getDatabase, ref as dbRef, onValue, set } from 'firebase/database'

const isDarkMode = ref(true)

const db = getDatabase()
const likeCount = ref(0)
const likeRef = dbRef(db, 'likes')

onValue(likeRef, (snapshot) => {
  likeCount.value = snapshot.val() || 0
})

const clickCombo = ref(0)
const showCombo = ref(false)
let comboTimeout = null

const handleLike = (event) => {
  
  if (!event.isTrusted) {
    return
  }

  set(likeRef, likeCount.value + 1)
  
  clickCombo.value++
  showCombo.value = true
  
  clearTimeout(comboTimeout)

  comboTimeout = setTimeout(() => {
    clickCombo.value = 0
    showCombo.value = false
  }, 5000)
}

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
  <div class="app-wrapper">
    <button class="theme-toggle" @click="toggleTheme" aria-label="Toggle theme">
      <FontAwesomeIcon :icon="isDarkMode ? faSun : faMoon" />
    </button>

    <main class="main-content">
      <div class="card">
        <div class="avatar-wrapper">
          <div class="avatar">
            <img :src="yhyImage" alt="Yahya ALTINTOP" />
          </div>
        </div>

        <div class="info">
          <h1 class="name">Yahya ALTINTOP</h1>
          <p class="role">Full Stack Developer</p>
          
          <div class="typing-wrapper">
            <span class="typing-text">{{ typingTitle }}</span>
            <span class="cursor" v-if="typingCursor">|</span>
          </div>

          <div class="stats">
            <div class="stat">
              <span class="stat-icon">
                <FontAwesomeIcon :icon="faHeart" beat-fade />
              </span>
              <div class="stat-content">
                <span class="stat-label">Alive</span>
                <span class="stat-value">{{ ageStr }}</span>
              </div>
            </div>
            <div class="stat">
              <span class="stat-icon">
                <FontAwesomeIcon :icon="faCode" flip />
              </span>
              <div class="stat-content">
                <span class="stat-label">Coding</span>
                <span class="stat-value">{{ codingStr }}</span>
              </div>
            </div>
          </div>

          <div class="socials">
            <a href="https://linkedin.com/in/yahyaaltintop" target="_blank" aria-label="LinkedIn" class="social-link linkedin">
              <FontAwesomeIcon :icon="faLinkedin" />
            </a>
            <a href="https://github.com/YahyaAltintop" target="_blank" aria-label="GitHub" class="social-link github">
              <FontAwesomeIcon :icon="faGithub" />
            </a>
            <a href="https://youtube.com/@yahyaaltintop" target="_blank" aria-label="YouTube" class="social-link youtube">
              <FontAwesomeIcon :icon="faYoutube" />
            </a>
            <a href="https://twitter.com/Yahyaltintop" target="_blank" aria-label="X" class="social-link twitter">
              <FontAwesomeIcon :icon="faXTwitter" />
            </a>
          </div>
          <div class="like-section">
            <button class="like-button" @click="handleLike" aria-label="Like">
              <FontAwesomeIcon :icon="faThumbsUp" />
              <span class="like-count">{{ likeCount }}</span>
              <transition name="combo-pop">
                <span v-if="showCombo && clickCombo >= 5" class="combo-badge" :class="{ 'combo-fire': clickCombo >= 20 && clickCombo < 50, 'combo-crazy': clickCombo >= 50 && clickCombo < 100, 'combo-greatest': clickCombo >= 100 }">
                  x{{ clickCombo }}
                </span>
              </transition>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
:root {
  --bg: #f8fafc;
  --bg-card: #ffffff;
  --text: #1e293b;
  --text-muted: #64748b;
  --accent: #6366f1;
  --accent-light: #818cf8;
  --border: #e2e8f0;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --radius: 24px;
  --radius-sm: 16px;
}

[data-theme="dark"] {
  --bg: #0f172a;
  --bg-card: #1e293b;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --accent: #818cf8;
  --accent-light: #a5b4fc;
  --border: #334155;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--bg);
  color: var(--text);
  transition: background 0.3s ease, color 0.3s ease;
}
</style>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
}

/* Theme Toggle */
.theme-toggle {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 100;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: var(--bg-card);
  color: var(--text);
  font-size: 18px;
  cursor: pointer;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

/* Main Content */
.main-content {
  width: 100%;
  max-width: 600px;
}

/* Card */
.card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 48px;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border);
  text-align: center;
  transition: all 0.3s ease;
}

/* Avatar */
.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 32px;
}

.avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--border);
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
  cursor: pointer;
}

.avatar:hover {
  transform: scale(1.02);
  border-color: var(--accent);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Info */
.info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
  letter-spacing: -0.02em;
}

.role {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-bottom: 8px;
  font-weight: 500;
}

/* Typing */
.typing-wrapper {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 1rem;
  color: var(--accent);
  margin-bottom: 32px;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.typing-text {
  color: var(--accent);
}

.cursor {
  animation: blink 0.8s infinite;
  font-weight: 300;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Stats */
.stats {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  justify-content: center;
}

.stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: var(--bg);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.stat:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 1.25rem;
  color: var(--accent);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.875rem;
  color: var(--text);
  font-weight: 600;
}

/* Social Links */
.socials {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.social-link:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow);
}

.social-link.linkedin:hover {
  color: #0077b5;
  border-color: #0077b5;
  background: rgba(0, 119, 181, 0.1);
}

.social-link.github:hover {
  color: var(--text);
  border-color: var(--text);
}

.social-link.youtube:hover {
  color: #ff0000;
  border-color: #ff0000;
  background: rgba(255, 0, 0, 0.1);
}

.social-link.twitter:hover {
  color: #1da1f2;
  border-color: #1da1f2;
  background: rgba(29, 161, 242, 0.1);
}

/* Like Button */
.like-section {
  margin-top: 24px;
}

.like-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.like-button:hover {
  color: #e91e63;
  border-color: #e91e63;
  background: rgba(233, 30, 99, 0.1);
  transform: translateY(-2px);
}

.like-button:active {
  transform: scale(0.95);
}

.like-count {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-weight: 600;
}

/* Combo Badge */
.combo-badge {
  position: absolute;
  top: -12px;
  right: -12px;
  background: var(--accent);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 12px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
  animation: pulse 0.3s ease;
}

.combo-badge.combo-fire {
  background: linear-gradient(135deg, #f97316, #ef4444);
  box-shadow: 0 2px 12px rgba(239, 68, 68, 0.5);
  animation: shake 0.3s ease;
}

.combo-badge.combo-crazy {
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  box-shadow: 0 2px 16px rgba(139, 92, 246, 0.6);
  animation: shake 0.3s ease, glow 0.5s ease infinite alternate;
}

.combo-badge.combo-greatest {
  background: linear-gradient(135deg, #fbbf24, #f59e0b, #ef4444);
  box-shadow: 0 2px 20px rgba(251, 191, 36, 0.7);
  animation: shake 0.3s ease, rainbow-glow 1s ease infinite alternate;
  font-size: 0.85rem;
  padding: 5px 10px;
}

@keyframes pulse {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px) rotate(-2deg); }
  75% { transform: translateX(3px) rotate(2deg); }
}

@keyframes glow {
  from { box-shadow: 0 2px 16px rgba(139, 92, 246, 0.6); }
  to { box-shadow: 0 2px 24px rgba(236, 72, 153, 0.8); }
}

@keyframes rainbow-glow {
  0% { box-shadow: 0 2px 20px rgba(251, 191, 36, 0.8); }
  33% { box-shadow: 0 2px 24px rgba(245, 158, 11, 0.9); }
  66% { box-shadow: 0 2px 28px rgba(239, 68, 68, 0.9); }
  100% { box-shadow: 0 2px 32px rgba(251, 191, 36, 1); }
}

/* Combo Transition */
.combo-pop-enter-active {
  animation: pulse 0.3s ease;
}

.combo-pop-leave-active {
  transition: all 0.2s ease;
}

.combo-pop-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(-10px);
}

.like-button {
  position: relative;
}

/* Responsive */
@media (max-width: 640px) {
  .card {
    padding: 32px 24px;
    border-radius: 20px;
  }

  .name {
    font-size: 1.75rem;
  }

  .role {
    font-size: 1rem;
  }

  .stats {
    flex-direction: column;
    width: 100%;
  }

  .stat {
    width: 100%;
    justify-content: center;
  }

  .avatar {
    width: 120px;
    height: 120px;
  }

  .avatar-enlarged img {
    width: 260px;
    height: 260px;
  }

  .theme-toggle {
    top: 16px;
    right: 16px;
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 380px) {
  .name {
    font-size: 1.5rem;
  }

  .socials {
    gap: 8px;
  }

  .social-link {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
}
</style>