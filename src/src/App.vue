<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLinkedin, faGithub, faYoutube, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { faHeart, faCode, faSun, faMoon, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import yhyImage from './assets/yhy.png'
import BlueprintBackground from './components/BlueprintBackground.vue'

import { getDatabase, ref as dbRef, onValue, set, runTransaction } from 'firebase/database'

/* ---- Theme ---- */
const isDarkMode = ref(false)
const activeSection = ref('top')

const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)')

const handleSystemThemeChange = (e) => {
  if (!localStorage.getItem('theme')) {
    isDarkMode.value = e.matches
    applyTheme()
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    isDarkMode.value = systemThemeMedia.matches
  }
  applyTheme()
  systemThemeMedia.addEventListener('change', handleSystemThemeChange)
})

onUnmounted(() => {
  systemThemeMedia.removeEventListener('change', handleSystemThemeChange)
})

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  applyTheme()
}

const applyTheme = () => {
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
}

/* ---- Firebase: likes & visitors ---- */
const db = getDatabase()
const likeCount = ref(0)
const likeRef = dbRef(db, 'likes')

onValue(likeRef, (snapshot) => {
  likeCount.value = snapshot.val() || 0
})

/* Visitor tracking (background only, not displayed) */
const visitorRef = dbRef(db, 'visitors')

