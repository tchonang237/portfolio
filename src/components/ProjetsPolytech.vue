<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  projets: { type: Array, default: () => [] },
})

const root = ref(null)
let observer

// Photo affichée en grand pour chaque projet (par id)
const current = reactive({})
const getIdx = (id) => current[id] ?? 0

// Visionneuse plein écran
const lightbox = reactive({ open: false, projet: null, index: 0 })
const openLightbox = (projet, index) => {
  lightbox.projet = projet
  lightbox.index = index
  lightbox.open = true
}
const closeLightbox = () => { lightbox.open = false }
const move = (d) => {
  const n = lightbox.projet.photos.length
  lightbox.index = (lightbox.index + d + n) % n
}
const onKey = (e) => {
  if (!lightbox.open) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') move(1)
  if (e.key === 'ArrowLeft') move(-1)
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 }
  )
  root.value.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  observer && observer.disconnect()
})
</script>

<template>
  <section
    id="polytech"
    ref="root"
    class="py-24 px-6 max-w-6xl mx-auto border-t border-slate-900 scroll-mt-20"
  >
    <div class="text-center mb-16" data-reveal>
      <span class="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Robotique</span>
      <h2 class="text-3xl font-extrabold text-white mt-2">Projets à Polytech Dijon</h2>
      <div class="h-1 w-12 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
    </div>

    <div class="space-y-24">
      <article
        v-for="(projet, i) in projets"
        :key="projet.id"
        data-reveal
        class="reveal flex flex-col gap-8 md:items-center"
        :class="i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
      >
        <!-- Photos -->
        <div class="w-full md:w-3/5">
          <button
            v-if="projet.photos && projet.photos.length"
            type="button"
            class="group relative block w-full aspect-video overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900 cursor-zoom-in"
            :aria-label="`Agrandir la photo du projet ${projet.titre}`"
            @click="openLightbox(projet, getIdx(projet.id))"
          >
            <img
              :src="projet.photos[getIdx(projet.id)]"
              :alt="`${projet.titre}, photo ${getIdx(projet.id) + 1}`"
              loading="lazy"
              class="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-105"
            />
            <span
              class="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-950/70 text-xs text-slate-200 opacity-0 group-hover:opacity-100 transition duration-300"
            >
              Agrandir
            </span>
          </button>

          <div
            v-else
            class="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/60 flex items-center justify-center text-slate-500 text-sm"
          >
            Photo à venir
          </div>

          <div v-if="projet.photos && projet.photos.length > 1" class="flex gap-3 mt-3">
            <button
              v-for="(photo, k) in projet.photos"
              :key="photo"
              type="button"
              class="w-20 aspect-video overflow-hidden rounded-lg border-2 transition duration-300"
              :class="getIdx(projet.id) === k ? 'border-emerald-400' : 'border-slate-800 opacity-60 hover:opacity-100'"
              :aria-label="`Voir la photo ${k + 1}`"
              @click="current[projet.id] = k"
            >
              <img :src="photo" alt="" loading="lazy" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Texte -->
        <div class="w-full md:w-2/5">
          <span class="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            {{ projet.categorie }}
          </span>
          <h3 class="text-2xl font-bold text-white mt-2 mb-1 leading-tight">{{ projet.titre }}</h3>
          <p class="text-xs font-bold text-blue-400 tracking-wider mb-4">{{ projet.periode }}</p>
          <p class="text-slate-400 text-sm leading-relaxed">{{ projet.description }}</p>

          <ul v-if="projet.resultats && projet.resultats.length" class="mt-4 space-y-1.5">
            <li
              v-for="r in projet.resultats"
              :key="r"
              class="flex gap-2 text-sm text-slate-300"
            >
              <span class="text-emerald-400">▸</span>{{ r }}
            </li>
          </ul>

          <div class="mt-5 flex flex-wrap gap-1.5">
            <span
              v-for="tech in projet.technologies"
              :key="tech"
              class="px-2 py-0.5 bg-slate-800/80 text-slate-400 text-xs rounded font-medium border border-slate-700/30"
            >
              {{ tech }}
            </span>
          </div>

          <a
            v-if="projet.lien"
            :href="projet.lien"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block mt-5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Voir le projet ↗
          </a>
        </div>
      </article>
    </div>

    <!-- Visionneuse plein écran -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="lightbox.open"
          class="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          @click.self="closeLightbox"
        >
          <button
            type="button"
            class="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800 text-white hover:bg-slate-700"
            aria-label="Fermer"
            @click="closeLightbox"
          >✕</button>

          <button
            v-if="lightbox.projet.photos.length > 1"
            type="button"
            class="absolute left-4 w-10 h-10 rounded-full bg-slate-800 text-white hover:bg-slate-700"
            aria-label="Photo précédente"
            @click="move(-1)"
          >‹</button>

          <img
            :src="lightbox.projet.photos[lightbox.index]"
            :alt="lightbox.projet.titre"
            class="max-h-[85vh] max-w-full rounded-xl object-contain"
          />

          <button
            v-if="lightbox.projet.photos.length > 1"
            type="button"
            class="absolute right-4 w-10 h-10 rounded-full bg-slate-800 text-white hover:bg-slate-700"
            aria-label="Photo suivante"
            @click="move(1)"
          >›</button>

          <p class="absolute bottom-4 text-sm text-slate-400">
            {{ lightbox.projet.titre }} · {{ lightbox.index + 1 }}/{{ lightbox.projet.photos.length }}
          </p>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
/* Apparition au scroll */
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
.reveal.is-visible {
  opacity: 1;
  transform: none;
}
[data-reveal]:not(.reveal) {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}
[data-reveal]:not(.reveal).is-visible {
  opacity: 1;
  transform: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .reveal,
  [data-reveal]:not(.reveal) {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>