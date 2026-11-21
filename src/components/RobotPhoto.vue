<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Robot FANUC animé : la photo est découpée en un maillage qui se plie aux articulations.
// <RobotPhoto src="/robot-fanuc.png" :height="560" :opacity="0.3" />
const props = defineProps({
  src: { type: String, default: '/robot-fanuc.png' },
  height: { type: Number, default: 560 },   // hauteur affichée, en pixels
  opacity: { type: Number, default: 0.3 },
  speed: { type: Number, default: 1 },      // 2 = deux fois plus rapide
  position: { type: String, default: 'right' }, // 'right', 'left' ou 'center'
})

const canvas = ref(null)
let raf, observer, alive = true

// Articulations dans l'image robot-fanuc.png (249 x 401 pixels)
const P1 = { x: 128, y: 290 } // épaule
const P2 = { x: 145, y: 118 } // coude
const P3 = { x: 50, y: 45 }   // poignet

const smooth = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const rot = (p, c, a) => {
  const dx = p.x - c.x, dy = p.y - c.y, ca = Math.cos(a), sa = Math.sin(a)
  return { x: c.x + dx * ca - dy * sa, y: c.y + dx * sa + dy * ca }
}

onMounted(() => {
  const c = canvas.value
  const ctx = c.getContext('2d')
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const img = new Image()
  let visible = true

  img.onload = () => {
    if (!alive) return
    const iw = img.naturalWidth, ih = img.naturalHeight
    const pad = 40
    const scale = props.height / (ih + pad * 2)
    const cssW = (iw + pad * 2) * scale, cssH = props.height
    c.style.width = cssW + 'px'
    c.style.height = cssH + 'px'
    c.width = Math.round(cssW * dpr)
    c.height = Math.round(cssH * dpr)

    // Maillage : sommets au repos + poids de chaque articulation
    const cols = 18, rows = 29
    const verts = []
    for (let j = 0; j <= rows; j++) {
      for (let i = 0; i <= cols; i++) {
        const x = (i * iw) / cols, y = (j * ih) / rows
        const k1 = smooth(-14, 14, Math.max(128 - x, 252 - y))
        const k2 = smooth(-14, 14, 125 - y + 0.6 * Math.max(0, x - 165))
        const k3 = smooth(-12, 12, -0.783 * (x - 52) - 0.622 * (y - 45))
        verts.push({ x, y, k1, k2, k3, dx: x, dy: y })
      }
    }
    const at = (i, j) => verts[j * (cols + 1) + i]

    // Ne garder que les cases qui contiennent le robot
    const off = document.createElement('canvas')
    off.width = iw; off.height = ih
    const octx = off.getContext('2d')
    octx.drawImage(img, 0, 0)
    const data = octx.getImageData(0, 0, iw, ih).data
    const cells = []
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x0 = Math.floor((i * iw) / cols), x1 = Math.min(iw, Math.ceil(((i + 1) * iw) / cols) + 1)
        const y0 = Math.floor((j * ih) / rows), y1 = Math.min(ih, Math.ceil(((j + 1) * ih) / rows) + 1)
        let on = false
        for (let y = y0; y < y1 && !on; y += 2)
          for (let x = x0; x < x1; x += 2)
            if (data[(y * iw + x) * 4 + 3] > 10) { on = true; break }
        if (on) cells.push([at(i, j), at(i + 1, j), at(i, j + 1), at(i + 1, j + 1)])
      }
    }

    const tri = (a, b, d) => {
      // agrandit très légèrement le triangle pour éviter les fines coutures
      const cx = (a.dx + b.dx + d.dx) / 3, cy = (a.dy + b.dy + d.dy) / 3
      const g = (v) => {
        const vx = v.dx - cx, vy = v.dy - cy, m = Math.hypot(vx, vy) || 1
        return [v.dx + (vx / m) * 0.6, v.dy + (vy / m) * 0.6]
      }
      const [ax, ay] = g(a), [bx, by] = g(b), [ex, ey] = g(d)
      const det = (b.x - a.x) * (d.y - a.y) - (d.x - a.x) * (b.y - a.y)
      if (Math.abs(det) < 1e-6) return
      const m11 = ((b.dx - a.dx) * (d.y - a.y) - (d.dx - a.dx) * (b.y - a.y)) / det
      const m12 = ((b.dy - a.dy) * (d.y - a.y) - (d.dy - a.dy) * (b.y - a.y)) / det
      const m21 = ((d.dx - a.dx) * (b.x - a.x) - (b.dx - a.dx) * (d.x - a.x)) / det
      const m22 = ((d.dy - a.dy) * (b.x - a.x) - (b.dy - a.dy) * (d.x - a.x)) / det
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(ex, ey); ctx.closePath()
      ctx.clip()
      ctx.transform(m11, m12, m21, m22, a.dx - m11 * a.x - m21 * a.y, a.dy - m12 * a.x - m22 * a.y)
      ctx.drawImage(img, 0, 0)
      ctx.restore()
    }

    const draw = (t) => {
      // angles des trois articulations (en radians)
      const s = t * props.speed
      const t1 = 0.06 * Math.sin(s * 0.00055)
      const t2 = 0.13 * Math.sin(s * 0.0007 + 1.3)
      const t3 = 0.24 * Math.sin(s * 0.001 + 2.4)

      for (const v of verts) {
        let p = { x: v.x, y: v.y }
        if (v.k3 > 0) p = rot(p, P3, t3 * v.k3)
        if (v.k2 > 0) p = rot(p, P2, t2 * v.k2)
        if (v.k1 > 0) p = rot(p, P1, t1 * v.k1)
        v.dx = p.x; v.dy = p.y
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * scale * pad, dpr * scale * pad)
      ctx.imageSmoothingQuality = 'high'
      for (const [a, b, d, e] of cells) {
        tri(a, b, d)
        tri(b, e, d)
      }
    }

    const loop = (t) => {
      if (visible) draw(t)
      raf = requestAnimationFrame(loop)
    }
    observer = new IntersectionObserver(([en]) => { visible = en.isIntersecting })
    observer.observe(c)
    if (reduce) draw(0)
    else raf = requestAnimationFrame(loop)
  }
  img.src = props.src
})

onBeforeUnmount(() => {
  alive = false
  cancelAnimationFrame(raf)
  observer && observer.disconnect()
})
</script>

<template>
  <canvas
    ref="canvas"
    class="robot-photo"
    :class="'pos-' + position"
    :style="{ opacity }"
    aria-hidden="true"
  ></canvas>
</template>

<style scoped>
.robot-photo {
  position: absolute;
  pointer-events: none;
}
.pos-right {
  right: 0;
  bottom: 0;
  -webkit-mask-image: linear-gradient(to left, #000 55%, transparent 100%);
          mask-image: linear-gradient(to left, #000 55%, transparent 100%);
}
.pos-left {
  left: 0;
  bottom: 0;
  -webkit-mask-image: linear-gradient(to right, #000 55%, transparent 100%);
          mask-image: linear-gradient(to right, #000 55%, transparent 100%);
}
/* Au milieu de la section, avec un fondu tout autour */
.pos-center {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -webkit-mask-image: radial-gradient(ellipse at center, #000 45%, transparent 78%);
          mask-image: radial-gradient(ellipse at center, #000 45%, transparent 78%);
}
</style>