onMounted(() => {
  runTransaction(visitorRef, (current) => (current || 0) + 1)
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

const formattedLikeCount = computed(() => likeCount.value.toLocaleString())

/* ---- Live counters (calendar-aware diff) ---- */
const birthDate = new Date(2005, 2, 6, 12, 40)
const codingDate = new Date(2020, 6, 17, 9, 40)

const ageStr = ref('')
const codingStr = ref('')

let intervalId = null

function calendarDiff(from, to) {
  let years = to.getFullYear() - from.getFullYear()
  let months = to.getMonth() - from.getMonth()
  let days = to.getDate() - from.getDate()
  let hours = to.getHours() - from.getHours()
  let minutes = to.getMinutes() - from.getMinutes()

  if (minutes < 0) { minutes += 60; hours-- }
  if (hours < 0) { hours += 24; days-- }
  if (days < 0) {
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate()
    months--
  }
  if (months < 0) { months += 12; years-- }

  return `${years}y ${months}m ${days}d ${hours}h ${minutes}m`
}

function updateTime() {
  const now = new Date()
  ageStr.value = calendarDiff(birthDate, now)
  codingStr.value = calendarDiff(codingDate, now)
}

onMounted(() => {
  updateTime()
  intervalId = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

/* ---- Typewriter ---- */
const typed = ref('')
const phrases = [
  'Full Stack Developer',
  'C# & .NET Backend',
  'Vue & React Frontend',
  'API Craftsman',
]

let phraseIndex = 0
let charIndex = 0
let deleting = false
let typeTimer = null

function typeTick() {
  const phrase = phrases[phraseIndex]
  if (!deleting) {
    charIndex++
    typed.value = phrase.slice(0, charIndex)
    if (charIndex === phrase.length) {
      deleting = true
      typeTimer = setTimeout(typeTick, 1080)
      return
    }
  } else {
    charIndex--
    typed.value = phrase.slice(0, charIndex)
    if (charIndex === 0) {
      deleting = false
      phraseIndex = (phraseIndex + 1) % phrases.length
    }
  }
  typeTimer = setTimeout(typeTick, 90)
}

onMounted(typeTick)

onUnmounted(() => {
  if (typeTimer) clearTimeout(typeTimer)
})

/* ---- Content data ---- */
const navLinks = [
  { id: 'top', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'connect', label: 'Connect' },
]

const skillGroups = [
  { label: 'LANGUAGES', items: ['JavaScript', 'C#', 'HTML & CSS'] },
  { label: 'FRONTEND', items: ['Vue.js', 'React.js', 'Bootstrap', 'Material UI', 'jQuery'] },
  { label: 'BACKEND', items: ['Express.js', 'ASP.NET Core', 'REST APIs'] },
  { label: 'DATABASE', items: ['PostgreSQL', 'MS SQL Server'] },
  { label: 'TOOLS', items: ['Git & GitHub', 'VS Code', 'Postman', 'Rider'] },
]

const socials = [
  { label: 'LinkedIn', icon: faLinkedin, href: 'https://linkedin.com/in/yahyaaltintop' },
  { label: 'GitHub', icon: faGithub, href: 'https://github.com/YahyaAltintop' },
  { label: 'YouTube', icon: faYoutube, href: 'https://youtube.com/@yahyaaltintop' },
  { label: 'X', icon: faXTwitter, href: 'https://twitter.com/Yahyaltintop' },
]

const scrollToSection = (id) => {
  activeSection.value = id
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <BlueprintBackground />

  <!-- Sticky nav -->
  <nav class="site-nav">
    <a class="brand" href="#top" @click.prevent="scrollToSection('top')">
      <span class="brand-mark"></span>
      <span class="brand-word">YHY</span>
    </a>
    <div class="nav-links">
      <button
        v-for="link in navLinks"
        :key="link.id"
        class="nav-link"
        :class="{ active: activeSection === link.id }"
        @click="scrollToSection(link.id)"
      >
        {{ link.label }}
      </button>
    </div>
    <button class="theme-toggle" @click="toggleTheme" aria-label="Toggle theme">
      <FontAwesomeIcon :icon="isDarkMode ? faSun : faMoon" />
    </button>
  </nav>

  <main class="page">
    <!-- Section 1 — Hero -->
    <section id="top" class="card hero-card">
      <div class="corner-glow glow-tr"></div>

      <div class="avatar">
        <img :src="yhyImage" alt="Yahya Altıntop" loading="lazy" class="avatar-img" />
      </div>

      <p class="eyebrow">&lt; FULL STACK DEVELOPER /&gt;</p>

      <h1 class="hero-name">
        <span class="name-solid">Yahya</span>
        <span class="name-outline">ALTINTOP</span>
      </h1>

      <p class="typewriter">
        <span>{{ typed }}</span><span class="type-cursor">_</span>
      </p>

      <div class="stats">
        <div class="stat-card">
          <div class="stat-icon">
            <FontAwesomeIcon :icon="faHeart" beat-fade />
          </div>
          <div class="stat-body">
            <span class="stat-label">ALIVE</span>
            <span class="stat-value">{{ ageStr }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <FontAwesomeIcon :icon="faCode" />
          </div>
          <div class="stat-body">
            <span class="stat-label">CODING</span>
            <span class="stat-value">{{ codingStr }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 2 — Skills -->
    <section id="skills" class="card skills-card">
      <div class="corner-glow glow-tl"></div>

      <p class="section-no">01 / STACK</p>
      <h2 class="section-title">What I<br />Work With</h2>
      <p class="section-sub">Technologies &amp; tools in my daily stack.</p>

      <div class="skill-groups">
        <div v-for="group in skillGroups" :key="group.label" class="skill-group">
          <span class="group-label">{{ group.label }}</span>
          <div class="pill-row">
            <span v-for="item in group.items" :key="item" class="skill-pill">{{ item }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3 — Connect -->
    <section id="connect" class="card connect-card">
      <div class="corner-glow glow-br"></div>

      <p class="section-no">02 / CONNECT</p>
      <h2 class="section-title">Let's<br />Connect</h2>
      <p class="section-sub">Find me across the internet.</p>

      <div class="social-row">
        <a
          v-for="s in socials"
          :key="s.label"
          :href="s.href"
          target="_blank"
          rel="noopener"
          :aria-label="s.label"
          class="social-link"
        >
          <FontAwesomeIcon class="social-icon" :icon="s.icon" />
          <span>{{ s.label }}</span>
        </a>
      </div>

      <div class="like-area">
        <button class="like-btn" @click="handleLike" aria-label="Like this page">
          <FontAwesomeIcon :icon="faThumbsUp" />
          <span class="like-count">{{ formattedLikeCount }}</span>
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

      <footer class="footer">
        © {{ new Date().getFullYear() }} YAHYA ALTINTOP — BUILT WITH INTENT.
      </footer>
    </section>
  </main>
</template>

<style scoped>
/* ---- Nav ---- */
.site-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px clamp(20px, 6vw, 72px);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  border-bottom: 1px solid var(--border);
}

.brand {
  display: flex;
  align-items: center;
  gap: 9px;
}

.brand-mark {
  width: 11px;
  height: 11px;
  border-radius: 3px;
  background: var(--accent);
  transform: rotate(45deg);
}

.brand-word {
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 2px;
}

.nav-links {
  display: flex;
  gap: 4px;
}

.nav-link {
  font-family: var(--font-mono);
  font-size: 13px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: none;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.18s, background 0.18s, border-color 0.18s;
}

.nav-link:hover {
  color: var(--text);
}

.nav-link.active {
  background: var(--surface);
  border-color: var(--border);
  font-weight: 600;
  color: var(--text);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 17px;
  cursor: pointer;
  transition: transform 0.18s;
}

.theme-toggle:hover {
  transform: rotate(20deg);
}

/* ---- Page column ---- */
.page {
  position: relative;
  z-index: 1;
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(20px, 3.5vh, 40px) clamp(20px, 6vw, 48px) 40px;
  display: flex;
  flex-direction: column;
  gap: clamp(28px, 4vw, 44px);
}

/* ---- Cards (per-section tint via --tint) ---- */
.card {
  position: relative;
  overflow: hidden;
  border-radius: 34px;
  padding: clamp(40px, 6vw, 72px) clamp(24px, 5vw, 64px);
  background: linear-gradient(
    160deg,
    color-mix(in srgb, var(--tint) 16%, var(--surface)),
    color-mix(in srgb, var(--tint) 4%, var(--surface))
  );
  border: 1px solid color-mix(in srgb, var(--tint) 32%, var(--border));
  box-shadow: 0 30px 80px -46px color-mix(in srgb, var(--tint) 60%, transparent);
}

.hero-card {
  --tint: #2563eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: clamp(40px, 7vw, 80px) clamp(24px, 5vw, 64px);
}

.skills-card {
  --tint: #6366f1;
}

.connect-card {
  --tint: #0ea5e9;
  margin-bottom: 80px;
}

.corner-glow {
  position: absolute;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--tint) 24%, transparent), transparent 68%);
  filter: blur(10px);
  pointer-events: none;
}

.glow-tr { top: -120px; right: -120px; }
.glow-tl { top: -130px; left: -110px; }
.glow-br { bottom: -140px; right: -100px; }

/* ---- Hero ---- */
.avatar {
  width: 132px;
  height: 132px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--surface);
  box-shadow: 0 20px 50px -18px var(--glow);
  animation: floaty 6s ease-in-out infinite;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@keyframes floaty {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.eyebrow {
  margin-top: 30px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 4px;
  color: var(--accent);
}

.hero-name {
  display: flex;
  flex-direction: column;
  font-size: clamp(58px, 12vw, 170px);
  font-weight: 700;
  line-height: 0.86;
  letter-spacing: -0.04em;
  margin-top: 18px;
}

.name-outline {
  color: transparent;
  -webkit-text-stroke: 2px var(--text);
}

.typewriter {
  margin-top: 26px;
  font-family: var(--font-mono);
  font-size: clamp(15px, 2.4vw, 20px);
  color: var(--muted);
  min-height: 1.4em;
}

.type-cursor {
  color: var(--accent);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

/* ---- Stats strip ---- */
.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-top: 48px;
  width: 100%;
}

.stat-card {
  flex: 1 1 240px;
  max-width: 340px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 22px 24px;
  box-shadow: 0 14px 40px -28px var(--glow);
}

.stat-icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--accent);
  font-size: 20px;
}

.stat-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-label {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2.5px;
  color: var(--faint);
}

.stat-value {
  font-family: var(--font-mono);
  font-size: clamp(15px, 2.1vw, 20px);
  font-weight: 700;
  letter-spacing: -0.5px;
}

/* ---- Section headers ---- */
.section-no {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 4px;
  color: var(--tint);
}

.section-title {
  margin-top: 10px;
  font-size: clamp(44px, 8vw, 104px);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.92;
}

.section-sub {
  margin-top: 16px;
  font-family: var(--font-mono);
  font-size: 15px;
  color: var(--muted);
}

/* ---- Skills ---- */
.skill-groups {
  margin-top: 48px;
}

.skill-group {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
  align-items: start;
  padding: 26px 0;
  border-top: 1px solid var(--border);
}

.group-label {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--faint);
  padding-top: 6px;
}

.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-pill {
  padding: 10px 18px;
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--border);
  font-weight: 600;
  font-size: 15px;
  cursor: default;
  transition: transform 0.18s, border-color 0.18s, color 0.18s;
}

.skill-pill:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
  color: var(--accent);
}

