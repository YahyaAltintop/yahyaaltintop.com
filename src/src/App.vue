<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLinkedin, faGithub, faYoutube, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { faHeart, faCode, faSun, faMoon, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import yhyImage from './assets/yhy.png'

import { getDatabase, ref as dbRef, onValue, set } from 'firebase/database'

const isDarkMode = ref(false)
const activeSection = ref('home')

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
  if (!event.isTrusted) return
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

  return `${years}y ${months}m ${days}d ${hours}h ${minutes}m`
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

const skills = [
  { name: "JavaScript", category: "language" },
  { name: "C#", category: "language" },
  { name: "HTML & CSS", category: "language" },
  { name: "Vue.js", category: "frontend" },
  { name: "React.js", category: "frontend" },
  { name: "Bootstrap", category: "frontend" },
  { name: "Material UI", category: "frontend" },
  { name: "jQuery", category: "frontend" },
  { name: "Express.js", category: "backend" },
  { name: "ASP.NET Core", category: "backend" },
  { name: "REST APIs", category: "backend" },
  { name: "PostgreSQL", category: "data" },
  { name: "MS SQL Server", category: "data" },
  { name: "Git & GitHub", category: "tools" },
  { name: "VS Code", category: "tools" },
  { name: "Postman", category: "tools" },
  { name: "Rider", category: "tools" },
]

const typingTitle = ref("")
const typingCursor = ref(true)
const typingSpeed = 90
const erasingSpeed = 40
const delayAfterTyping = 2000
const delayAfterErasing = 400

const roleTitles = ["Full Stack Developer"]

let typingCharIndex = 0
let titleIndex = 0
let typingIntervalId = null
let erasingTimeoutId = null

function typeTitle() {
  typingCursor.value = true
  if (typingCharIndex < roleTitles[titleIndex].length) {
    typingTitle.value += roleTitles[titleIndex][typingCharIndex]
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
    titleIndex = (titleIndex + 1) % roleTitles.length
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

const scrollToSection = (id) => {
  activeSection.value = id
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const formattedLikeCount = computed(() => {
  return likeCount.value.toLocaleString()
})
</script>

<template>
  <div class="app-wrapper" :class="{ dark: isDarkMode }">
    <!-- Frosted Glass Navigation Bar -->
    <nav class="glass-nav">
      <div class="nav-inner">
        <span class="nav-logo">YHY</span>
        <div class="nav-links">
          <button
            v-for="section in ['home', 'skills', 'connect']"
            :key="section"
            class="nav-link"
            :class="{ active: activeSection === section }"
            @click="scrollToSection(section)"
          >
            {{ section.charAt(0).toUpperCase() + section.slice(1) }}
          </button>
        </div>
        <button class="theme-pill" @click="toggleTheme" aria-label="Toggle theme">
          <FontAwesomeIcon :icon="isDarkMode ? faSun : faMoon" />
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="section hero-section">
      <div class="hero-content">
        <div class="avatar-container">
          <div class="avatar-ring">
            <img :src="yhyImage" alt="Yahya ALTINTOP" class="avatar-img" />
          </div>
        </div>

        <h1 class="hero-name">
          Yahya<br /><span class="hero-name-accent">ALTINTOP</span>
        </h1>

        <div class="typing-wrapper">
          <span class="typing-text">{{ typingTitle }}</span>
          <span class="typing-cursor" v-if="typingCursor">|</span>
        </div>

        <div class="hero-metrics">
          <div class="metric-card">
            <div class="metric-icon">
              <FontAwesomeIcon :icon="faHeart" beat-fade />
            </div>
            <div class="metric-body">
              <span class="metric-label">Alive</span>
              <span class="metric-value">{{ ageStr }}</span>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">
              <FontAwesomeIcon :icon="faCode" flip />
            </div>
            <div class="metric-body">
              <span class="metric-label">Coding</span>
              <span class="metric-value">{{ codingStr }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="section skills-section">
      <h2 class="section-title">What I Work With</h2>
      <p class="section-subtitle">Technologies & tools in my stack.</p>

      <div class="skills-grid">
        <div v-for="skill in skills" :key="skill.name" class="skill-chip">
          {{ skill.name }}
        </div>
      </div>
    </section>

    <!-- Connect Section -->
    <section id="connect" class="section connect-section">
      <h2 class="section-title">Let's Connect</h2>
      <p class="section-subtitle">Find me across the internet.</p>

      <div class="social-row">
        <a href="https://linkedin.com/in/yahyaaltintop" target="_blank" aria-label="LinkedIn" class="social-pill">
          <FontAwesomeIcon :icon="faLinkedin" />
          <span>LinkedIn</span>
        </a>
        <a href="https://github.com/YahyaAltintop" target="_blank" aria-label="GitHub" class="social-pill">
          <FontAwesomeIcon :icon="faGithub" />
          <span>GitHub</span>
        </a>
        <a href="https://youtube.com/@yahyaaltintop" target="_blank" aria-label="YouTube" class="social-pill">
          <FontAwesomeIcon :icon="faYoutube" />
          <span>YouTube</span>
        </a>
        <a href="https://twitter.com/Yahyaltintop" target="_blank" aria-label="X / Twitter" class="social-pill">
          <FontAwesomeIcon :icon="faXTwitter" />
          <span>X</span>
        </a>
      </div>

      <div class="like-area">
        <button class="like-pill" @click="handleLike" aria-label="Like this page">
          <FontAwesomeIcon :icon="faThumbsUp" />
          <span class="like-label">{{ formattedLikeCount }}</span>
          <transition name="combo-pop">
            <span
              v-if="showCombo && clickCombo >= 5"
              class="combo-badge"
              :class="{
                'combo-fire': clickCombo >= 20 && clickCombo < 50,
                'combo-crazy': clickCombo >= 50 && clickCombo < 100,
                'combo-greatest': clickCombo >= 100,
              }"
            >
              x{{ clickCombo }}
            </span>
          </transition>
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="site-footer">
      <p>&copy; {{ new Date().getFullYear() }} Yahya ALTINTOP</p>
    </footer>
  </div>
</template>

<!-- ========== GLOBAL STYLES ========== -->
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
  /* Starlight / Light palette */
  --bg:           #f5f5f7;
  --bg-elevated:  #ffffff;
  --bg-inset:     #e8e8ed;
  --text-primary: #1d1d1f;
  --text-secondary: #86868b;
  --text-tertiary:  #aeaeb2;
  --accent:       #1d1d1f;
  --accent-hover: #424245;
  --border:       rgba(0, 0, 0, 0.06);
  --glass-bg:     rgba(245, 245, 247, 0.72);
  --glass-border: rgba(0, 0, 0, 0.08);
  --clay-shadow:
    6px 6px 14px rgba(0, 0, 0, 0.06),
    -4px -4px 10px rgba(255, 255, 255, 0.9);
  --clay-shadow-inset:
    inset 2px 2px 5px rgba(0, 0, 0, 0.06),
    inset -2px -2px 5px rgba(255, 255, 255, 0.7);
  --radius-pill: 980px;
  --radius-card: 28px;
  --transition: 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

[data-theme="dark"] {
  /* Midnight / Dark palette */
  --bg:           #000000;
  --bg-elevated:  #1c1c1e;
  --bg-inset:     #2c2c2e;
  --text-primary: #f5f5f7;
  --text-secondary: #86868b;
  --text-tertiary:  #636366;
  --accent:       #f5f5f7;
  --accent-hover: #d1d1d6;
  --border:       rgba(255, 255, 255, 0.08);
  --glass-bg:     rgba(28, 28, 30, 0.72);
  --glass-border: rgba(255, 255, 255, 0.1);
  --clay-shadow:
    6px 6px 14px rgba(0, 0, 0, 0.4),
    -4px -4px 10px rgba(255, 255, 255, 0.02);
  --clay-shadow-inset:
    inset 2px 2px 5px rgba(0, 0, 0, 0.3),
    inset -2px -2px 5px rgba(255, 255, 255, 0.03);
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html, body {
  height: 100%;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--text-primary);
  transition: background var(--transition), color var(--transition);
  line-height: 1.47059;
  letter-spacing: -0.022em;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
}
</style>

<!-- ========== SCOPED STYLES ========== -->
<style scoped>
/* ---- Layout ---- */
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ---- Frosted Glass Nav ---- */
.glass-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  background: var(--glass-bg);
  border-bottom: 0.5px solid var(--glass-border);
}

.nav-inner {
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 48px;
}

.nav-logo {
  font-weight: 800;
  font-size: 1.125rem;
  letter-spacing: -0.04em;
  color: var(--text-primary);
  user-select: none;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  background: none;
  border: none;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  transition: all var(--transition);
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--border);
}

.nav-link.active {
  color: var(--text-primary);
  background: var(--border);
}

.theme-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: var(--bg-inset);
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition);
  box-shadow: var(--clay-shadow);
}

