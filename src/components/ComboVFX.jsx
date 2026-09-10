import React, { useEffect, useRef } from 'react';

export function ComboVFX({ streak, comboMultiplier, comboTierName, comboEvent }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  // Trigger gentle pastel particles on milestone
  useEffect(() => {
    if (!comboEvent) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const pastelColors = ['#4EAC85', '#7D70BA', '#E56B6F', '#DCA134', '#4A90E2'];
    const particleCount = 20 + comboEvent.level * 10;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5);
      const speed = 2 + Math.random() * (3 + comboEvent.level);
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3 + Math.random() * 4,
        color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
        alpha: 1,
        decay: 0.02 + Math.random() * 0.02
      });
    }
  }, [comboEvent]);

  // Particle loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.radius *= 0.98;

        if (p.alpha <= 0 || p.radius <= 0.5) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="combo-vfx-container">
      <canvas
        ref={canvasRef}
        width={360}
        height={160}
        className="combo-canvas"
      />

      {comboEvent && (
        <div key={comboEvent.id} className="combo-milestone-popup animate-pop">
          <div className="combo-level-tag">NIVEL {comboEvent.level}</div>
          <div className="combo-title">{comboEvent.title}</div>
          <div className="combo-count-badge">{comboEvent.streak} HITS CONSECUTIVOS</div>
        </div>
      )}

      <style>{`
        .combo-vfx-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .combo-canvas {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 10;
        }

        .combo-milestone-popup {
          position: absolute;
          top: -30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #FFFFFF;
          border: 1.5px solid var(--pastel-lavender-border);
          border-radius: var(--radius-md);
          padding: 8px 16px;
          box-shadow: var(--shadow-md);
          z-index: 20;
          animation: comboFloat 1.4s ease-out forwards;
        }

        .combo-level-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: var(--pastel-lavender);
          text-transform: uppercase;
        }

        .combo-title {
          font-size: 14px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .combo-count-badge {
          font-size: 11px;
          font-weight: 600;
          color: var(--pastel-mint);
        }
      `}</style>
    </div>
  );
}
