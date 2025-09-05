import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

interface AudioEngineConfig {
  mode: string;
  isPlaying: boolean;
}

export const useAudioEngine = ({ mode, isPlaying }: AudioEngineConfig) => {
  const [isReady, setIsReady] = useState(false);
  const padSynthRef = useRef<Tone.PolySynth | null>(null);
  const leadSynthRef = useRef<Tone.Synth | null>(null);
  const bassSynthRef = useRef<Tone.Synth | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const delayRef = useRef<Tone.PingPongDelay | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const padSequenceRef = useRef<Tone.Sequence | null>(null);
  const leadSequenceRef = useRef<Tone.Sequence | null>(null);
  const bassSequenceRef = useRef<Tone.Sequence | null>(null);

  // Initialize audio context and instruments
  useEffect(() => {
    const initAudio = async () => {
      try {
        console.log('Initializing musical ambient engine...');
        
        // Create warm pad synth for ambient chords
        padSynthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { 
            type: 'sawtooth'
          },
          envelope: {
            attack: 8,
            decay: 2,
            sustain: 0.6,
            release: 12
          }
        });

        // Create soft lead synth for melodies
        leadSynthRef.current = new Tone.Synth({
          oscillator: { 
            type: 'sine'
          },
          envelope: {
            attack: 1,
            decay: 1,
            sustain: 0.4,
            release: 8
          }
        });

        // Create warm bass synth
        bassSynthRef.current = new Tone.Synth({
          oscillator: { 
            type: 'triangle'
          },
          envelope: {
            attack: 2,
            decay: 2,
            sustain: 0.8,
            release: 6
          }
        });

        // Create lush reverb
        reverbRef.current = new Tone.Reverb({
          decay: 15,
          wet: 0.7,
          preDelay: 0.01
        });

        // Create gentle delay
        delayRef.current = new Tone.PingPongDelay({
          delayTime: '8n',
          feedback: 0.3,
          wet: 0.2
        });

        // Create warm filter
        filterRef.current = new Tone.Filter({
          frequency: 1200,
          type: 'lowpass',
          rolloff: -12
        });

        // Connect audio chain
        await reverbRef.current.generate();
        
        // Pad chain: Pad -> Reverb -> Destination
        padSynthRef.current.chain(filterRef.current, reverbRef.current, Tone.Destination);
        
        // Lead chain: Lead -> Delay -> Reverb -> Destination  
        leadSynthRef.current.chain(delayRef.current, reverbRef.current, Tone.Destination);
        
        // Bass chain: Bass -> Reverb -> Destination
        bassSynthRef.current.chain(reverbRef.current, Tone.Destination);

        // Set volumes for balanced mix
        padSynthRef.current.volume.value = -12;
        leadSynthRef.current.volume.value = -18;
        bassSynthRef.current.volume.value = -20;

        setIsReady(true);
        console.log('Musical ambient engine initialized successfully');
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    };

    initAudio();

    return () => {
      // Cleanup
      padSynthRef.current?.dispose();
      leadSynthRef.current?.dispose();
      bassSynthRef.current?.dispose();
      filterRef.current?.dispose();
      reverbRef.current?.dispose();
      delayRef.current?.dispose();
      padSequenceRef.current?.dispose();
      leadSequenceRef.current?.dispose();
      bassSequenceRef.current?.dispose();
    };
  }, []);

  // Generate beautiful musical soundscape based on mode
  const generateSoundscape = async (selectedMode: string) => {
    if (!padSynthRef.current || !leadSynthRef.current || !bassSynthRef.current) return;

    console.log(`Generating musical soundscape for mode: ${selectedMode}`);

    // Stop existing sequences
    if (padSequenceRef.current) {
      padSequenceRef.current.stop();
      padSequenceRef.current.dispose();
    }
    if (leadSequenceRef.current) {
      leadSequenceRef.current.stop();
      leadSequenceRef.current.dispose();
    }
    if (bassSequenceRef.current) {
      bassSequenceRef.current.stop();
      bassSequenceRef.current.dispose();
    }

    const modeConfigs = {
      focus: {
        padChords: [['C4', 'E4', 'G4'], ['Am', 'C5', 'E5'], ['F4', 'A4', 'C5'], ['G4', 'B4', 'D5']],
        leadNotes: ['G5', 'E5', 'C5', 'D5', 'F5', 'E5', 'D5', 'C5'],
        bassNotes: ['C2', 'A1', 'F1', 'G1'],
        padTempo: '1n',
        leadTempo: '4n',
        bassTempo: '2n',
        filterFreq: 1000
      },
      relax: {
        padChords: [['Em', 'G4', 'B4'], ['C4', 'E4', 'G4'], ['Am', 'C5', 'E5'], ['D4', 'F#4', 'A4']],
        leadNotes: ['B4', 'G4', 'E4', 'G4', 'D5', 'B4', 'A4', 'G4'],
        bassNotes: ['E1', 'C2', 'A1', 'D2'],
        padTempo: '1n.',
        leadTempo: '2n',
        bassTempo: '1n',
        filterFreq: 800
      },
      sleep: {
        padChords: [['Am', 'C5', 'E5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5']],
        leadNotes: ['C5', 'E5', 'G5', 'E5', 'D5', 'C5', 'B4', 'A4'],
        bassNotes: ['A1', 'F1', 'C2', 'G1'],
        padTempo: '2n',
        leadTempo: '1n',
        bassTempo: '2n.',
        filterFreq: 600
      },
      move: {
        padChords: [['C4', 'E4', 'G4'], ['F4', 'A4', 'C5'], ['G4', 'B4', 'D5'], ['Am', 'C5', 'E5']],
        leadNotes: ['C5', 'D5', 'E5', 'F5', 'G5', 'F5', 'E5', 'D5'],
        bassNotes: ['C2', 'F1', 'G1', 'A1'],
        padTempo: '4n',
        leadTempo: '8n',
        bassTempo: '4n',
        filterFreq: 1400
      },
      study: {
        padChords: [['Dm', 'F4', 'A4'], ['G4', 'B4', 'D5'], ['C4', 'E4', 'G4'], ['Am', 'C5', 'E5']],
        leadNotes: ['D5', 'F5', 'A5', 'G5', 'F5', 'E5', 'D5', 'C5'],
        bassNotes: ['D2', 'G1', 'C2', 'A1'],
        padTempo: '2n.',
        leadTempo: '4n.',
        bassTempo: '2n',
        filterFreq: 900
      }
    };

    const config = modeConfigs[selectedMode as keyof typeof modeConfigs] || modeConfigs.focus;

    // Configure filter
    if (filterRef.current) {
      filterRef.current.frequency.value = config.filterFreq;
    }

    // Create ambient pad chord progression
    padSequenceRef.current = new Tone.Sequence(
      (time, chord) => {
        if (padSynthRef.current && isPlaying) {
          padSynthRef.current.triggerAttackRelease(chord, '2n', time);
        }
      },
      config.padChords,
      config.padTempo
    );

    // Create gentle lead melody
    leadSequenceRef.current = new Tone.Sequence(
      (time, note) => {
        if (leadSynthRef.current && isPlaying) {
          leadSynthRef.current.triggerAttackRelease(note, '8n', time);
        }
      },
      config.leadNotes,
      config.leadTempo
    );

    // Create subtle bass line
    bassSequenceRef.current = new Tone.Sequence(
      (time, note) => {
        if (bassSynthRef.current && isPlaying) {
          bassSynthRef.current.triggerAttackRelease(note, '4n', time);
        }
      },
      config.bassNotes,
      config.bassTempo
    );
  };

  // Handle play/pause
  useEffect(() => {
    const handlePlayback = async () => {
      try {
        if (isPlaying) {
          console.log('Starting musical ambient playback...');
          
          // Start Tone.js context
          if (Tone.context.state !== 'running') {
            await Tone.start();
            console.log('Tone.js context started');
          }

          // Generate soundscape for current mode
          await generateSoundscape(mode);

          // Start all sequences
          if (padSequenceRef.current) {
            Tone.Transport.start();
            padSequenceRef.current.start(0);
          }
          
          if (leadSequenceRef.current) {
            leadSequenceRef.current.start('4n');
          }
          
          if (bassSequenceRef.current) {
            bassSequenceRef.current.start('2n');
          }

          console.log('Musical ambient playback started successfully');
        } else {
          console.log('Stopping musical ambient playback...');
          
          // Stop all sequences
          if (padSequenceRef.current) {
            padSequenceRef.current.stop();
          }
          
          if (leadSequenceRef.current) {
            leadSequenceRef.current.stop();
          }
          
          if (bassSequenceRef.current) {
            bassSequenceRef.current.stop();
          }
          
          Tone.Transport.stop();
          console.log('Musical ambient playback stopped');
        }
      } catch (error) {
        console.error('Error in musical ambient playback:', error);
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