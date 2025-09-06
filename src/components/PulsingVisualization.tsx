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
      return 'hsl(280, 100%, 85%)';
    case 'relax':
      return 'hsl(200, 100%, 80%)';
    default:
      return 'hsl(0, 0%, 96%)';
  }
};

const getModeAnimation = (mode: string) => {
  switch (mode) {
    case 'focus':
      return {
        duration: 2.5,
        ringCount: 3,
        particleCount: 6,
        pulseScale: 0.08,
        particleDistance: 25
      };
    case 'odyssey':
      return {
        duration: 1.8,
        ringCount: 5,
        particleCount: 12,
        pulseScale: 0.15,
        particleDistance: 35
      };
    case 'relax':
      return {
        duration: 4,
        ringCount: 2,
        particleCount: 4,
        pulseScale: 0.05,
        particleDistance: 20
      };
    default:
      return {
        duration: 2.5,
        ringCount: 3,
        particleCount: 6,
        pulseScale: 0.08,
        particleDistance: 25
      };
  }
};

export const PulsingVisualization = ({ isPlaying, mode, audioIntensity = 0 }: PulsingVisualizationProps) => {
  const modeColor = getModeColor(mode);
  const modeAnim = getModeAnimation(mode);
  const size = 200 + (audioIntensity * 60);
  const glowIntensity = 0.3 + (audioIntensity * 0.4);

  return (
    <div className="flex items-center justify-center h-96 relative">
      {/* Background rings */}
      {Array.from({ length: modeAnim.ringCount }, (_, i) => i + 1).map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border opacity-20"
          style={{
            width: size + ring * 80,
            height: size + ring * 80,
            borderColor: modeColor,
            borderWidth: mode === 'odyssey' ? 2 : 1,
          }}
          animate={{
            scale: isPlaying ? [1, 1.02 + ring * 0.01, 1] : 1,
            opacity: isPlaying ? [0.1, 0.2 + ring * 0.05, 0.1] : 0.05,
            rotate: mode === 'odyssey' ? [0, 360] : 0,
          }}
          transition={{
            duration: modeAnim.duration + ring * 0.5,
            repeat: Infinity,
            ease: mode === 'focus' ? "easeInOut" : mode === 'odyssey' ? "linear" : "easeOut",
          }}
        />
      ))}

      {/* Main pulsing circle */}
      <motion.div
        className="rounded-full relative overflow-hidden"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${modeColor}${Math.round(glowIntensity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          boxShadow: `0 0 ${40 + audioIntensity * 60}px ${modeColor}${Math.round(glowIntensity * 128).toString(16).padStart(2, '0')}`,
        }}
        animate={{
          scale: isPlaying ? [1, 1 + audioIntensity * modeAnim.pulseScale, 1] : 1,
          rotate: mode === 'odyssey' ? [0, 360] : 0,
        }}
        transition={{
          duration: modeAnim.duration * 0.4,
          repeat: Infinity,
          ease: mode === 'focus' ? "easeInOut" : mode === 'odyssey' ? "linear" : "easeOut",
        }}
      >
        {/* Inner particle effects */}
        <div className="absolute inset-0">
          {Array.from({ length: modeAnim.particleCount }, (_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full opacity-60 ${
                mode === 'odyssey' ? 'w-2 h-2' : 'w-1 h-1'
              }`}
              style={{
                backgroundColor: modeColor,
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: isPlaying 
                  ? [0, Math.cos(i * Math.PI / modeAnim.particleCount * 2) * (modeAnim.particleDistance + audioIntensity * 20)]
                  : 0,
                y: isPlaying 
                  ? [0, Math.sin(i * Math.PI / modeAnim.particleCount * 2) * (modeAnim.particleDistance + audioIntensity * 20)]
                  : 0,
                opacity: isPlaying ? [0.6, 0.8, 0.6] : 0,
                scale: mode === 'odyssey' ? [1, 1.5, 1] : [1, 1.2, 1],
              }}
              transition={{
                duration: modeAnim.duration,
                repeat: Infinity,
                delay: i * (modeAnim.duration / modeAnim.particleCount),
                ease: mode === 'focus' ? "easeInOut" : mode === 'odyssey' ? "easeInOut" : "easeOut",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Center dot */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 8,
          height: 8,
          backgroundColor: modeColor,
        }}
        animate={{
          scale: isPlaying ? [1, 1.5 + audioIntensity * 0.5, 1] : 1,
          opacity: isPlaying ? [0.8, 1, 0.8] : 0.5,
        }}
        transition={{
          duration: modeAnim.duration * 0.6,
          repeat: Infinity,
          ease: mode === 'focus' ? "easeInOut" : mode === 'odyssey' ? "linear" : "easeOut",
        }}
      />
    </div>
  );
};