.theme-pill:hover {
  color: var(--text-primary);
  box-shadow: var(--clay-shadow-inset);
}

/* ---- Section ---- */
.section {
  width: 100%;
  max-width: 980px;
  padding: 0 24px;
}

/* ---- Hero Section ---- */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 48px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0;
}

/* Avatar */
.avatar-container {
  margin-bottom: 48px;
}

.avatar-ring {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: var(--clay-shadow);
  border: 3px solid var(--border);
  transition: all var(--transition);
}

.avatar-ring:hover {
  transform: scale(1.03);
  box-shadow:
    8px 8px 20px rgba(0, 0, 0, 0.08),
    -6px -6px 14px rgba(255, 255, 255, 0.95);
}

[data-theme="dark"] .avatar-ring:hover {
  box-shadow:
    8px 8px 20px rgba(0, 0, 0, 0.55),
    -6px -6px 14px rgba(255, 255, 255, 0.03);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Hero Name */
.hero-name {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: -0.045em;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.hero-name-accent {
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Typing */
.typing-wrapper {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-secondary);
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 56px;
  font-family: 'SF Mono', 'Fira Code', 'Menlo', monospace;
}

.typing-text {
  color: var(--text-secondary);
}

.typing-cursor {
  animation: blink 0.9s step-end infinite;
  font-weight: 300;
  margin-left: 2px;
  color: var(--text-tertiary);
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Metrics */
.hero-metrics {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 28px;
  background: var(--bg-elevated);
  border-radius: var(--radius-card);
  box-shadow: var(--clay-shadow);
  border: 0.5px solid var(--border);
  transition: all var(--transition);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow:
    8px 8px 18px rgba(0, 0, 0, 0.08),
    -6px -6px 12px rgba(255, 255, 255, 0.9);
}

[data-theme="dark"] .metric-card:hover {
  box-shadow:
    8px 8px 18px rgba(0, 0, 0, 0.5),
    -6px -6px 12px rgba(255, 255, 255, 0.02);
}

.metric-icon {
  font-size: 1.25rem;
  color: var(--text-secondary);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-inset);
  border-radius: 12px;
}

.metric-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.metric-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.metric-value {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
  font-family: 'SF Mono', 'Fira Code', 'Menlo', monospace;
  letter-spacing: 0;
}

/* ---- Skills Section ---- */
.skills-section {
  padding-top: 120px;
  padding-bottom: 120px;
  text-align: center;
}

.section-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.08;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 1.125rem;
  font-weight: 400;
  color: var(--text-secondary);
  margin-bottom: 56px;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  max-width: 680px;
  margin: 0 auto;
}

.skill-chip {
  padding: 12px 28px;
  background: var(--bg-elevated);
  border-radius: var(--radius-pill);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  box-shadow: var(--clay-shadow);
  border: 0.5px solid var(--border);
  transition: all var(--transition);
  cursor: default;
  user-select: none;
}

.skill-chip:hover {
  box-shadow: var(--clay-shadow-inset);
  transform: scale(0.97);
}

/* ---- Connect Section ---- */
.connect-section {
  padding-top: 80px;
  padding-bottom: 120px;
  text-align: center;
}

.social-row {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 48px;
}

.social-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: var(--bg-elevated);
  border-radius: var(--radius-pill);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  box-shadow: var(--clay-shadow);
  border: 0.5px solid var(--border);
  transition: all var(--transition);
  text-decoration: none;
}

