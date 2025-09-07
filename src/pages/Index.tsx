import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PulsingVisualization } from '@/components/PulsingVisualization';
import { ModeSelector } from '@/components/ModeSelector';
import { VibeSlider } from '@/components/VibeSlider';
import { PlaybackControls } from '@/components/PlaybackControls';
import { useAudioEngine } from '@/hooks/useAudioEngine';

const Index = () => {
  const [selectedMode, setSelectedMode] = useState('focus');
  const [isPlaying, setIsPlaying] = useState(false);
  const [vibeIntensity, setVibeIntensity] = useState(50);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25); // Default to 25 minutes
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { isReady, audioIntensity } = useAudioEngine({ mode: selectedMode, isPlaying });

  // Timer functionality
  useEffect(() => {
    if (timerActive && isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Timer finished
            setIsPlaying(false);
            setTimerActive(false);
            setSessionStartTime(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive, isPlaying, timeRemaining]);

  const handleTogglePlay = () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    
    if (newPlayState && timerActive && timeRemaining === 0) {
      // Start new timer session
      const duration = timerMinutes * 60;
      setTimeRemaining(duration);
      setSessionStartTime(Date.now());
    } else if (newPlayState && !sessionStartTime) {
      setSessionStartTime(Date.now());
    }
  };

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimerActive(false);
    setTimeRemaining(0);
    setSessionStartTime(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTimerToggle = () => {
    if (!timerActive) {
      // Activate timer
      const duration = timerMinutes * 60;
      setTimeRemaining(duration);
      setTimerActive(true);
    } else {
      // Deactivate timer
      setTimerActive(false);
      setTimeRemaining(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      <div className="relative z-10 min-h-screen flex flex-col pb-32"> {/* Added pb-32 for bottom padding */}
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
          <PulsingVisualization 
            isPlaying={isPlaying} 
            mode={selectedMode} 
            audioIntensity={audioIntensity} 
          />
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
          {/* Loading indicator */}
          {!isReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground text-center"
            >
              Loading audio engine...
            </motion.div>
          )}
          {/* Vibe slider (hidden for now)
<VibeSlider value={vibeIntensity} onChange={setVibeIntensity} />
*/}

          
          {/* Timer display */}
          {timerActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="text-2xl font-mono text-foreground/80 mb-2">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-muted-foreground">
                {timeRemaining > 0 ? 'Session Active' : 'Session Complete'}
              </div>
            </motion.div>
          )}
        </div>
        {/* Footer */}
        <motion.footer 
  className="text-center pb-8"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8, delay: 0.6 }}
>
  <a
    href="https://github.com/shishir-katakam/niora"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 transition-all duration-300 w-max mx-auto"
  >
    {/* GitHub Logo */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path
        fillRule="evenodd"
        d="M12 0C5.373 0 0 5.373 0 12c0 5.303 
           3.438 9.8 8.207 11.387.6.111.793-.261.793-.577
           0-.285-.011-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61
           -.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.73.083-.73
           1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998
           .108-.775.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.93
           0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 
           1.008-.322 3.301 1.23a11.48 11.48 0 0 1 3.003-.404c1.018.005 
           2.043.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23 
           .655 1.653.243 2.873.119 3.176.77.84 1.235 1.911 
           1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 
           0 1.606-.015 2.896-.015 3.289 0 .319.192.694.799.576C20.565 
           21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"
      />
    </svg>
    Github
  </a>
</motion.footer>

      </div>
      {/* Playback Controls */}
      <PlaybackControls
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onTimerToggle={handleTimerToggle}
        timerActive={timerActive}
      />
    </div>
  );
};

export default Index;