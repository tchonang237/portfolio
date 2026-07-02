<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isMenuOpen = ref(false)
const isScrolled = ref(false)

// Petit script pour changer l'apparence au scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const navLinks = [
  { name: 'À propos', href: '#' },
  { name: 'Compétences', href: '#competences' },
  { name: 'Certifications', href: '#certifications' }, 
  { name: 'Projets', href: '#projets' },
]
</script>

<template>
  <nav 
    :class="[
      'fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4',
      isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800' : 'bg-transparent'
    ]"
  >
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      <div class="text-xl font-black text-white tracking-tighter">
        PORTFOLIO<span class="text-blue-500">.</span>
      </div>

      <div class="hidden md:flex gap-8 items-center">
        <a 
          v-for="link in navLinks" 
          :key="link.name" 
          :href="link.href"
          class="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
        >
          {{ link.name }}
        </a>
        <a 
          href="#contact" 
          class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition active:scale-95"
        >
          Me contacter
        </a>
      </div>

      <button @click="isMenuOpen = !isMenuOpen" class="md:hidden text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-if="isMenuOpen" class="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <a 
        v-for="link in navLinks" 
        :key="link.name" 
        :href="link.href"
        @click="isMenuOpen = false"
        class="text-lg font-medium text-slate-300"
      >
        {{ link.name }}
      </a>
    </div>
  </nav>
</template>