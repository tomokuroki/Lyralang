import React, { useEffect, useRef } from 'react';

export default function AudioVisualizer({ isPlaying, analyserNode }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const w = Math.floor(rect.width || 144);
      const h = Math.floor(rect.height || 28);
      
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
      }
      return { w, h };
    };

    const draw = () => {
      const { w, h } = resize();
      ctx.clearRect(0, 0, w, h);

      if (isPlaying && analyserNode) {
        const buf = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteTimeDomainData(buf);
        ctx.lineWidth = 1.25;
        ctx.strokeStyle = '#FBBF24';
        ctx.beginPath();
        
        const step = Math.max(1, Math.floor(buf.length / w));
        let x = 0;
        for (let i = 0; i < buf.length; i += step) {
          const v = buf[i] / 128.0;
          const y = (v - 1) * (h / 2) + h / 2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += (w / (buf.length / step));
        }
        ctx.stroke();
      } else {
        phase += 0.03;
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#262626';
        ctx.beginPath();
        for (let x = 0; x < w; x += 2) {
          const y = h / 2 + Math.sin(x * 0.05 + phase) * 1.5;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, analyserNode]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ display: 'block' }}
    />
  );
}
