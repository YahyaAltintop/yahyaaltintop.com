<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  dark: { type: Boolean, default: false },
})

const canvasRef = ref(null)

let ctx = null
let rafId = null
let width = 0
let height = 0
let dpr = 1

let stars = []
let shootingStars = []
let lastShoot = 0
let nextShootGap = 2600
let reduceMotion = false

// Palette helpers -----------------------------------------------------------
const STAR_TINTS_DARK = [
  '255, 255, 255',
  '255, 255, 255',
  '255, 255, 255',
  '190, 214, 255', // cool blue
  '255, 216, 196', // warm
  '214, 196, 255', // violet
]
const STAR_TINTS_LIGHT = [
  '120, 130, 180',
  '140, 150, 195',
  '150, 140, 190',
  '110, 140, 200',
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Build the star field ------------------------------------------------------
function createStars() {
  const target = Math.min(Math.floor((width * height) / 5200), 280)
  stars = []
  for (let i = 0; i < target; i++) {
    const depth = Math.random() // 0 = far, 1 = near
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: depth * 1.5 + 0.35,
      baseAlpha: 0.35 + depth * 0.65,
      twPhase: Math.random() * Math.PI * 2,
      twSpeed: 0.6 + Math.random() * 1.8,
      vx: -(0.08 + depth * 0.55), // drift left -> "kayma"
      vy: 0.03 + depth * 0.18, // gentle downward drift
      depth,
    })
  }
}

function spawnShootingStar() {
  const fromLeft = Math.random() > 0.35
  const startX = fromLeft ? Math.random() * width * 0.5 : width * (0.6 + Math.random() * 0.4)
  const startY = Math.random() * height * 0.45
  const speed = 9 + Math.random() * 6
  shootingStars.push({
    x: startX,
    y: startY,
    vx: fromLeft ? speed : -speed * 0.7,
    vy: speed * 0.55,
    len: 0,
    maxLen: 140 + Math.random() * 160,
    life: 1,
  })
}

