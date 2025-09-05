import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

interface AudioEngineConfig {
  mode: string;
  isPlaying: boolean;
}

interface AudioLayer {
  synth: Tone.Synth | Tone.PolySynth | Tone.Noise;
  sequence?: Tone.Sequence;
  loop?: Tone.Loop;
  volume: Tone.Volume;
  effects: Tone.ToneAudioNode[];
}

export const useAudioEngine = ({ mode, isPlaying }: AudioEngineConfig) => {
  const [isReady, setIsReady] = useState(false);
  
  // Audio layers for rich soundscapes
  const padLayerRef = useRef<AudioLayer | null>(null);
  const droneLayerRef = useRef<AudioLayer | null>(null);
  const pulseLayerRef = useRef<AudioLayer | null>(null);
  const textureLayerRef = useRef<AudioLayer | null>(null);
  const melodyLayerRef = useRef<AudioLayer | null>(null);
  
  // Master effects
  const masterReverbRef = useRef<Tone.Reverb | null>(null);
  const masterFilterRef = useRef<Tone.Filter | null>(null);
  const masterCompressorRef = useRef<Tone.Compressor | null>(null);
  
  // Sequencing and randomization
  const activeSequencesRef = useRef<Tone.Sequence[]>([]);
  const activeLoopsRef = useRef<Tone.Loop[]>([]);

  // Initialize layered audio engine
  useEffect(() => {
    const initAudio = async () => {
      try {
        console.log('Initializing layered ambient engine...');
        
        // Master effects chain
        masterCompressorRef.current = new Tone.Compressor({
          threshold: -18,
          ratio: 4,
          attack: 0.003,
          release: 0.1
        });

        masterFilterRef.current = new Tone.Filter({
          frequency: 8000,
          type: 'lowpass',
          rolloff: -24
        });

        masterReverbRef.current = new Tone.Reverb({
          decay: 8,
          wet: 0.3,
          preDelay: 0.01
        });

        await masterReverbRef.current.generate();

        // Connect master chain
        masterCompressorRef.current
          .chain(masterFilterRef.current, masterReverbRef.current, Tone.Destination);

        // Initialize audio layers
        await initAudioLayers();

        setIsReady(true);
        console.log('Layered ambient engine initialized successfully');
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    };

    const initAudioLayers = async () => {
      // Pad Layer - Warm ambient foundation
      const padSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { 
          type: 'triangle',
          partialCount: 8
        },
        envelope: {
          attack: 6,
          decay: 4,
          sustain: 0.7,
          release: 8
        }
      });

      const padVolume = new Tone.Volume(-15);
      const padFilter = new Tone.Filter(800, 'lowpass');
      const padChorus = new Tone.Chorus(4, 2.5, 0.5);
      
      padSynth.chain(padFilter, padChorus, padVolume, masterCompressorRef.current!);
      
      padLayerRef.current = {
        synth: padSynth,
        volume: padVolume,
        effects: [padFilter, padChorus]
      };

      // Drone Layer - Deep continuous texture
      const droneSynth = new Tone.Synth({
        oscillator: { 
          type: 'sawtooth'
        },
        envelope: {
          attack: 10,
          decay: 0,
          sustain: 1,
          release: 10
        }
      });

      const droneVolume = new Tone.Volume(-20);
      const droneFilter = new Tone.Filter(400, 'lowpass');
      const droneDistortion = new Tone.Distortion(0.1);
      
      droneSynth.chain(droneDistortion, droneFilter, droneVolume, masterCompressorRef.current!);
      
      droneLayerRef.current = {
        synth: droneSynth,
        volume: droneVolume,
        effects: [droneFilter, droneDistortion]
      };

      // Pulse Layer - Rhythmic elements
      const pulseSynth = new Tone.Synth({
        oscillator: { 
          type: 'sine'
        },
        envelope: {
          attack: 0.01,
          decay: 0.5,
          sustain: 0,
          release: 0.1
        }
      });

      const pulseVolume = new Tone.Volume(-22);
      const pulseDelay = new Tone.PingPongDelay('8n', 0.2);
      const pulseFilter = new Tone.Filter(2000, 'lowpass');
      
      pulseSynth.chain(pulseFilter, pulseDelay, pulseVolume, masterCompressorRef.current!);
      
      pulseLayerRef.current = {
        synth: pulseSynth,
        volume: pulseVolume,
        effects: [pulseFilter, pulseDelay]
      };

      // Texture Layer - Pink noise and organic sounds
      const textureSynth = new Tone.Noise('pink');
      const textureVolume = new Tone.Volume(-28);
      const textureFilter = new Tone.Filter(1500, 'bandpass');
      const textureAutoFilter = new Tone.AutoFilter(0.1, 100, 4);
      
      textureSynth.chain(textureFilter, textureAutoFilter, textureVolume, masterCompressorRef.current!);
      
      textureLayerRef.current = {
        synth: textureSynth,
        volume: textureVolume,
        effects: [textureFilter, textureAutoFilter]
      };

      // Melody Layer - Gentle melodic phrases
      const melodySynth = new Tone.Synth({
        oscillator: { 
          type: 'sine'
        },
        envelope: {
          attack: 1,
          decay: 2,
          sustain: 0.3,
          release: 4
        }
      });

      const melodyVolume = new Tone.Volume(-18);
      const melodyReverb = new Tone.Reverb(4);
      const melodyDelay = new Tone.FeedbackDelay('4n', 0.1);
      
      await melodyReverb.generate();
      melodySynth.chain(melodyDelay, melodyReverb, melodyVolume, masterCompressorRef.current!);
      
      melodyLayerRef.current = {
        synth: melodySynth,
        volume: melodyVolume,
        effects: [melodyDelay, melodyReverb]
      };
    };

    initAudio();

    return () => {
      // Cleanup all layers
      padLayerRef.current?.synth.dispose();
      droneLayerRef.current?.synth.dispose();
      pulseLayerRef.current?.synth.dispose();
      textureLayerRef.current?.synth.dispose();
      melodyLayerRef.current?.synth.dispose();
      
      // Cleanup master effects
      masterCompressorRef.current?.dispose();
      masterFilterRef.current?.dispose();
      masterReverbRef.current?.dispose();
      
      // Cleanup sequences and loops
      activeSequencesRef.current.forEach(seq => seq.dispose());
      activeLoopsRef.current.forEach(loop => loop.dispose());
    };
  }, []);

  // Generate procedural soundscape with randomized elements
  const generateSoundscape = async (selectedMode: string) => {
    if (!padLayerRef.current || !droneLayerRef.current || !pulseLayerRef.current || 
        !textureLayerRef.current || !melodyLayerRef.current) return;

    console.log(`Generating layered soundscape for mode: ${selectedMode}`);

    // Stop existing sequences and loops
    activeSequencesRef.current.forEach(seq => {
      seq.stop();
      seq.dispose();
    });
    activeLoopsRef.current.forEach(loop => {
      loop.stop();
      loop.dispose();
    });
    activeSequencesRef.current = [];
    activeLoopsRef.current = [];

    const modeConfigs = {
      focus: {
        bpm: 65,
        padChords: [['C4', 'E4', 'G4', 'B4'], ['Am', 'C5', 'E5', 'G5'], ['F4', 'A4', 'C5', 'E5'], ['G4', 'B4', 'D5', 'F#5']],
        droneNotes: ['C2', 'G1'],
        pulseInterval: '2n',
        melodyScale: ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'],
        textureIntensity: 0.3,
        masterFilterFreq: 2500
      },
      relax: {
        bpm: 55,
        padChords: [['Em', 'G4', 'B4', 'D5'], ['C4', 'E4', 'G4', 'B4'], ['Am', 'C5', 'E5', 'G5'], ['D4', 'F#4', 'A4', 'C5']],
        droneNotes: ['E1', 'B1'],
        pulseInterval: '1n',
        melodyScale: ['E4', 'G4', 'B4', 'D5', 'E5', 'G5', 'B5'],
        textureIntensity: 0.2,
        masterFilterFreq: 2000
      },
      sleep: {
        bpm: 35,
        padChords: [['Am', 'C5', 'E5', 'G5'], ['F4', 'A4', 'C5', 'F5'], ['C4', 'E4', 'G4', 'C5'], ['G4', 'B4', 'D5', 'G5']],
        droneNotes: ['A0', 'E1'],
        pulseInterval: '1n.',
        melodyScale: ['A4', 'C5', 'E5', 'G5', 'A5'],
        textureIntensity: 0.15,
        masterFilterFreq: 1200
      },
      move: {
        bpm: 85,
        padChords: [['C4', 'E4', 'G4', 'C5'], ['F4', 'A4', 'C5', 'F5'], ['G4', 'B4', 'D5', 'G5'], ['Am', 'C5', 'E5', 'A5']],
        droneNotes: ['C2', 'F1', 'G1'],
        pulseInterval: '4n',
        melodyScale: ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6', 'D6'],
        textureIntensity: 0.4,
        masterFilterFreq: 3500
      },
      study: {
        bpm: 60,
        padChords: [['Dm', 'F4', 'A4', 'D5'], ['G4', 'B4', 'D5', 'G5'], ['C4', 'E4', 'G4', 'C5'], ['Am', 'C5', 'E5', 'A5']],
        droneNotes: ['D1', 'A1'],
        pulseInterval: '2n.',
        melodyScale: ['D5', 'F5', 'G5', 'A5', 'Bb5', 'C6', 'D6'],
        textureIntensity: 0.25,
        masterFilterFreq: 2200
      }
    };

    const config = modeConfigs[selectedMode as keyof typeof modeConfigs] || modeConfigs.focus;

    // Set global tempo
    Tone.Transport.bpm.value = config.bpm;

    // Configure master filter
    if (masterFilterRef.current) {
      masterFilterRef.current.frequency.rampTo(config.masterFilterFreq, 2);
    }

    // 1. Pad Layer - Slow evolving chords
    const padSequence = new Tone.Sequence(
      (time, chord) => {
        if (padLayerRef.current && isPlaying) {
          // Add slight randomization to chord timing
          const randomDelay = Math.random() * 0.1;
          (padLayerRef.current.synth as Tone.PolySynth).triggerAttackRelease(
            chord, 
            '1n', 
            time + randomDelay,
            0.6 + Math.random() * 0.2
          );
        }
      },
      config.padChords,
      '2n'
    );
    activeSequencesRef.current.push(padSequence);

    // 2. Drone Layer - Continuous foundation
    const droneLoop = new Tone.Loop((time) => {
      if (droneLayerRef.current && isPlaying) {
        const note = config.droneNotes[Math.floor(Math.random() * config.droneNotes.length)];
        (droneLayerRef.current.synth as Tone.Synth).triggerAttackRelease(
          note, 
          '4n', 
          time,
          0.3 + Math.random() * 0.1
        );
      }
    }, '1n');
    activeLoopsRef.current.push(droneLoop);

    // 3. Pulse Layer - Rhythmic heartbeat
    const pulseSequence = new Tone.Sequence(
      (time) => {
        if (pulseLayerRef.current && isPlaying && Math.random() > 0.3) {
          const frequency = 200 + Math.random() * 300;
          (pulseLayerRef.current.synth as Tone.Synth).triggerAttackRelease(
            frequency, 
            '16n', 
            time,
            0.2
          );
        }
      },
      [0, null, null, 0, null, 0, null, null], // Sparse rhythm pattern
      config.pulseInterval
    );
    activeSequencesRef.current.push(pulseSequence);

    // 4. Texture Layer - Pink noise with evolution
    const textureLoop = new Tone.Loop((time) => {
      if (textureLayerRef.current && isPlaying) {
        const noise = textureLayerRef.current.synth as Tone.Noise;
        if (noise.state !== 'started') {
          noise.start(time);
        }
        
        // Modulate filter frequency over time
        const filterEffect = textureLayerRef.current.effects[0] as Tone.Filter;
        const newFreq = 800 + Math.sin(time * 0.1) * 400 + Math.random() * 200;
        filterEffect.frequency.setValueAtTime(newFreq, time);
      }
    }, '4n');
    activeLoopsRef.current.push(textureLoop);

    // 5. Melody Layer - Sparse, evolving phrases
    const melodySequence = new Tone.Sequence(
      (time, note) => {
        if (melodyLayerRef.current && isPlaying && Math.random() > 0.6) {
          const randomNote = config.melodyScale[Math.floor(Math.random() * config.melodyScale.length)];
          (melodyLayerRef.current.synth as Tone.Synth).triggerAttackRelease(
            randomNote, 
            '8n', 
            time + Math.random() * 0.05,
            0.3 + Math.random() * 0.2
          );
        }
      },
      [null, null, 0, null, null, null, 0, null], // Very sparse pattern
      '4n'
    );
    activeSequencesRef.current.push(melodySequence);

    // Adjust layer volumes based on mode
    const volumeConfigs = {
      focus: { pad: -12, drone: -22, pulse: -25, texture: -30, melody: -18 },
      relax: { pad: -10, drone: -18, pulse: -28, texture: -26, melody: -20 },
      sleep: { pad: -8, drone: -15, pulse: -32, texture: -24, melody: -25 },
      move: { pad: -15, drone: -20, pulse: -20, texture: -28, melody: -16 },
      study: { pad: -11, drone: -19, pulse: -26, texture: -29, melody: -17 }
    };

    const volumes = volumeConfigs[selectedMode as keyof typeof volumeConfigs] || volumeConfigs.focus;
    
    padLayerRef.current.volume.volume.rampTo(volumes.pad, 1);
    droneLayerRef.current.volume.volume.rampTo(volumes.drone, 1);
    pulseLayerRef.current.volume.volume.rampTo(volumes.pulse, 1);
    textureLayerRef.current.volume.volume.rampTo(volumes.texture, 1);
    melodyLayerRef.current.volume.volume.rampTo(volumes.melody, 1);
  };

  // Handle play/pause with layered system
  useEffect(() => {
    const handlePlayback = async () => {
      try {
        if (isPlaying) {
          console.log('Starting layered ambient playback...');
          
          // Start Tone.js context
          if (Tone.context.state !== 'running') {
            await Tone.start();
            console.log('Tone.js context started');
          }

          // Generate procedural soundscape
          await generateSoundscape(mode);

          // Start transport and all sequences/loops
          Tone.Transport.start();
          
          activeSequencesRef.current.forEach((sequence, index) => {
            sequence.start(index * 0.5); // Stagger starts slightly
          });
          
          activeLoopsRef.current.forEach((loop, index) => {
            loop.start(index * 0.25);
          });

          console.log('Layered ambient playback started successfully');
        } else {
          console.log('Stopping layered ambient playback...');
          
          // Stop all sequences and loops
          activeSequencesRef.current.forEach(sequence => {
            sequence.stop();
          });
          
          activeLoopsRef.current.forEach(loop => {
            loop.stop();
          });
          
          // Stop texture noise if playing
          if (textureLayerRef.current?.synth instanceof Tone.Noise) {
            textureLayerRef.current.synth.stop();
          }
          
          Tone.Transport.stop();
          console.log('Layered ambient playback stopped');
        }
      } catch (error) {
        console.error('Error in layered ambient playback:', error);
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