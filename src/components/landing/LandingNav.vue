<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isScrolled = ref(false)
const isMenuOpen = ref(false)

const onScroll = () => {
  isScrolled.value = window.scrollY > 24
}

const closeMenu = () => {
  isMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const links = [
  { label: 'Solução', href: '#solucao' },
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'Como Funciona', href: '#como-funciona' },
  { label: 'O Projeto', href: '#projeto' },
]
</script>

<template>
  <header class="nav" :class="{ 'nav--scrolled': isScrolled }">
    <div class="lp-container nav__inner">
      <a href="#" class="nav__brand" @click="closeMenu">
        <img src="../../assets/logo_white.png" alt="EPI TRACK" class="nav__logo" />
      </a>

      <nav class="nav__links" aria-label="Navegação principal">
        <a v-for="link in links" :key="link.href" :href="link.href" class="nav__link">
          {{ link.label }}
        </a>
      </nav>

      <div class="nav__actions">
        <router-link to="/contact" class="nav__link nav__link--muted">Contato</router-link>
        <router-link to="/login" class="nav__cta">
          Acessar Sistema
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </router-link>
      </div>

      <button
        class="nav__burger"
        :class="{ 'is-open': isMenuOpen }"
        aria-label="Abrir menu"
        :aria-expanded="isMenuOpen"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <Transition name="drawer">
      <div v-if="isMenuOpen" class="nav__drawer">
        <a v-for="link in links" :key="link.href" :href="link.href" class="nav__drawer-link" @click="closeMenu">
          {{ link.label }}
        </a>
        <router-link to="/contact" class="nav__drawer-link" @click="closeMenu">Contato</router-link>
        <router-link to="/login" class="lp-btn lp-btn--primary nav__drawer-cta" @click="closeMenu">
          Acessar Sistema
        </router-link>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
  border-bottom: 1px solid transparent;
}

.nav--scrolled {
  background: rgba(10, 20, 34, 0.78);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border-bottom-color: rgba(255, 255, 255, 0.07);
  box-shadow: 0 10px 40px rgba(4, 10, 20, 0.35);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  gap: 24px;
}

.nav__brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.nav__logo {
  height: 34px;
  width: auto;
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 32px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav__link {
  position: relative;
  font-size: 14.5px;
  font-weight: 500;
  color: rgba(238, 243, 249, 0.78);
  text-decoration: none;
  transition: color 0.25s ease;
}

.nav__link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 0;
  height: 2px;
  border-radius: 2px;
  background: var(--lp-orange);
  transition: width 0.3s ease;
}

.nav__link:hover {
  color: #fff;
}

.nav__link:hover::after {
  width: 100%;
}

.nav__actions {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}

.nav__link--muted::after {
  display: none;
}

.nav__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #1d1303;
  text-decoration: none;
  background: var(--lp-grad-orange);
  box-shadow: 0 6px 20px rgba(243, 156, 18, 0.32);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.nav__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(243, 156, 18, 0.45);
}

.nav__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
}

.nav__burger span {
  width: 24px;
  height: 2px;
  border-radius: 2px;
  background: #eef3f9;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.nav__burger.is-open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.nav__burger.is-open span:nth-child(2) {
  opacity: 0;
}

.nav__burger.is-open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.nav__drawer {
  display: none;
}

@media (max-width: 920px) {
  .nav__links,
  .nav__actions {
    display: none;
  }

  .nav__burger {
    display: flex;
  }

  .nav__drawer {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 24px 24px;
    background: rgba(10, 20, 34, 0.96);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .nav__drawer-link {
    padding: 13px 4px;
    font-size: 15.5px;
    font-weight: 500;
    color: rgba(238, 243, 249, 0.85);
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .nav__drawer-cta {
    margin-top: 16px;
  }

  .drawer-enter-active,
  .drawer-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  .drawer-enter-from,
  .drawer-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