// Render --------------------------------------------------------------------
function draw(now) {
  ctx.clearRect(0, 0, width, height)

  // Stars
  for (const s of stars) {
    if (!reduceMotion) {
      s.x += s.vx
      s.y += s.vy
      if (s.x < -4) s.x = width + 4
      if (s.y > height + 4) s.y = -4
    }

    const twinkle = reduceMotion
      ? 1
      : 0.55 + 0.45 * Math.sin(now * 0.001 * s.twSpeed + s.twPhase)
    const alpha = s.baseAlpha * twinkle

    // Soft halo for the brightest, nearest stars
    if (s.depth > 0.72) {
      ctx.beginPath()
      ctx.fillStyle = `rgba(${s.tint}, ${alpha * 0.18})`
      ctx.arc(s.x, s.y, s.r * 3.4, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.beginPath()
    ctx.fillStyle = `rgba(${s.tint}, ${alpha})`
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fill()
  }

  // Shooting stars
  if (!reduceMotion) {
    if (now - lastShoot > nextShootGap) {
      lastShoot = now
      nextShootGap = 2400 + Math.random() * 4200
      spawnShootingStar()
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const sh = shootingStars[i]
      sh.x += sh.vx
      sh.y += sh.vy
      if (sh.len < sh.maxLen) sh.len += 14
      sh.life -= 0.012

      const tailX = sh.x - sh.vx * (sh.len / Math.hypot(sh.vx, sh.vy))
      const tailY = sh.y - sh.vy * (sh.len / Math.hypot(sh.vx, sh.vy))

      const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY)
      const head = props.dark ? '255, 255, 255' : '90, 110, 190'
      const tail = props.dark ? '120, 200, 255' : '150, 170, 220'
      grad.addColorStop(0, `rgba(${head}, ${Math.max(sh.life, 0)})`)
      grad.addColorStop(1, `rgba(${tail}, 0)`)

      ctx.beginPath()
      ctx.strokeStyle = grad
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.moveTo(sh.x, sh.y)
      ctx.lineTo(tailX, tailY)
      ctx.stroke()

      if (sh.life <= 0 || sh.x < -50 || sh.x > width + 50 || sh.y > height + 50) {
        shootingStars.splice(i, 1)
      }
    }
  }

  rafId = requestAnimationFrame(draw)
}

// Apply theme-based tints to existing stars
function applyTints() {
  const tints = props.dark ? STAR_TINTS_DARK : STAR_TINTS_LIGHT
  for (const s of stars) s.tint = pick(tints)
}

function resize() {
  const c = canvasRef.value
  if (!c) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  c.width = Math.floor(width * dpr)
  c.height = Math.floor(height * dpr)
  c.style.width = width + 'px'
  c.style.height = height + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  createStars()
  applyTints()
}

onMounted(() => {
  const c = canvasRef.value
  ctx = c.getContext('2d')
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  resize()
  window.addEventListener('resize', resize)
  rafId = requestAnimationFrame(draw)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
})

watch(() => props.dark, applyTints)
</script>

<template>
  <div class="space-bg" :class="{ dark: dark }" aria-hidden="true">
    <canvas ref="canvasRef" class="space-canvas"></canvas>

    <!-- SpaceX-style rocket flying across the sky -->
    <div class="rocket-track">
      <div class="rocket">
        <svg viewBox="0 0 64 250" width="44" height="172" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#d9dde4" />
              <stop offset="0.35" stop-color="#ffffff" />
              <stop offset="0.75" stop-color="#f2f4f7" />
              <stop offset="1" stop-color="#c4c9d2" />
            </linearGradient>
            <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#ffffff" />
              <stop offset="0.25" stop-color="#bfe6ff" />
              <stop offset="0.55" stop-color="#ffd23f" />
              <stop offset="1" stop-color="#ff5e3a" />
            </linearGradient>
            <radialGradient id="engineGlow" cx="0.5" cy="0.2" r="0.8">
              <stop offset="0" stop-color="rgba(255,180,90,0.9)" />
              <stop offset="1" stop-color="rgba(255,120,40,0)" />
            </radialGradient>
          </defs>

          <!-- engine glow -->
          <ellipse class="glow" cx="32" cy="186" rx="26" ry="40" fill="url(#engineGlow)" />

          <!-- exhaust flame -->
          <g class="flame">
            <path d="M24 178 L40 178 L37 222 Q32 250 27 222 Z" fill="url(#flameGrad)" />
            <path d="M27 178 L37 178 L35 208 Q32 226 29 208 Z" fill="#ffe9a8" opacity="0.95" />
            <path d="M30 178 L34 178 L33 200 Q32 212 31 200 Z" fill="#ffffff" opacity="0.9" />
          </g>

          <!-- landing legs -->
          <path d="M25 168 L15 200" stroke="#9aa1ad" stroke-width="2.5" stroke-linecap="round" />
          <path d="M39 168 L49 200" stroke="#9aa1ad" stroke-width="2.5" stroke-linecap="round" />

          <!-- grid fins -->
          <rect x="17" y="48" width="7" height="11" rx="1.5" fill="#b9bfca" />
          <rect x="40" y="48" width="7" height="11" rx="1.5" fill="#b9bfca" />

          <!-- nose cone -->
          <path d="M32 4 C 26 13, 24 26, 24 40 L 40 40 C 40 26, 38 13, 32 4 Z" fill="url(#bodyGrad)" />

          <!-- body -->
          <rect x="24" y="40" width="16" height="132" rx="2.5" fill="url(#bodyGrad)" />

          <!-- interstage band (black) -->
          <rect x="24" y="150" width="16" height="13" fill="#15171c" />
          <!-- engine section -->
          <path d="M24 168 L40 168 L37 178 L27 178 Z" fill="#23262d" />

          <!-- panel line + wordmark -->
          <line x1="32" y1="44" x2="32" y2="148" stroke="rgba(0,0,0,0.06)" stroke-width="1" />
          <text x="32" y="100" transform="rotate(-90 32 100)" text-anchor="middle"
                font-family="Arial, sans-serif" font-size="7" font-weight="700"
                letter-spacing="0.5" fill="#15171c">SPACEX</text>

          <!-- flag accent -->
          <rect x="26" y="64" width="12" height="7" rx="1" fill="#1f6feb" opacity="0.85" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.space-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  /* Light cosmos */
  background:
    radial-gradient(1200px 700px at 80% -10%, rgba(170, 150, 255, 0.18), transparent 60%),
    radial-gradient(900px 600px at 10% 110%, rgba(120, 170, 255, 0.16), transparent 60%),
    linear-gradient(180deg, #e9edfb 0%, #f1f0fa 55%, #f5f5f7 100%);
  transition: background 0.5s ease;
}

.space-bg.dark {
  /* Deep space */
  background:
    radial-gradient(1100px 700px at 82% -8%, rgba(120, 80, 220, 0.30), transparent 60%),
    radial-gradient(900px 650px at 8% 108%, rgba(40, 90, 200, 0.28), transparent 62%),
    radial-gradient(700px 500px at 50% 40%, rgba(20, 30, 70, 0.35), transparent 70%),
    linear-gradient(180deg, #05060f 0%, #0a0d20 45%, #04050c 100%);
}

.space-canvas {
  position: absolute;
  inset: 0;
}

/* ---- Rocket ---- */
.rocket-track {
  position: absolute;
  inset: 0;
}

.rocket {
  position: absolute;
  left: 0;
  top: 0;
  filter: drop-shadow(0 0 14px rgba(255, 150, 70, 0.35));
  transform: translate(-14vw, 116vh) rotate(42deg);
  animation: rocket-fly 18s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  will-change: transform;
}

.space-bg.dark .rocket {
  filter: drop-shadow(0 0 18px rgba(255, 160, 80, 0.55));
}

@keyframes rocket-fly {
  0%, 38% {
    transform: translate(-14vw, 116vh) rotate(42deg) scale(0.85);
    opacity: 0;
  }
  44% {
    opacity: 1;
  }
  93% {
    opacity: 1;
  }
  100% {
    transform: translate(92vw, -34vh) rotate(42deg) scale(1.08);
    opacity: 0;
  }
}

.flame {
  transform-box: fill-box;
  transform-origin: 50% 0%;
  animation: flame-flicker 0.12s ease-in-out infinite alternate;
}

@keyframes flame-flicker {
  0% {
    transform: scaleY(0.82) scaleX(1.05);
    opacity: 0.9;
  }
  100% {
    transform: scaleY(1.18) scaleX(0.9);
    opacity: 1;
  }
}

.glow {
  animation: glow-pulse 0.3s ease-in-out infinite alternate;
}

@keyframes glow-pulse {
  0% { opacity: 0.55; }
  100% { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .rocket,
  .flame,
  .glow {
    animation: none;
  }
  .rocket {
    opacity: 0;
  }
}
</style>
