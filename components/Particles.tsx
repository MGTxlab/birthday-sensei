"use client";

import { useEffect, useRef } from "react";

/**
 * Fond discret : étoiles scintillantes + un mélange de fleurs de sakura et
 * de neige qui tombent doucement. Dessiné en canvas (léger, pas de
 * re-render React) et posé en position fixed derrière tout le contenu.
 */

type Star = {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
};

type FallingBit = {
  kind: "sakura" | "snow";
  x: number;
  y: number;
  size: number;
  speed: number;
  swayAmplitude: number;
  swaySpeed: number;
  swayPhase: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
};

const STAR_COLOR = "255, 255, 255";
const SAKURA_COLOR = "246, 200, 226"; // --sakura-pink
const SNOW_COLOR = "255, 255, 255";

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let fallingBits: FallingBit[] = [];
    let animationId = 0;

    function makeStars(w: number, h: number) {
      // Densité modérée, plafonnée pour rester léger sur mobile.
      const count = Math.min(90, Math.floor((w * h) / 14000));
      return Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 1.2 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    }

    function makeFallingBits(w: number, h: number): FallingBit[] {
      // Majoritairement des fleurs de sakura, un peu de neige mélangée.
      const count = Math.min(26, Math.floor((w * h) / 42000));
      return Array.from({ length: count }, (_, i) => {
        const isSakura = i % 4 !== 0; // ~75% sakura, 25% neige
        return {
          kind: isSakura ? "sakura" : "snow",
          x: Math.random() * w,
          y: Math.random() * h,
          size: isSakura ? Math.random() * 3 + 3 : Math.random() * 2 + 1.3,
          speed: isSakura ? Math.random() * 0.35 + 0.25 : Math.random() * 0.55 + 0.45,
          swayAmplitude: isSakura ? Math.random() * 18 + 8 : Math.random() * 8 + 3,
          swaySpeed: Math.random() * 0.02 + 0.008,
          swayPhase: Math.random() * Math.PI * 2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          alpha: isSakura ? Math.random() * 0.4 + 0.5 : Math.random() * 0.5 + 0.4,
        };
      });
    }

    function resize() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = makeStars(width, height);
      fallingBits = makeFallingBits(width, height);
    }

    function drawFallingBit(b: FallingBit, x: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(x, b.y);
      ctx.rotate(b.rotation);
      if (b.kind === "sakura") {
        ctx.fillStyle = `rgba(${SAKURA_COLOR}, ${b.alpha})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, b.size, b.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = `rgba(${SNOW_COLOR}, ${b.alpha})`;
        ctx.beginPath();
        ctx.arc(0, 0, b.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawStatic() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${STAR_COLOR}, ${s.baseAlpha})`;
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const b of fallingBits) {
        drawFallingBit(b, b.x);
      }
    }

    let frame = 0;
    function draw() {
      if (!ctx) return;
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        const twinkle =
          Math.sin(frame * s.twinkleSpeed + s.twinklePhase) * 0.35 + 0.65;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${STAR_COLOR}, ${s.baseAlpha * twinkle})`;
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const b of fallingBits) {
        b.y += b.speed;
        b.rotation += b.rotationSpeed;
        if (b.y > height + 10) {
          b.y = -10;
          b.x = Math.random() * width;
        }
        const swayX = Math.sin(frame * b.swaySpeed + b.swayPhase) * b.swayAmplitude;
        drawFallingBit(b, b.x + swayX);
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();

    if (prefersReducedMotion) {
      drawStatic();
    } else {
      animationId = requestAnimationFrame(draw);
    }

    let resizeTimeout: ReturnType<typeof setTimeout>;
    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        if (prefersReducedMotion) drawStatic();
      }, 150);
    }
    window.addEventListener("resize", handleResize);

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(draw);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
