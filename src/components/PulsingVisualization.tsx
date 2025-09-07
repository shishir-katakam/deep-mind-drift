import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PulsingVisualizationProps {
  isPlaying: boolean;
  mode: string;
  audioIntensity?: number;
}

const getModeColor = (mode: string) => {
  switch (mode) {
    case 'focus':
      return 'hsl(0, 0%, 96%)';
    case 'odyssey':
      return 'hsl(0, 0%, 90%)';
    case 'relax':
      return 'hsl(0, 0%, 85%)';
    default:
      return 'hsl(0, 0%, 96%)';
  }
};

const getModeAnimation = (mode: string) => {
  switch (mode) {
    case 'focus':
      return {
        duration: 2.5,
        ringCount: 4,
        particleCount: 8,
        pulseScale: 0.08,
        particleDistance: 30,
        waveCount: 3,
        complexity: 'geometric'
      };
    case 'odyssey':
      return {
        duration: 1.5,
        ringCount: 6,
        particleCount: 16,
        pulseScale: 0.15,
        particleDistance: 40,
        waveCount: 5,
        complexity: 'cosmic'
      };
    case 'relax':
      return {
        duration: 5,
        ringCount: 3,
        particleCount: 6,
        pulseScale: 0.05,
        particleDistance: 25,
        waveCount: 2,
        complexity: 'organic'
      };
    default:
      return {
        duration: 2.5,
        ringCount: 4,
        particleCount: 8,
        pulseScale: 0.08,
        particleDistance: 30,
        waveCount: 3,
        complexity: 'geometric'
      };
  }
};

