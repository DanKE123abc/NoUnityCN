"use client";

import { useEffect, useRef } from "react";

function noise2D(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = noise2D(ix, iy);
  const b = noise2D(ix + 1, iy);
  const c = noise2D(ix, iy + 1);
  const d = noise2D(ix + 1, iy + 1);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

function fbm(x: number, y: number, octaves: number): number {
  let val = 0;
  let amp = 0.5;
  for (let i = 0; i < octaves; i++) {
    val += amp * smoothNoise(x, y);
    x *= 2;
    y *= 2;
    amp *= 0.5;
  }
  return val;
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!containerRef.current || !ctx) return;

    const container = containerRef.current;
    container.appendChild(canvas);

    let animId: number;
    let w = 0;
    let h = 0;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
      alpha: number;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];
    const maxParticles = 120;

    function resize() {
      w = container.clientWidth;
      h = container.clientHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function spawnParticle(): Particle {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        size: 0.5 + Math.random() * 1.5,
        hue: 180 + Math.random() * 160,
        alpha: 0,
        life: 0,
        maxLife: 300 + Math.random() * 400,
      };
    }

    for (let i = 0; i < maxParticles; i++) {
      const p = spawnParticle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    function animate(time: number) {
      const t = time * 0.001;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.15) p.alpha = lifeRatio / 0.15;
        else if (lifeRatio > 0.8) p.alpha = (1 - lifeRatio) / 0.2;
        else p.alpha = 1;

        const nx = fbm(p.x * 0.002 + t * 0.05, p.y * 0.002 + t * 0.03, 3);
        const ny = fbm(p.x * 0.002 + 100, p.y * 0.002 + t * 0.04 + 100, 3);

        p.vx += (nx - 0.5) * 0.15;
        p.vy += (ny - 0.5) * 0.15;
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -50) p.x += w + 100;
        if (p.x > w + 50) p.x -= w + 100;
        if (p.y < -50) p.y += h + 100;
        if (p.y > h + 50) p.y -= h + 100;

        if (p.life >= p.maxLife) {
          particles[i] = spawnParticle();
        }

        const a = p.alpha * 0.6;
        const hueShift = Math.sin(t * 0.2 + p.x * 0.005) * 30;
        ctx.fillStyle = `hsla(${p.hue + hueShift}, 70%, 65%, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsla(${p.hue + hueShift}, 80%, 50%, ${a * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 80;
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.15 * Math.min(a.alpha, b.alpha);
            const hue = (a.hue + b.hue) / 2;
            ctx.strokeStyle = `hsla(${hue}, 60%, 55%, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    }
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)" }} />;
}