.social-pill:hover {
  box-shadow: var(--clay-shadow-inset);
  transform: scale(0.97);
  color: var(--text-secondary);
}

.social-pill svg {
  font-size: 1.125rem;
}

/* ---- Like ---- */
.like-area {
  display: flex;
  justify-content: center;
}

.like-pill {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 36px;
  background: var(--text-primary);
  color: var(--bg);
  border: none;
  border-radius: var(--radius-pill);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition);
  touch-action: manipulation;
  box-shadow:
    0 4px 14px rgba(0, 0, 0, 0.15);
}

.like-pill:hover {
  transform: scale(1.04);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.2);
}

.like-pill:active {
  transform: scale(0.97);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.12);
}

.like-label {
  font-family: 'SF Mono', 'Fira Code', 'Menlo', monospace;
  font-weight: 800;
}

/* Combo Badge */
.combo-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: var(--text-secondary);
  color: var(--bg);
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  font-family: 'SF Mono', 'Fira Code', 'Menlo', monospace;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  animation: combo-pulse 0.3s ease;
}

.combo-badge.combo-fire {
  background: linear-gradient(135deg, #ff6b35, #e63946);
  color: #fff;
  box-shadow: 0 2px 12px rgba(230, 57, 70, 0.4);
  animation: combo-shake 0.3s ease;
}

.combo-badge.combo-crazy {
  background: linear-gradient(135deg, #a855f7, #6366f1);
  color: #fff;
  box-shadow: 0 2px 16px rgba(99, 102, 241, 0.5);
  animation: combo-shake 0.3s ease, combo-glow 0.6s ease infinite alternate;
}

.combo-badge.combo-greatest {
  background: linear-gradient(135deg, #fbbf24, #f59e0b, #ef4444);
  color: #fff;
  box-shadow: 0 2px 24px rgba(251, 191, 36, 0.6);
  animation: combo-shake 0.3s ease, combo-glow 0.8s ease infinite alternate;
  font-size: 0.8125rem;
  padding: 5px 12px;
}

@keyframes combo-pulse {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes combo-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px) rotate(-1deg); }
  75% { transform: translateX(2px) rotate(1deg); }
}

@keyframes combo-glow {
  from { box-shadow: 0 2px 16px rgba(99, 102, 241, 0.5); }
  to   { box-shadow: 0 2px 28px rgba(168, 85, 247, 0.7); }
}

.combo-pop-enter-active {
  animation: combo-pulse 0.3s ease;
}

.combo-pop-leave-active {
  transition: all 0.2s ease;
}

.combo-pop-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(-8px);
}

