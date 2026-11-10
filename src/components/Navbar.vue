<script setup>
import { ref } from 'vue'

const open = ref(false)

const liens = [
  { label: 'Compétences', href: '#competences' },
  { label: 'Parcours', href: '#parcours' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Projets', href: '#projets' },
  { label: 'Projets polytech', href: '#polytech' },
  { label: 'Contact', href: '#contact' },
]
</script>

<template>
  <nav class="fixed top-0 inset-x-0 z-40 bg-slate-950/80 backdrop-blur border-b border-slate-800/60">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <a href="#" class="flex items-center gap-3 font-bold text-white">
        <span class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-sm">T</span>
        <span class="hidden sm:inline">Christoph Tchonang</span>
      </a>

      <!-- Liens (écran large) -->
      <ul class="hidden md:flex items-center gap-6">
        <li v-for="l in liens" :key="l.href">
          <a :href="l.href" class="text-sm text-slate-400 hover:text-white transition-colors">{{ l.label }}</a>
        </li>
      </ul>

      <!-- Bouton menu (mobile) -->
      <button
        type="button"
        class="md:hidden w-10 h-10 rounded-lg border border-slate-800 text-slate-300"
        :aria-expanded="open"
        aria-label="Ouvrir le menu"
        @click="open = !open"
      >
        {{ open ? '✕' : '☰' }}
      </button>
    </div>

    <!-- Menu mobile -->
    <ul v-if="open" class="md:hidden px-6 pb-4 space-y-1 border-t border-slate-800/60 bg-slate-950">
      <li v-for="l in liens" :key="l.href">
        <a
          :href="l.href"
          class="block py-2 text-slate-300 hover:text-white"
          @click="open = false"
        >{{ l.label }}</a>
      </li>
    </ul>
  </nav>
</template>