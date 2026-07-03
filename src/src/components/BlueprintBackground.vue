<template>
  <div class="bg-layers" aria-hidden="true">
    <!-- Layer 1: blueprint grid -->
    <div class="bg-grid"></div>

    <!-- Static hero glow -->
    <div class="bg-hero-glow"></div>

    <!-- Layer 2: floating orbs -->
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    <div class="bg-orb orb-3"></div>

    <!-- Layer 3: twinkling dots -->
    <div class="bg-dots"></div>
  </div>
</template>

<style scoped>
.bg-layers {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(circle at 50% 30%, #000 0%, transparent 78%);
  -webkit-mask-image: radial-gradient(circle at 50% 30%, #000 0%, transparent 78%);
}

.bg-hero-glow {
  position: absolute;
  top: -260px;
  left: 50%;
  transform: translateX(-50%);
  width: 900px;
  height: 900px;
  background: radial-gradient(circle, var(--glow), transparent 62%);
  filter: blur(20px);
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
}

.orb-1 {
  top: 12%;
  left: -6%;
  width: 460px;
  height: 460px;
  background: radial-gradient(circle, var(--glow), transparent 68%);
  filter: blur(50px);
  opacity: 0.9;
  animation: drift1 22s ease-in-out infinite;
}

.orb-2 {
  top: 44%;
  right: -8%;
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent), transparent 66%);
  filter: blur(60px);
  animation: drift2 28s ease-in-out infinite;
}

.orb-3 {
  bottom: 6%;
  left: 22%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--glow), transparent 66%);
  filter: blur(55px);
  opacity: 0.7;
  animation: drift3 25s ease-in-out infinite;
}

.bg-dots {
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background-image: radial-gradient(color-mix(in srgb, var(--accent) 55%, transparent) 1.4px, transparent 1.6px);
  background-size: 46px 46px;
  mask-image: radial-gradient(circle at 50% 35%, #000, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at 50% 35%, #000, transparent 80%);
  animation: twinkle 5s ease-in-out infinite;
}

@keyframes drift1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(60px, 50px) scale(1.15); }
}

@keyframes drift2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-70px, 40px) scale(1.1); }
}

@keyframes drift3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -60px) scale(1.2); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.85; }
}

@media (prefers-reduced-motion: reduce) {
  .bg-orb,
  .bg-dots {
    animation: none;
  }
}
</style>
