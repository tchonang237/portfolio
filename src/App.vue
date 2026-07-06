<script setup>
import { portfolioData } from './data.js'
import { ref, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'

const data = ref(portfolioData)
const timelineRef = ref(null)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Ajoute la classe qui déclenche les animations
        entry.target.classList.add('timeline-visible')
        // Optionnel : on peut arrêter d'observer une fois l'animation jouée
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.15 // Déclenche l'animation quand 15% de la section est visible
  })

  if (timelineRef.value) {
    observer.observe(timelineRef.value)
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
    
    <Navbar />

    <header class="min-h-screen flex flex-col justify-center items-center px-6 text-center bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden pt-20">
      <!-- Halo lumineux en arrière-plan -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

      <!-- CONTENEUR GLOBAL DE LA PHOTO + MOTIF DE POINTS -->
      <div class="relative mb-8 group z-10 flex items-center justify-center w-72 h-72 md:w-80 md:h-80">
        
        <!-- Motif de points à l'arrière-plan (Dots Matrix) -->
        <div class="absolute -inset-4 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-20 group-hover:opacity-30 transition duration-500 rounded-2xl"></div>
        
        <!-- Effet de lueur diffuse au survol (Optionnel mais stylé) -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
        
        <!-- La Photo parfaitement ronde et grande -->
        <img 
          src="/christoph.jpeg" 
          alt="Photo de Christoph" 
          class="relative w-full h-full rounded-full object-cover border-4 border-slate-900 shadow-2xl transition duration-500 group-hover:scale-105 z-10"
        />
      </div>

      <!-- Badge de bienvenue -->
      <span class="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 font-medium tracking-wide animate-pulse">
        Bienvenue sur mon portfolio
      </span>
      
      <h1 class="text-4xl md:text-6xl font-black text-white mt-6 tracking-tight max-w-4xl">
        {{ data.explorer.nom }}
      </h1>
      <p class="text-xl md:text-2xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
        {{ data.explorer.titre }}
      </p>
      <p class="text-slate-400 mt-6 max-w-2xl text-base md:text-lg leading-relaxed">
        {{ data.explorer.description }}
      </p>
      
      <div class="mt-10 flex gap-4 z-10">
        <a href="#projets" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 transition rounded-xl font-medium shadow-lg shadow-blue-500/20 active:scale-95">
          Voir mes projets
        </a>
        <a 
          href="/cv.jpeg" 
          download="cv.jpeg"
          class="px-6 py-3 bg-slate-800 hover:bg-slate-700 transition rounded-xl font-medium border border-slate-700">
          Télécharger mon CV
        </a>
      </div>
    </header>

    <section id="competences" class="py-24 px-6 max-w-6xl mx-auto scroll-mt-20">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-extrabold text-white">Mon Bagage Technique</h2>
        <div class="h-1 w-12 bg-blue-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="cat in data.competences" :key="cat.categorie" class="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition duration-300">
          <h3 class="text-lg font-bold text-blue-400 mb-4">{{ cat.categorie }}</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="tech in cat.technologies" :key="tech" class="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-700/50">
              {{ tech }}
            </span>
          </div>
        </div>
      </div>
    </section>
    <!-- SECTION PARCOURS ACADÉMIQUE (TIMELINE) -->
    <!-- SECTION PARCOURS ACADÉMIQUE (TIMELINE ANIMÉE) -->
    <section id="parcours" class="py-24 px-6 max-w-6xl mx-auto border-t border-slate-900 scroll-mt-20">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-extrabold text-white">Parcours Académique</h2>
        <div class="h-1 w-12 bg-blue-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <!-- Conteneur de la Timeline lié à la Ref -->
      <div ref="timelineRef" class="timeline-container relative wrap overflow-hidden p-10 h-full">
        <!-- Ligne verticale centrale -->
        <div class="timeline-line border-2-2 absolute border-opacity-20 border-blue-500 h-full border left-1/2 hidden md:block opacity-0 transition-opacity duration-1000"></div>
        <!-- Ligne verticale latérale pour mobile -->
        <div class="timeline-line border-2-2 absolute border-opacity-20 border-blue-500 h-full border left-6 md:hidden opacity-0 transition-opacity duration-1000"></div>

        <div 
          v-for="(item, index) in data.parcours" 
          :key="item.id" 
          class="timeline-item mb-12 flex justify-between items-center w-full opacity-0 translate-y-8 transition-all duration-700 ease-out" 
          :class="index % 2 === 0 ? 'md:flex-row-reverse' : ''"
          :style="{ transitionDelay: `${(index + 1) * 300}ms` }"
        >
          <!-- Espace vide pour équilibrer la grille sur PC -->
          <div class="order-1 w-5/12 hidden md:block"></div>
          
          <!-- L'icône sur la ligne de temps -->
          <div class="z-20 flex items-center order-1 bg-slate-950 border-2 border-blue-500/50 shadow-xl w-10 h-10 rounded-full justify-center absolute left-1.5 md:static md:mx-0">
            <svg v-if="item.type === 'etude'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          
          <!-- La Carte de contenu -->
          <div class="order-1 bg-slate-900/40 border border-slate-800/80 rounded-2xl w-full md:w-5/12 p-6 ml-10 md:ml-0 hover:border-slate-700/80 transition duration-300 shadow-lg">
            <span class="text-xs font-bold text-blue-400 tracking-wider">{{ item.periode }}</span>
            <h3 class="text-xl font-bold text-white mt-1 mb-2 leading-tight">{{ item.diplome }}</h3>
            <h4 class="text-sm font-semibold text-purple-400 mb-1">{{ item.etablissement }}</h4>
            
            <div class="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ item.lieu }}
            </div>
            
            <p class="text-slate-400 text-sm leading-relaxed">{{ item.description }}</p>
          </div>

        </div>
      </div>
    </section>
    <section id="certifications" class="py-24 px-6 max-w-6xl mx-auto border-t border-slate-900 scroll-mt-20">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-extrabold text-white">Certifications Officielles</h2>
        <div class="h-1 w-12 bg-blue-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="certif in data.certifications" :key="certif.id" class="bg-slate-900/40 rounded-2xl border border-slate-800/80 overflow-hidden hover:border-slate-700/80 transition duration-300 flex flex-col sm:flex-row h-full group">
          <div class="sm:w-1/3 bg-slate-900/80 flex items-center justify-center p-6 border-b sm:border-b-0 sm:border-r border-slate-800/60">
            <img :src="certif.image" :alt="certif.titre" class="max-h-28 object-contain transform group-hover:scale-105 transition duration-300" />
          </div>
          <div class="p-6 flex flex-col flex-grow justify-between">
            <div>
              <span class="text-xs font-semibold text-blue-400 uppercase tracking-wider">{{ certif.organisme }}</span>
              <h3 class="text-xl font-bold text-white mt-1 mb-2">{{ certif.titre }}</h3>
              <p class="text-slate-400 text-sm leading-relaxed mb-4">{{ certif.description }}</p>
            </div>
            <div>
              <a :href="certif.lienVerification" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors group/link">
                Vérifier la certification 
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="projets" class="py-24 px-6 max-w-6xl mx-auto border-t border-slate-900 scroll-mt-20">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-extrabold text-white">Projets Récents</h2>
        <div class="h-1 w-12 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="projet in data.projets" :key="projet.id" class="group bg-slate-900/40 rounded-2xl border border-slate-800/80 overflow-hidden hover:border-slate-700/80 hover:shadow-xl hover:shadow-blue-500/5 transition duration-300 flex flex-col h-full">
          
          <div class="w-full h-48 overflow-hidden bg-slate-900 border-b border-slate-800/50">
            <img 
              :src="projet.image" 
              :alt="projet.titre" 
              class="w-full h-full object-cover transform group-hover:scale-105 transition duration-500 ease-out grayscale-[20%] group-hover:grayscale-0"
            />
          </div>

          <div class="p-6 flex flex-col flex-grow">
            <span class="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">{{ projet.categorie }}</span>
            <h3 class="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 mb-3">{{ projet.titre }}</h3>
            <p class="text-slate-400 text-sm leading-relaxed flex-grow">{{ projet.description }}</p>
            
            <div class="mt-6 pt-4 border-t border-slate-800/60 flex flex-wrap gap-1.5">
              <span v-for="tech in projet.technologies" :key="tech" class="px-2 py-0.5 bg-slate-800/80 text-slate-400 text-xs rounded font-medium border border-slate-700/30">
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 4. SECTION CONTACT -->
    <section id="contact" class="py-24 px-6 max-w-4xl mx-auto border-t border-slate-900 scroll-mt-20">
      <div class="text-center mb-12">
        <span class="text-xs font-semibold text-blue-400 uppercase tracking-wider">Restons en contact</span>
        <h2 class="text-3xl font-extrabold text-white mt-2">Me Contacter</h2>
        <div class="h-1 w-12 bg-blue-500 mx-auto mt-4 rounded-full"></div>
        <p class="text-slate-400 mt-4 max-w-md mx-auto text-sm leading-relaxed">
          Qu'il s'agisse d'une opportunité d'alternance, d'un projet de réseau/IoT ou simplement pour échanger, n'hésitez pas à me joindre !
        </p>
      </div>

      <!-- Grille des cartes de contact -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        
        <!-- Carte Email -->
        <a 
          :href="`mailto:${data.explorer.email}`"
          class="flex flex-col items-center p-6 bg-slate-900/40 rounded-2xl border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900/80 transition duration-300 group text-center"
        >
          <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 group-hover:scale-110 transition duration-300 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="text-sm font-bold text-white mb-1">Email</span>
          <span class="text-xs text-slate-400 truncate w-full px-2">{{ data.explorer.email }}</span>
        </a>

        <!-- Carte LinkedIn -->
        <a 
          :href="data.explorer.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center p-6 bg-slate-900/40 rounded-2xl border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900/80 transition duration-300 group text-center"
        >
          <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 group-hover:scale-110 transition duration-300 mb-4">
            <!-- Icône LinkedIn SVG Inline -->
            <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </div>
          <span class="text-sm font-bold text-white mb-1">LinkedIn</span>
          <span class="text-xs text-slate-400">@tchonang</span>
        </a>

        <!-- Carte GitHub -->
        <a 
          :href="data.explorer.github"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center p-6 bg-slate-900/40 rounded-2xl border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900/80 transition duration-300 group text-center"
        >
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition duration-300 mb-4">
            <!-- Icône GitHub SVG Inline -->
            <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.48,0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </div>
          <span class="text-sm font-bold text-white mb-1">GitHub</span>
          <span class="text-xs text-slate-400">@tchonang237</span>
        </a>

      </div>
    </section>

   <!-- 5. FOOTER (AVEC ICÔNES DE CONTACT) -->
    <footer class="py-12 text-center border-t border-slate-900 bg-slate-950">
      <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <!-- Texte de Copyright -->
        <p class="text-sm text-slate-500 order-2 md:order-1">
          © 2026 - {{ data.explorer.nom }}. Tout droit reservé.
        </p>

        <!-- Liens d'accès rapide avec icônes -->
        <div class="flex items-center gap-4 order-1 md:order-2">
          
          <!-- Lien Mail -->
          <a 
            :href="`mailto:${data.explorer.email}`" 
            class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition duration-300 shadow-sm"
            title="Envoyer un email"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>

          <!-- Lien LinkedIn -->
          <a 
            :href="data.explorer.linkedin" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="p-2.5 rounded-lg bg-slate-900 border border-slate-900 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition duration-400 shadow-sm"
            title="Profil LinkedIn"
          >
            <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>

          <!-- Lien GitHub -->
          <a 
            :href="data.explorer.github" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition duration-300 shadow-sm"
            title="Dépôts GitHub"
          >
            <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.48,0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>

        </div>

      </div>
    </footer>

  </div>
</template>
<style scoped>
/* État animé de la ligne bleue centrale */
.timeline-container.timeline-visible .timeline-line {
  opacity: 1;
}

/* État animé des cartes du parcours (Apparition fluide vers le haut) */
.timeline-container.timeline-visible .timeline-item {
  opacity: 1;
  transform: translateY(0);
}
</style>