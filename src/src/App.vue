<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLinkedin, faGithub, faYoutube, faXTwitter } from '@fortawesome/free-brands-svg-icons'
</script>

<template>
  <div class="container">
    <div class="profile-card">
      <div class="avatar"></div>
      <h1 class="name">Yahya ALTINTOP</h1>
      <p class="title">Full Stack Developer</p>
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

@font-face {
  font-family: "SF Pro Display";
  src: local("San Francisco"), local("SF Pro Display"), local("SF Pro Text");
  font-weight: 400 900;
  font-display: swap;
}

:root {
  --primary: #0077b5;
  --secondary: #222;
  --accent: #e14a84;
  --background: linear-gradient(135deg, #f9f9f9 70%, #c9e7fa 100%);
  --card-bg: #fff;
  --card-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
}

.container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--background);
  font-family: 'SF Pro Display', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
}

.profile-card {
  background: var(--card-bg);
  box-shadow: var(--card-shadow);
  border-radius: 2rem;
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  transition: transform 0.18s;
  border: 1.5px solid #e6e6e6;
}

.profile-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 16px 40px 0 rgba(31, 38, 135, 0.16);
}

.avatar {
  background-color: black;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1.2rem;
  border: 3px solid #bfe0fd;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--secondary);
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  text-align: center;
  line-height: 1.1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.title {
  font-family: 'SF Pro Text', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 1.18rem;
  color: #555;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.socials {
  display: flex;
  gap: 1.2rem;
}

.socials a {
  color: #b2b2b2;
  font-size: 2rem;
  transition: color 0.22s, transform 0.18s;
  border-radius: 50%;
  padding: 0.3rem;
  background: transparent;
  outline: none;
}

.socials a[aria-label="LinkedIn"]:hover { color: #0077b5; background: #f0f6fa; }
.socials a[aria-label="GitHub"]:hover { color: #222; background: #f7f7f7; }
.socials a[aria-label="YouTube"]:hover { color: #ff0000; background: #fceaea; }
.socials a[aria-label="X"]:hover { color: #1da1f2; background: #eaf6fd; }

@media (max-width: 480px) {
  .profile-card {
    padding: 2rem 1rem 1.5rem 1rem;
    max-width: 96vw;
  }
  .name {
    font-size: 1.3rem;
  }
  .avatar {
    width: 70px;
    height: 70px;
  }
}
</style>