export const PulsingVisualization = ({ isPlaying, mode, audioIntensity = 0 }: PulsingVisualizationProps) => {
  const modeColor = getModeColor(mode);
  const modeAnim = getModeAnimation(mode);
  const size = 200 + (audioIntensity * 60);
  const glowIntensity = 0.3 + (audioIntensity * 0.4);

  // Advanced animation patterns for each mode
  const renderFocusAnimation = () => (
    <div className="flex items-center justify-center h-96 relative">
      {/* Geometric concentric squares */}
      {Array.from({ length: 4 }, (_, i) => (
        <motion.div
          key={`square-${i}`}
          className="absolute border border-white/20"
          style={{
            width: size + i * 60,
            height: size + i * 60,
            borderRadius: '12px',
          }}
          animate={{
            rotate: isPlaying ? [0, 360] : 0,
            scale: isPlaying ? [1, 1.05, 1] : 1,
            opacity: isPlaying ? [0.1, 0.3, 0.1] : 0.05,
          }}
          transition={{
            duration: modeAnim.duration + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Traveling lines that converge to center */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute bg-white/30"
          style={{
            width: 2,
            height: size * 0.8,
            left: '50%',
            top: '50%',
            transformOrigin: 'center bottom',
            transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
          }}
          animate={{
            scaleY: isPlaying ? [0, 1, 0.8, 1] : 0,
            opacity: isPlaying ? [0, 0.8, 0.3, 0.8] : 0,
          }}
          transition={{
            duration: modeAnim.duration,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Additional traveling beams */}
      {Array.from({ length: 16 }, (_, i) => (
        <motion.div
          key={`beam-${i}`}
          className="absolute bg-gradient-to-b from-white/60 to-transparent"
          style={{
            width: 1,
            height: size * 0.6,
            left: '50%',
            top: '50%',
            transformOrigin: 'center bottom',
            transform: `translate(-50%, -100%) rotate(${i * 22.5}deg)`,
          }}
          animate={{
            scaleY: isPlaying ? [0, 1, 0] : 0,
            opacity: isPlaying ? [0, 0.6, 0] : 0,
          }}
          transition={{
            duration: modeAnim.duration * 1.5,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Central pulsing square */}
      <motion.div
        className="absolute"
        style={{
          width: size * 0.6,
          height: size * 0.6,
          background: `radial-gradient(circle, ${modeColor}${Math.round(glowIntensity * 128).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          borderRadius: '8px',
          border: `1px solid ${modeColor}`,
        }}
        animate={{
          scale: isPlaying ? [1, 1.1, 1] : 1,
          rotate: isPlaying ? [0, 180, 360] : 0,
        }}
        transition={{
          duration: modeAnim.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );

  const renderOdysseyAnimation = () => (
    <div className="flex items-center justify-center h-96 relative">
      {/* Cosmic spiral arms - monochrome */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={`spiral-${i}`}
          className="absolute border-dashed border-white/20"
          style={{
            width: size + i * 40,
            height: size + i * 40,
            borderRadius: '50%',
          }}
          animate={{
            rotate: isPlaying ? [0, 360] : 0,
            scale: isPlaying ? [1, 1.08, 1] : 1,
            opacity: isPlaying ? [0.2, 0.6, 0.2] : 0.1,
          }}
          transition={{
            duration: modeAnim.duration - i * 0.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Traveling lines from edges to center */}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={`traveling-line-${i}`}
          className="absolute bg-white/40"
          style={{
            width: 1,
            height: size * 0.9,
            left: '50%',
            top: '50%',
            transformOrigin: 'center bottom',
            transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
          }}
          animate={{
            scaleY: isPlaying ? [0, 1, 0.5, 1] : 0,
            opacity: isPlaying ? [0, 0.8, 0.2, 0.8] : 0,
          }}
          transition={{
            duration: modeAnim.duration * 0.8,
            repeat: Infinity,
            delay: i * 0.08,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Orbiting dots - monochrome */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute w-2 h-2 rounded-full bg-white/70"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: isPlaying 
              ? [0, Math.cos(i * Math.PI / 4) * (size * 0.6 + audioIntensity * 30)]
              : 0,
            y: isPlaying 
              ? [0, Math.sin(i * Math.PI / 4) * (size * 0.6 + audioIntensity * 30)]
              : 0,
            scale: isPlaying ? [1, 1.5, 1] : 0,
            opacity: isPlaying ? [0.6, 1, 0.6] : 0,
          }}
          transition={{
            duration: modeAnim.duration,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Central core - monochrome */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.4,
          height: size * 0.4,
          background: `radial-gradient(circle, ${modeColor} 0%, transparent 70%)`,
          boxShadow: `0 0 ${60 + audioIntensity * 80}px ${modeColor}`,
        }}
        animate={{
          scale: isPlaying ? [1, 1.3, 1] : 1,
          rotate: isPlaying ? [0, 360] : 0,
        }}
        transition={{
          duration: modeAnim.duration * 0.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );

  const renderRelaxAnimation = () => (
    <div className="flex items-center justify-center h-96 relative">
      {/* Organic flowing waves - monochrome */}
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute rounded-full border border-white/15"
          style={{
            width: size + i * 70,
            height: (size + i * 70) * 0.6,
            borderRadius: '50%',
          }}
          animate={{
            scaleY: isPlaying ? [1, 1.2, 1] : 1,
            scaleX: isPlaying ? [1, 0.9, 1] : 1,
            opacity: isPlaying ? [0.1, 0.25, 0.1] : 0.05,
            rotate: isPlaying ? [0, 10, -10, 0] : 0,
          }}
          transition={{
            duration: modeAnim.duration + i * 1.5,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Gentle traveling lines converging to center */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={`gentle-line-${i}`}
          className="absolute bg-white/25"
          style={{
            width: 1,
            height: size * 0.7,
            left: '50%',
            top: '50%',
            transformOrigin: 'center bottom',
            transform: `translate(-50%, -100%) rotate(${i * 60}deg)`,
          }}
          animate={{
            scaleY: isPlaying ? [0, 0.8, 0.3, 0.8] : 0,
            opacity: isPlaying ? [0, 0.5, 0.1, 0.5] : 0,
          }}
          transition={{
            duration: modeAnim.duration * 1.2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Floating particles - monochrome */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={`organic-${i}`}
          className="absolute rounded-full bg-white/40"
          style={{
            width: 3 + (i % 2),
            height: 3 + (i % 2),
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: isPlaying 
              ? [0, Math.sin(i * Math.PI / 3) * (30 + audioIntensity * 25)]
              : 0,
            y: isPlaying 
              ? [0, Math.cos(i * Math.PI / 3) * (25 + audioIntensity * 20)]
              : 0,
            scale: isPlaying ? [1, 1.5, 1] : 0,
            opacity: isPlaying ? [0.3, 0.7, 0.3] : 0,
          }}
          transition={{
            duration: modeAnim.duration + i * 0.5,
            repeat: Infinity,
            delay: i * 1.2,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Central breathing core - monochrome */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          background: `radial-gradient(ellipse, ${modeColor}${Math.round(glowIntensity * 96).toString(16).padStart(2, '0')} 0%, transparent 80%)`,
          boxShadow: `0 0 ${30 + audioIntensity * 40}px ${modeColor}${Math.round(glowIntensity * 64).toString(16).padStart(2, '0')}`,
        }}
        animate={{
          scale: isPlaying ? [1, 1.15, 1] : 1,
          opacity: isPlaying ? [0.6, 0.9, 0.6] : 0.3,
        }}
        transition={{
          duration: modeAnim.duration,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </div>
  );

  // Render appropriate animation based on mode
  switch (mode) {
    case 'focus':
      return renderFocusAnimation();
    case 'odyssey':
      return renderOdysseyAnimation();
    case 'relax':
      return renderRelaxAnimation();
    default:
      return renderFocusAnimation();
  }
};