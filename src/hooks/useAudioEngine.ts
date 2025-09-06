import { useEffect, useRef, useState } from 'react';

interface AudioEngineConfig {
  mode: string;
  isPlaying: boolean;
}

export const useAudioEngine = ({ mode, isPlaying }: AudioEngineConfig) => {
  const [isReady, setIsReady] = useState(false);
  const [audioIntensity, setAudioIntensity] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioFilesRef = useRef<{ [key: string]: string[] }>({});
  const currentTrackIndexRef = useRef<{ [key: string]: number }>({});
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // GitHub repository base URL (update with your actual repository)
  const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/yourusername/yourrepo/main';

  // Initialize audio files mapping
  useEffect(() => {
    // Define your audio files for each category
    audioFilesRef.current = {
      focus: [
        `${GITHUB_BASE_URL}/focus/track1.mp3`,
        `${GITHUB_BASE_URL}/focus/track2.mp3`,
        `${GITHUB_BASE_URL}/focus/track3.mp3`,
        `${GITHUB_BASE_URL}/focus/track4.mp3`,
      ],
      odyssey: [
        `${GITHUB_BASE_URL}/odyssey/track1.mp3`,
        `${GITHUB_BASE_URL}/odyssey/track2.mp3`,
        `${GITHUB_BASE_URL}/odyssey/track3.mp3`,
        `${GITHUB_BASE_URL}/odyssey/track4.mp3`,
      ],
      relax: [
        `${GITHUB_BASE_URL}/relax/track1.mp3`,
        `${GITHUB_BASE_URL}/relax/track2.mp3`,
        `${GITHUB_BASE_URL}/relax/track3.mp3`,
        `${GITHUB_BASE_URL}/relax/track4.mp3`,
      ]
    };

    // Initialize track indices
    currentTrackIndexRef.current = {
      focus: 0,
      odyssey: 0,
      relax: 0
    };

    // Create audio element
    audioRef.current = new Audio();
    audioRef.current.volume = 0.7;
    audioRef.current.loop = false;
    audioRef.current.crossOrigin = 'anonymous';

    setIsReady(true);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  // Audio intensity simulation for visualization
  useEffect(() => {
    if (!isPlaying) {
      setAudioIntensity(0);
      return;
    }

    const interval = setInterval(() => {
      // Simulate audio intensity with mode-specific patterns
      let baseIntensity = 0.3;
      let variation = 0.2;
      
      switch (mode) {
        case 'focus':
          baseIntensity = 0.4 + Math.sin(Date.now() * 0.002) * 0.15;
          variation = Math.random() * 0.2;
          break;
        case 'odyssey':
          baseIntensity = 0.5 + Math.sin(Date.now() * 0.0015) * 0.2;
          variation = Math.random() * 0.3;
          break;
        case 'relax':
          baseIntensity = 0.25 + Math.sin(Date.now() * 0.001) * 0.1;
          variation = Math.random() * 0.15;
          break;
      }
      
      setAudioIntensity(Math.max(0, Math.min(1, baseIntensity + variation)));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, mode]);

  // Load and play next track in sequence
  const playNextTrack = async (selectedMode: string) => {
    if (!audioRef.current || !audioFilesRef.current[selectedMode]) return;

    const tracks = audioFilesRef.current[selectedMode];
    const currentIndex = currentTrackIndexRef.current[selectedMode];
    const track = tracks[currentIndex];

    try {
      audioRef.current.src = track;
      await audioRef.current.play();

      // Set up end event to play next track
      audioRef.current.onended = () => {
        // Move to next track, loop back to first if at end
        currentTrackIndexRef.current[selectedMode] = 
          (currentIndex + 1) % tracks.length;
        
        if (isPlaying) {
          playNextTrack(selectedMode);
        }
      };

      console.log(`Playing ${selectedMode} track ${currentIndex + 1}/${tracks.length}`);
    } catch (error) {
      console.error('Error playing track:', error);
      // Try next track if current fails
      currentTrackIndexRef.current[selectedMode] = 
        (currentIndex + 1) % tracks.length;
      if (isPlaying) {
        setTimeout(() => playNextTrack(selectedMode), 1000);
      }
    }
  };

  // Smooth crossfade between modes
  const crossfadeToMode = async (newMode: string) => {
    if (!audioRef.current) return;

    // Fade out current audio
    const fadeOut = () => {
      return new Promise<void>((resolve) => {
        const startVolume = audioRef.current!.volume;
        const fadeSteps = 20;
        const fadeInterval = 50;
        let step = 0;

        const fade = setInterval(() => {
          step++;
          audioRef.current!.volume = startVolume * (1 - step / fadeSteps);
          
          if (step >= fadeSteps) {
            clearInterval(fade);
            audioRef.current!.pause();
            resolve();
          }
        }, fadeInterval);
      });
    };

    await fadeOut();
    
    // Start new mode
    await playNextTrack(newMode);
    
    // Fade in new audio
    const fadeIn = () => {
      const targetVolume = 0.7;
      const fadeSteps = 20;
      const fadeInterval = 50;
      let step = 0;

      audioRef.current!.volume = 0;
      
      const fade = setInterval(() => {
        step++;
        audioRef.current!.volume = (targetVolume * step) / fadeSteps;
        
        if (step >= fadeSteps) {
          clearInterval(fade);
        }
      }, fadeInterval);
    };

    fadeIn();
  };

  // Handle play/pause
  useEffect(() => {
    const handlePlayback = async () => {
      if (!audioRef.current || !isReady) return;

      try {
        if (isPlaying) {
          console.log(`Starting ${mode} playback...`);
          await playNextTrack(mode);
        } else {
          console.log('Pausing playback...');
          audioRef.current.pause();
        }
      } catch (error) {
        console.error('Error in playback:', error);
      }
    };

    handlePlayback();
  }, [isPlaying, isReady]);

  // Handle mode changes with crossfade
  useEffect(() => {
    if (isPlaying && isReady) {
      crossfadeToMode(mode);
    }
  }, [mode, isReady]);

  return {
    isReady,
    audioIntensity
  };
};