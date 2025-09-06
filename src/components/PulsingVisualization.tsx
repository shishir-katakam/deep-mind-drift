import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PulsingVisualizationProps {
  isPlaying: boolean;
  mode: string;
}

const getModeColor = (mode: string) => {
  switch (mode) {
    case 'focus':
      return 'hsl(0, 0%, 96%)';
    case 'relax':
      return 'hsl(200, 100%, 80%)';
    case 'sleep':
      return 'hsl(260, 100%, 85%)';
    case 'move':
      return 'hsl(40, 100%, 75%)';
    case 'study':
      return 'hsl(120, 60%, 70%)';
    default:
      return 'hsl(0, 0%, 96%)';
  }
};

export const PulsingVisualization = ({ isPlaying, mode }: PulsingVisualizationProps) => {
  const [audioIntensity, setAudioIntensity] = useState(0);
  
  useEffect(() => {
    if (!isPlaying) {
      setAudioIntensity(0);
      return;
    }

    const interval = setInterval(() => {
      // Simulate audio intensity with smooth variations
      const baseIntensity = 0.3 + Math.sin(Date.now() * 0.001) * 0.1;
      const randomVariation = Math.random() * 0.2;
      setAudioIntensity(Math.max(0, Math.min(1, baseIntensity + randomVariation)));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const modeColor = getModeColor(mode);
  const size = 200 + (audioIntensity * 60);
  const glowIntensity = 0.3 + (audioIntensity * 0.4);

  return (
    <div className="flex items-center justify-center h-96 relative">
      {/* Background rings */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border opacity-20"
          style={{
            width: size + ring * 80,
            height: size + ring * 80,
            borderColor: modeColor,
            borderWidth: 1,
          }}
          animate={{
            scale: isPlaying ? [1, 1.02, 1] : 1,
            opacity: isPlaying ? [0.1, 0.2, 0.1] : 0.05,
          }}
          transition={{
            duration: 3 + ring * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
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
          scale: isPlaying ? [1, 1 + audioIntensity * 0.1, 1] : 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Inner particle effects */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-60"
              style={{
                backgroundColor: modeColor,
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: isPlaying 
                  ? [0, Math.cos(i * Math.PI / 4) * (30 + audioIntensity * 20)]
                  : 0,
                y: isPlaying 
                  ? [0, Math.sin(i * Math.PI / 4) * (30 + audioIntensity * 20)]
                  : 0,
                opacity: isPlaying ? [0.6, 0.8, 0.6] : 0,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
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
          scale: isPlaying ? [1, 1.5, 1] : 1,
          opacity: isPlaying ? [0.8, 1, 0.8] : 0.5,
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};