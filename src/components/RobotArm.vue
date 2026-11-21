<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Couleurs et positions réglables depuis le parent :
// <RobotArm body="#0f172a" edge="#3b82f6" joint="#93c5fd" accent="#34d399" :bases="[0.08, 0.92]" />
const props = defineProps({
  body: { type: String, default: '#0f172a' },    // intérieur des segments
  edge: { type: String, default: '#3b82f6' },    // contour des segments
  joint: { type: String, default: '#93c5fd' },   // articulations
  accent: { type: String, default: '#34d399' },  // pince et pulsation
  bases: { type: Array, default: () => [0.08, 0.92] }, // positions des bras (0 = gauche, 1 = droite)
})

const canvas = ref(null)
let raf, observer, cleanup

onMounted(() => {
  const c = canvas.value
  const x = c.getContext('2d')
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  let W = 0, H = 0
  let arms = []
  let visible = true
  let grip = false
  let gripOpen = 0.55
  const pointer = { x: 0, y: 0, active: false, last: -1e9 }
  const aim = { x: 0, y: 0 } // cible lissée

  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

  const build = () => {
    const r = c.getBoundingClientRect()
    W = r.width; H = r.height
    c.width = W * dpr; c.height = H * dpr
    x.setTransform(dpr, 0, 0, dpr, 0, 0)

    const L = Math.max(70, Math.min(200, Math.min(W, H) * 0.26))
    const lens = [L, L * 0.85, L * 0.6]
    arms = props.bases.map((f, i) => {
      const bx = f * W
      const total = lens[0] + lens[1] + lens[2]
      const pts = [{ x: bx, y: H }]
      let acc = 0
      lens.forEach((l) => { acc += l; pts.push({ x: bx, y: H - acc * 0.98 }) })
      return { bx, lens, pts, phase: i * 2.1, total }
    })
    aim.x = W / 2; aim.y = H * 0.45
  }

  // Cinématique inverse (FABRIK) : la pince suit la cible
  const solve = (arm, tx, ty) => {
    const p = arm.pts, l = arm.lens, by = H
    ty = Math.min(ty, by - 20)
    const dx = tx - arm.bx, dy = ty - by, d = Math.hypot(dx, dy) || 1
    if (d >= arm.total) {
      let acc = 0
      p[0] = { x: arm.bx, y: by }
      for (let i = 0; i < 3; i++) {
        acc += l[i]
        p[i + 1] = { x: arm.bx + (dx / d) * acc, y: by + (dy / d) * acc }
      }
      return
    }
    for (let it = 0; it < 8; it++) {
      p[3] = { x: tx, y: ty }
      for (let i = 2; i >= 0; i--) {
        const vx = p[i].x - p[i + 1].x, vy = p[i].y - p[i + 1].y, m = Math.hypot(vx, vy) || 1
        p[i] = { x: p[i + 1].x + (vx / m) * l[i], y: p[i + 1].y + (vy / m) * l[i] }
      }
      p[0] = { x: arm.bx, y: by }
      for (let i = 0; i < 3; i++) {
        const vx = p[i + 1].x - p[i].x, vy = p[i + 1].y - p[i].y, m = Math.hypot(vx, vy) || 1
        p[i + 1] = { x: p[i].x + (vx / m) * l[i], y: Math.min(p[i].y + (vy / m) * l[i], by - 6) }
      }
    }
  }

  const drawArm = (arm, t) => {
    const p = arm.pts
    // socle
    x.fillStyle = props.body; x.strokeStyle = props.edge; x.lineWidth = 2
    x.beginPath(); x.rect(arm.bx - 38, H - 22, 76, 22); x.fill(); x.stroke()

    // segments : trait épais bleu, puis trait plus fin sombre par-dessus
    x.lineCap = 'round'; x.lineJoin = 'round'
    for (let i = 0; i < 3; i++) {
      const w = 20 - i * 3
      x.strokeStyle = props.edge; x.lineWidth = w
      x.beginPath(); x.moveTo(p[i].x, p[i].y); x.lineTo(p[i + 1].x, p[i + 1].y); x.stroke()
      x.strokeStyle = props.body; x.lineWidth = w - 4
      x.beginPath(); x.moveTo(p[i].x, p[i].y); x.lineTo(p[i + 1].x, p[i + 1].y); x.stroke()
    }

    // articulations
    for (let i = 0; i < 3; i++) {
      x.fillStyle = props.body; x.strokeStyle = props.edge; x.lineWidth = 2
      x.beginPath(); x.arc(p[i].x, p[i].y, 12 - i * 2, 0, 6.283); x.fill(); x.stroke()
      x.fillStyle = props.joint
      x.beginPath(); x.arc(p[i].x, p[i].y, 3.5, 0, 6.283); x.fill()
    }

    // pince
    const e = p[3], a = Math.atan2(p[3].y - p[2].y, p[3].x - p[2].x)
    x.strokeStyle = props.accent; x.lineWidth = 4
    ;[-1, 1].forEach((s) => {
      const a1 = a + s * gripOpen
      const kx = e.x + Math.cos(a1) * 26, ky = e.y + Math.sin(a1) * 26
      const a2 = a + s * gripOpen * 0.2
      x.beginPath(); x.moveTo(e.x, e.y); x.lineTo(kx, ky)
      x.lineTo(kx + Math.cos(a2) * 14, ky + Math.sin(a2) * 14); x.stroke()
    })

    // pulsation au bout du bras
    const pulse = (Math.sin(t * 0.004 + arm.phase) + 1) / 2
    x.globalAlpha = 0.6 * (1 - pulse)
    x.strokeStyle = props.accent; x.lineWidth = 2
    x.beginPath(); x.arc(e.x, e.y, 8 + pulse * 22, 0, 6.283); x.stroke()
  }

  const frame = (t = 0) => {
    if (visible) {
      x.clearRect(0, 0, W, H)

      // pointeur récent ? sinon mouvement automatique
      const live = pointer.active && t - pointer.last < 3500
      const idleX = W * (0.5 + 0.3 * Math.sin(t * 0.0006))
      const idleY = H * (0.45 + 0.2 * Math.sin(t * 0.0009 + 1))
      const tx = live ? pointer.x : idleX
      const ty = live ? pointer.y : idleY
      aim.x += (tx - aim.x) * 0.07
      aim.y += (ty - aim.y) * 0.07

      const target = grip ? 0.08 : 0.55
      gripOpen += (target - gripOpen) * 0.15

      x.globalAlpha = 0.7
      arms.forEach((arm) => {
        // en mode automatique, chaque bras a un léger décalage
        const ox = live ? 0 : Math.sin(t * 0.0007 + arm.phase) * W * 0.06
        solve(arm, aim.x + ox, aim.y)
        drawArm(arm, t)
        x.globalAlpha = 0.7
      })
      x.globalAlpha = 1
    }
    if (!reduce) raf = requestAnimationFrame(frame)
  }

  const onMove = (e) => {
    const r = c.getBoundingClientRect()
    const inside = e.clientY >= r.top && e.clientY <= r.bottom
    pointer.active = inside
    pointer.x = e.clientX - r.left
    pointer.y = e.clientY - r.top
    pointer.last = performance.now()
  }
  const onDown = () => { grip = true }
  const onUp = () => { grip = false }
  const onResize = () => { build(); if (reduce) frame(0) }

  build()
  observer = new IntersectionObserver(([en]) => { visible = en.isIntersecting })
  observer.observe(c)

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerdown', onDown)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('resize', onResize)
  cleanup = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('resize', onResize)
  }

  if (reduce) frame(0) // une seule image fixe si l'utilisateur réduit les animations
  else raf = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  observer && observer.disconnect()
  cleanup && cleanup()
})
</script>

<template>
  <canvas ref="canvas" class="robot-arm" aria-hidden="true"></canvas>
</template>

<style scoped>
.robot-arm {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>