/* ---- Footer ---- */
.site-footer {
  width: 100%;
  text-align: center;
  padding: 32px 24px 48px;
  font-size: 0.8125rem;
  font-weight: 400;
  color: var(--text-tertiary);
  letter-spacing: -0.01em;
}

/* ---- Responsive ---- */
@media (max-width: 734px) {
  .nav-inner {
    padding: 0 16px;
  }

  .hero-name {
    font-size: clamp(2.5rem, 10vw, 3.5rem);
  }

  .avatar-ring {
    width: 140px;
    height: 140px;
  }

  .avatar-container {
    margin-bottom: 36px;
  }

  .hero-metrics {
    flex-direction: column;
    width: 100%;
    padding: 0 8px;
  }

  .metric-card {
    width: 100%;
    justify-content: center;
  }

  .section-title {
    font-size: clamp(2rem, 8vw, 3rem);
  }

  .skills-grid {
    gap: 8px;
  }

  .skill-chip {
    padding: 10px 20px;
    font-size: 0.875rem;
  }

  .social-row {
    flex-direction: column;
    align-items: center;
  }

  .social-pill {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}

@media (max-width: 430px) {
  .hero-name {
    font-size: 2.25rem;
  }

  .typing-wrapper {
    font-size: 1rem;
  }

  .nav-links {
    gap: 4px;
  }

  .nav-link {
    padding: 6px 10px;
    font-size: 0.75rem;
  }
}
</style>