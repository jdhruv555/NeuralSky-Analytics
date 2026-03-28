"use client";
import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  r: number;
  opacity: number;
  speed: number;
  twinklePhase: number;
}

export default function StarField({ count = 220, className = "" }: { count?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let stars: Star[] = [];
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const init = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        r: Math.random() * 1.2 + 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      t += 0.012;

      stars.forEach((s) => {
        const twinkle = 0.4 + 0.6 * Math.sin(t * s.speed * 40 + s.twinklePhase);
        const alpha = s.opacity * twinkle;
        const color = s.z > 0.7 ? "0,212,255" : s.z > 0.4 ? "129,140,248" : "255,255,255";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.7 + 0.3 * s.z), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.fill();
        if (s.z > 0.85 && twinkle > 0.8) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color},${alpha * 0.08})`;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const resizeObserver = new ResizeObserver(() => { resize(); init(); });
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: "block" }}
    />
  );
}