/* ---- Connect ---- */
.social-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 36px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 26px;
  border-radius: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  font-weight: 700;
  font-size: 16px;
  color: var(--text);
  transition: transform 0.18s, border-color 0.18s;
}

.social-link:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
}

.social-icon {
  color: var(--accent);
  font-size: 18px;
}

/* ---- Like ---- */
.like-area {
  margin-top: 28px;
}

.like-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 30px;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border));
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  touch-action: manipulation;
  box-shadow: 0 14px 40px -18px var(--glow);
  transition: transform 0.18s, box-shadow 0.18s;
}

.like-btn:hover {
  transform: translateY(-3px);
}

.like-btn:active {
  transform: translateY(0) scale(0.97);
}

.like-count {
  font-family: var(--font-mono);
  font-weight: 700;
}

/* Combo badge */
.combo-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: var(--text);
  color: var(--surface);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  font-family: var(--font-mono);
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
  font-size: 13px;
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
  to { box-shadow: 0 2px 28px rgba(168, 85, 247, 0.7); }
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
.footer {
  margin-top: 70px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--faint);
}

/* ---- Responsive ---- */
@media (max-width: 640px) {
  .site-nav {
    padding: 14px 16px;
  }

  .brand-word {
    font-size: 18px;
  }

  .nav-link {
    padding: 7px 12px;
    font-size: 12px;
  }

  .theme-toggle {
    width: 38px;
    height: 38px;
    font-size: 15px;
  }

  .skill-group {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .group-label {
    padding-top: 0;
  }

  .social-link {
    flex: 1 1 calc(50% - 6px);
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .avatar {
    animation: none;
  }
}
</style>
