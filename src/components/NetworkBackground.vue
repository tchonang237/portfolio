<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

// Couleurs réglables depuis le parent : <NetworkBackground node="#fff" link="#3cc3d4" pulse="#f0b050" />
const props = defineProps({
  node: { type: String, default: "#9fd8e2" },   // points
  link: { type: String, default: "#3cc3d4" },   // lignes entre les points
  pulse: { type: String, default: "#f0b050" },  // impulsions qui circulent
});

const canvas = ref(null);
let raf, cleanup;

onMounted(() => {
  const c = canvas.value;
  const x = c.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const mouse = { x: -999, y: -999 };
  let W, H, nodes = [], pulses = [];

  const size = () => {
    const r = c.getBoundingClientRect();
    W = r.width; H = r.height;
    c.width = W * dpr; c.height = H * dpr;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(70, (W * H) / 16000));
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
    }));
  };

  const frame = () => {
    x.clearRect(0, 0, W, H);
    const D = Math.min(150, W / 5);

    nodes.forEach((a, i) => {
      if (!reduce) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
        const dx = mouse.x - a.x, dy = mouse.y - a.y, d = Math.hypot(dx, dy);
        if (d < 160 && d > 1) { a.x += (dx / d) * 0.6; a.y += (dy / d) * 0.6; }
      }
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], l = Math.hypot(a.x - b.x, a.y - b.y);
        if (l < D) {
          x.globalAlpha = (1 - l / D) * 0.55;
          x.strokeStyle = props.link; x.lineWidth = 1;
          x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke();
        }
      }
    });

    x.globalAlpha = 0.9; x.fillStyle = props.node;
    nodes.forEach((a) => { x.beginPath(); x.arc(a.x, a.y, 2.4, 0, 6.283); x.fill(); });

    if (!reduce) {
      if (Math.random() < 0.04 && nodes.length > 1) {
        const s = nodes[(Math.random() * nodes.length) | 0];
        const t = nodes[(Math.random() * nodes.length) | 0];
        if (Math.hypot(s.x - t.x, s.y - t.y) < D * 1.6) pulses.push({ s, t, p: 0 });
      }
      pulses = pulses.filter((q) => q.p < 1);
      pulses.forEach((q) => {
        q.p += 0.025;
        x.globalAlpha = 1; x.fillStyle = props.pulse;
        x.beginPath();
        x.arc(q.s.x + (q.t.x - q.s.x) * q.p, q.s.y + (q.t.y - q.s.y) * q.p, 4, 0, 6.283);
        x.fill();
      });
    }
    x.globalAlpha = 1;
    if (!reduce) raf = requestAnimationFrame(frame);
  };

  const onMove = (e) => {
    const r = c.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  };
  const onResize = () => { size(); if (reduce) frame(); };

  size(); frame();
  addEventListener("pointermove", onMove);
  addEventListener("resize", onResize);
  cleanup = () => {
    removeEventListener("pointermove", onMove);
    removeEventListener("resize", onResize);
  };
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  cleanup && cleanup();
});
</script>

<template>
  <canvas ref="canvas" class="network-bg" aria-hidden="true"></canvas>
</template>

<style scoped>
.network-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>