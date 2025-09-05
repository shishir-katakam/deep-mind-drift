import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

interface AudioEngineConfig {
  mode: string;
  isPlaying: boolean;
}

export const useAudioEngine = ({ mode, isPlaying }: AudioEngineConfig) => {
  const [isReady, setIsReady] = useState(false);
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const noiseRef = useRef<Tone.Noise | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const sequenceRef = useRef<Tone.Sequence | null>(null);

  // Initialize audio context and instruments
  useEffect(() => {
    const initAudio = async () => {
      try {
        console.log('Initializing audio engine...');
        
        // Create synth for ambient pads
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: {
            attack: 2,
            decay: 1,
            sustain: 0.3,
            release: 4
          }
        });

        // Create noise for ambient textures
        noiseRef.current = new Tone.Noise('pink');
        
        // Create filter for noise shaping
        filterRef.current = new Tone.Filter({
          frequency: 400,
          type: 'lowpass',
          rolloff: -24
        });

        // Create reverb for ambience
        reverbRef.current = new Tone.Reverb({
          decay: 8,
          wet: 0.6
        });

        // Connect audio chain
        await reverbRef.current.generate();
        
        synthRef.current.chain(reverbRef.current, Tone.Destination);
        noiseRef.current.chain(filterRef.current, reverbRef.current, Tone.Destination);

        setIsReady(true);
        console.log('Audio engine initialized successfully');
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    };

    initAudio();

    return () => {
      // Cleanup
      synthRef.current?.dispose();
      noiseRef.current?.dispose();
      filterRef.current?.dispose();
      reverbRef.current?.dispose();
      sequenceRef.current?.dispose();
    };
  }, []);

  // Generate soundscape based on mode
  const generateSoundscape = async (selectedMode: string) => {
    if (!synthRef.current || !noiseRef.current || !filterRef.current) return;

    console.log(`Generating soundscape for mode: ${selectedMode}`);

    // Stop existing sequence
    if (sequenceRef.current) {
      sequenceRef.current.stop();
      sequenceRef.current.dispose();
    }

    const modeConfigs = {
      focus: {
        chords: ['C4', 'G4', 'Am', 'F4'],
        filterFreq: 800,
        noiseVolume: -25,
        synthVolume: -15,
        tempo: '2n'
      },
      relax: {
        chords: ['Em', 'C4', 'G4', 'D4'],
        filterFreq: 300,
        noiseVolume: -20,
        synthVolume: -12,
        tempo: '1n'
      },
      sleep: {
        chords: ['Am', 'F4', 'C4', 'G4'],
        filterFreq: 200,
        noiseVolume: -15,
        synthVolume: -18,
        tempo: '1n.'
      },
      move: {
        chords: ['C4', 'F4', 'G4', 'Am'],
        filterFreq: 1200,
        noiseVolume: -30,
        synthVolume: -10,
        tempo: '4n'
      },
      study: {
        chords: ['Dm', 'G4', 'C4', 'Am'],
        filterFreq: 600,
        noiseVolume: -22,
        synthVolume: -14,
        tempo: '2n.'
      }
    };

    const config = modeConfigs[selectedMode as keyof typeof modeConfigs] || modeConfigs.focus;

    // Configure filter and volumes
    filterRef.current.frequency.value = config.filterFreq;
    noiseRef.current.volume.value = config.noiseVolume;
    synthRef.current.volume.value = config.synthVolume;

    // Create ambient chord progression
    sequenceRef.current = new Tone.Sequence(
      (time, chord) => {
        if (synthRef.current && isPlaying) {
          synthRef.current.triggerAttackRelease(chord, '4n', time);
        }
      },
      config.chords,
      config.tempo
    );
  };

  // Handle play/pause
  useEffect(() => {
    const handlePlayback = async () => {
      try {
        if (isPlaying) {
          console.log('Starting audio playback...');
          
          // Start Tone.js context
          if (Tone.context.state !== 'running') {
            await Tone.start();
            console.log('Tone.js context started');
          }

          // Generate soundscape for current mode
          await generateSoundscape(mode);

          // Start ambient noise
          if (noiseRef.current) {
            noiseRef.current.start();
          }

          // Start sequence
          if (sequenceRef.current) {
            Tone.Transport.start();
            sequenceRef.current.start(0);
          }

          console.log('Audio playback started successfully');
        } else {
          console.log('Stopping audio playback...');
          
          // Stop everything
          if (noiseRef.current && noiseRef.current.state === 'started') {
            noiseRef.current.stop();
          }
          
          if (sequenceRef.current) {
            sequenceRef.current.stop();
          }
          
          Tone.Transport.stop();
          console.log('Audio playback stopped');
        }
      } catch (error) {
        console.error('Error in audio playback:', error);
      }
    };

    handlePlayback();
  }, [isPlaying, mode]);

  // Update soundscape when mode changes
  useEffect(() => {
    if (isPlaying) {
      generateSoundscape(mode);
    }
  }, [mode]);

  return {
    isReady
  };
};