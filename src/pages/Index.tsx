import { useState } from 'react';
import { motion } from 'framer-motion';
import { PulsingVisualization } from '@/components/PulsingVisualization';
import { ModeSelector } from '@/components/ModeSelector';
import { VibeSlider } from '@/components/VibeSlider';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

const Index = () => {
  const [selectedMode, setSelectedMode] = useState('focus');
  const [isPlaying, setIsPlaying] = useState(false);
  const [vibeIntensity, setVibeIntensity] = useState(50);

  const { isReady } = useAudioEngine({ mode: selectedMode, isPlaying });

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
  };

  return (
    <div className="min-h-screen bg-gradient-bg overflow-hidden relative">
      {/* Subtle background animation */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 50%, hsl(0, 0%, 8%) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 50%, hsl(0, 0%, 8%) 0%, transparent 50%)",
            "radial-gradient(ellipse at 20% 50%, hsl(0, 0%, 8%) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header 
          className="text-center pt-16 pb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-light text-foreground tracking-[0.2em] font-mono">
            NIORA
          </h1>
          <p className="text-xs text-muted-foreground mt-2 tracking-wide uppercase">
            Ambient Soundscapes
          </p>
        </motion.header>

        {/* Central visualization */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-16">
          <PulsingVisualization isPlaying={isPlaying} mode={selectedMode} />
          
          {/* Mode selector */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ModeSelector 
              selectedMode={selectedMode} 
              onModeChange={handleModeChange}
            />
          </motion.div>

          {/* Play button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleTogglePlay}
              className="w-16 h-16 rounded-full border border-surface-3 bg-surface-1/50 backdrop-blur-sm hover:bg-surface-2/50 transition-all duration-300 hover:scale-105 hover:shadow-glow group"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
              ) : (
                <Play className="w-6 h-6 text-foreground group-hover:text-primary transition-colors ml-0.5" />
              )}
            </Button>
            {!isReady && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Loading audio...
              </p>
            )}
          </motion.div>

          {/* Vibe slider */}
          <VibeSlider value={vibeIntensity} onChange={setVibeIntensity} />
        </div>

        {/* Footer */}
        <motion.footer 
          className="text-center pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            About / Licenses
          </button>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
