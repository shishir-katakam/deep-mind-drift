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
  const isCrossfadingRef = useRef(false);

  // ⚠️ ⚠️ ⚠️ UPDATE THIS WITH YOUR ACTUAL GITHUB RAW URL ⚠️ ⚠️ ⚠️
  const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/shishir-katakam/niora/main';

  // Initialize on mount
  useEffect(() => {
    // Define your audio files for each category
    audioFilesRef.current = {
      focus: [
        `${GITHUB_BASE_URL}/focus/track1.mp3`,
        `${GITHUB_BASE_URL}/focus/track2.mp3`,
        `${GITHUB_BASE_URL}/focus/track3.mp3`,
        `${GITHUB_BASE_URL}/focus/track4.mp3`,
        `${GITHUB_BASE_URL}/focus/track5.mp3`,
        `${GITHUB_BASE_URL}/focus/track6.mp3`,
        `${GITHUB_BASE_URL}/focus/track7.mp3`,
        `${GITHUB_BASE_URL}/focus/track8.mp3`,
        `${GITHUB_BASE_URL}/focus/track9.mp3`,
        `${GITHUB_BASE_URL}/focus/track10.mp3`,
        `${GITHUB_BASE_URL}/focus/track11.mp3`,
      ],
      odyssey: [
        `${GITHUB_BASE_URL}/odyssey/track1.mp3`,
        `${GITHUB_BASE_URL}/odyssey/track2.mp3`,
        `${GITHUB_BASE_URL}/odyssey/track3.mp3`,
        `${GITHUB_BASE_URL}/focus/track4.mp3`,
      ],
      relax: [
        `${GITHUB_BASE_URL}/relax/track1.mp3`,
        `${GITHUB_BASE_URL}/relax/track2.mp3`,
        `${GITHUB_BASE_URL}/relax/track3.mp3`,
        `${GITHUB_BASE_URL}/relax/track4.mp3`,
      ]
    };

    // Initialize indices
    currentTrackIndexRef.current = {
      focus: 0,
      odyssey: 0,
      relax: 0
    };

    // Create audio element
    audioRef.current = new Audio();
    audioRef.current.volume = 0.7;
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

  // Simulate audio intensity for visualization
  useEffect(() => {
    if (!isPlaying) {
      setAudioIntensity(0);
      return;
    }

    const interval = setInterval(() => {
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

  // Core function: Play a specific track in a mode
  const playTrack = async (selectedMode: string, trackIndex: number) => {
    if (!audioRef.current || !audioFilesRef.current[selectedMode]) return;

    const tracks = audioFilesRef.current[selectedMode];
    if (tracks.length === 0) return;

    const safeIndex = trackIndex % tracks.length; // Ensure we loop
    const trackUrl = tracks[safeIndex];

    try {
      console.log(`[AudioEngine] Playing ${selectedMode} track ${safeIndex + 1}/${tracks.length}`);

      audioRef.current.src = trackUrl;
      await audioRef.current.play();

      // Set up event to play NEXT track when current one ends
      // Use arrow function to preserve 'this' context
      audioRef.current.onended = () => {
        if (isCrossfadingRef.current) return; // Don't trigger if crossfading

        const nextIndex = (safeIndex + 1) % tracks.length;
        currentTrackIndexRef.current[selectedMode] = nextIndex;
        playTrack(selectedMode, nextIndex);
      };

    } catch (error) {
      console.error(`[AudioEngine] Failed to play track:`, error);

      // Skip to next track if this one fails
      const nextIndex = (safeIndex + 1) % tracks.length;
      currentTrackIndexRef.current[selectedMode] = nextIndex;

      // Retry after 1 second
      setTimeout(() => {
        if (isPlaying && !isCrossfadingRef.current) {
          playTrack(selectedMode, nextIndex);
        }
      }, 1000);
    }
  };

  // Smooth crossfade between modes
  const crossfadeToMode = async (newMode: string) => {
    if (!audioRef.current) return;

    isCrossfadingRef.current = true;

    // Fade out current audio
    const fadeOut = () => {
      return new Promise<void>((resolve) => {
        if (!audioRef.current) {
          resolve();
          return;
        }

        const startVolume = audioRef.current.volume;
        const fadeSteps = 20;
        const fadeInterval = 50;
        let step = 0;

        const fade = setInterval(() => {
          step++;
          if (audioRef.current) {
            audioRef.current.volume = startVolume * (1 - step / fadeSteps);
          }

          if (step >= fadeSteps || !audioRef.current) {
            clearInterval(fade);
            if (audioRef.current) {
              audioRef.current.pause();
            }
            resolve();
          }
        }, fadeInterval);
      });
    };

    await fadeOut();

    // Reset track index for new mode (start from beginning)
    currentTrackIndexRef.current[newMode] = 0;

    // Start new mode
    await playTrack(newMode, 0);

    // Fade in new audio
    const fadeIn = () => {
      if (!audioRef.current) return;

      const targetVolume = 0.7;
      const fadeSteps = 20;
      const fadeInterval = 50;
      let step = 0;

      audioRef.current.volume = 0;
      const fade = setInterval(() => {
        step++;
        if (audioRef.current) {
          audioRef.current.volume = (targetVolume * step) / fadeSteps;
        }

        if (step >= fadeSteps) {
          clearInterval(fade);
          isCrossfadingRef.current = false;
        }
      }, fadeInterval);
    };

    fadeIn();
  };

  // Handle play/pause
  useEffect(() => {
    if (!isReady) return;

    if (isPlaying) {
      if (audioRef.current && !audioRef.current.src) {
        // Start playing if nothing is loaded
        playTrack(mode, currentTrackIndexRef.current[mode]);
      } else if (audioRef.current && audioRef.current.paused) {
        // Resume if paused
        audioRef.current.play().catch(err => console.error("Resume failed:", err));
      }
    } else {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isReady, mode]);

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