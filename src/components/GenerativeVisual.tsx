import { useEffect, useRef } from 'react';

interface GenerativeVisualProps {
  mode: string;
  isPlaying: boolean;
}

export const GenerativeVisual = ({ mode, isPlaying }: GenerativeVisualProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createParticle = () => {
      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 150 + 50;
      
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 0,
        maxLife: Math.random() * 200 + 100
      };
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      if (isPlaying && particlesRef.current.length < 30) {
        particlesRef.current.push(createParticle());
      }

      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        const opacity = 1 - (particle.life / particle.maxLife);
        const size = opacity * 2;

        if (opacity > 0) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(var(--primary) / ${opacity * 0.6})`;
          ctx.fill();

          // Draw connecting lines
          if (index > 0) {
            const prev = particlesRef.current[index - 1];
            const distance = Math.sqrt(
              Math.pow(particle.x - prev.x, 2) + Math.pow(particle.y - prev.y, 2)
            );
            
            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(prev.x, prev.y);
              ctx.lineTo(particle.x, particle.y);
              ctx.strokeStyle = `hsl(var(--primary) / ${opacity * 0.2})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        } else {
          particlesRef.current.splice(index, 1);
        }
      });

      // Central orbital rings
      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;
      const time = Date.now() * 0.001;

      for (let i = 0; i < 3; i++) {
        const radius = 80 + i * 30;
        const rotation = time * (0.2 + i * 0.1);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsl(var(--primary) / ${0.1 + i * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Orbital points
        const orbitalX = centerX + Math.cos(rotation) * radius;
        const orbitalY = centerY + Math.sin(rotation) * radius;
        
        ctx.beginPath();
        ctx.arc(orbitalX, orbitalY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(var(--primary) / ${0.6})`;
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, mode]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-80"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};