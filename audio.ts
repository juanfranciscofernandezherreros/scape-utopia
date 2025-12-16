

// Web Audio API Procedural Engine
// Generates immersive audio without external assets

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

// Track active nodes for cleanup
let activeNodes: AudioNode[] = [];
let backgroundGain: GainNode | null = null;
// Track intervals for rhythmic music
let rhythmInterval: number | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    const CtxClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new CtxClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.4;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const setMute = (muted: boolean) => {
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(muted ? 0 : 0.4, audioCtx.currentTime);
  }
};

// --- TTS NARRATION SYSTEM ---

const duckMusic = (duck: boolean) => {
    if (!masterGain || !audioCtx) return;
    const target = duck ? 0.1 : 0.4;
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(target, audioCtx.currentTime + 1);
};

export const speak = (text: string, type: 'system' | 'narrator' = 'system') => {
    // Basic browser support check
    if (!('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get all available voices
    const voices = window.speechSynthesis.getVoices();
    // Filter for Spanish voices
    const esVoices = voices.filter(v => v.lang.startsWith('es'));
    
    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (type === 'narrator') {
        // --- AGGRESSIVE FEMALE VOICE SELECTION ---
        // List of common female voice identifiers across Windows, macOS, Android, iOS
        const femaleIdentifiers = [
            'google español', // Usually female on Android/Chrome
            'monica', 'paulina', 'rosa', // Windows / Chrome OS
            'helena', 'laura', 'sabina', // macOS / iOS
            'samantha', 'marta', // macOS / iOS
            'sofia', 'carmen', // Android
            'ana', 'mariana', // Misc
            'spain - female', 'mexico - female' // Generic
        ];
        
        // 1. Try to find an exact match in Spanish voices
        selectedVoice = esVoices.find(v => 
            femaleIdentifiers.some(id => v.name.toLowerCase().includes(id))
        );

        // 2. If no Spanish female voice found, try to find ANY voice with 'female' in the name (rare fallback)
        if (!selectedVoice) {
             selectedVoice = esVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('mujer'));
        }
        
        // 3. Last resort: just take the first Spanish voice (often the high quality default is female)
        if (!selectedVoice) selectedVoice = esVoices[0];

        // Settings for "Sweet Doctor"
        // If we suspect it might be a generic/male voice fallback, we pitch up slightly more
        utterance.pitch = 1.3; 
        utterance.rate = 0.95;  // Calm and collected
        utterance.volume = 1.0;

    } else {
        // System / Dark AI
        // Look for male-sounding or robotic names if possible to contrast
        const systemIdentifiers = ['pablo', 'jorge', 'juan', 'diego', 'carlos', 'microsoft', 'android'];
        selectedVoice = esVoices.find(v => systemIdentifiers.some(id => v.name.toLowerCase().includes(id)));
        
        if (!selectedVoice) selectedVoice = esVoices[0];

        utterance.pitch = 0.6; // Lower, serious
        utterance.rate = 0.9;  // Slower, clinical
        utterance.volume = 1.0;
    }

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    // Audio Ducking (Lower music volume while speaking)
    utterance.onstart = () => duckMusic(true);
    utterance.onend = () => duckMusic(false);
    utterance.onerror = () => duckMusic(false);

    window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        duckMusic(false);
    }
};


const stopCurrentAmbience = () => {
  // Clear rhythm intervals if any
  if (rhythmInterval) {
      clearInterval(rhythmInterval);
      rhythmInterval = null;
  }

  if (backgroundGain && audioCtx) {
    const fadeOutTime = 1.5;
    backgroundGain.gain.cancelScheduledValues(audioCtx.currentTime);
    backgroundGain.gain.setValueAtTime(backgroundGain.gain.value, audioCtx.currentTime);
    backgroundGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + fadeOutTime);
    
    const nodesToStop = [...activeNodes];
    activeNodes = [];
    
    setTimeout(() => {
        nodesToStop.forEach(node => {
            try {
                if (node instanceof OscillatorNode) node.stop();
                node.disconnect();
            } catch (e) {}
        });
    }, fadeOutTime * 1000 + 100);
    
    backgroundGain = null;
  }
};

// --- SCENE 0: FUN CINEMA (Ragtime Style) ---
export const startCinemaAmbience = () => {
    if (!audioCtx || !masterGain) return;
    stopCurrentAmbience();
  
    backgroundGain = audioCtx.createGain();
    backgroundGain.connect(masterGain);
    backgroundGain.gain.value = 0.3;
  
    // Simple Ragtime/Vaudeville progression notes (C Major swing)
    const bassLine = [130.81, 196.00, 146.83, 196.00]; // C3, G3, D3, G3
    const melodyLine = [523.25, 659.25, 783.99, 880.00, 783.99, 659.25, 523.25, 392.00]; // C5 scale run
    
    let beat = 0;
  
    // We use setInterval for the rhythm to keep it simple (though timing can drift slightly)
    // 250ms = 240 BPM (Fast & Fun)
    rhythmInterval = window.setInterval(() => {
        if (!audioCtx || !backgroundGain) return;
        const t = audioCtx.currentTime;
  
        // 1. Bass (Left Hand) - Square wave for "Player Piano" feel
        const bassOsc = audioCtx.createOscillator();
        const bassGain = audioCtx.createGain();
        bassOsc.type = 'square';
        bassOsc.frequency.value = bassLine[beat % 4];
        
        bassGain.gain.setValueAtTime(0.2, t);
        bassGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2); // Staccato
        
        bassOsc.connect(bassGain);
        bassGain.connect(backgroundGain);
        bassOsc.start(t);
        bassOsc.stop(t + 0.25);
  
        // 2. Melody (Right Hand) - Triangle for brightness
        if (beat % 2 === 0) { // Play melody every other bass beat
            const melOsc = audioCtx.createOscillator();
            const melGain = audioCtx.createGain();
            melOsc.type = 'triangle';
            // Detune slightly for "Old Saloon" vibe
            melOsc.detune.value = Math.random() * 10 - 5; 
            melOsc.frequency.value = melodyLine[(beat / 2) % 8];
            
            melGain.gain.setValueAtTime(0.15, t);
            melGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
            
            melOsc.connect(melGain);
            melGain.connect(backgroundGain);
            melOsc.start(t);
            melOsc.stop(t + 0.3);
        }

        beat++;
    }, 250);
};

// --- SCENE 1: INNOCENT LULLABY ---
export const startHappyAmbience = () => {
  if (!audioCtx || !masterGain) return;
  stopCurrentAmbience();

  backgroundGain = audioCtx.createGain();
  backgroundGain.connect(masterGain);
  backgroundGain.gain.value = 0;
  backgroundGain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 2);

  // Major Chord Pad (Cmaj7)
  const freqs = [261.63, 329.63, 392.00, 493.88]; // C4, E4, G4, B4
  
  freqs.forEach((f, i) => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = f;
    
    // Slight detune for "chorus" effect (warmth)
    osc.detune.value = (Math.random() * 10) - 5;

    const oscGain = audioCtx.createGain();
    oscGain.gain.value = 0.1 / freqs.length;
    
    // Slow LFO for gentle movement (breathing effect)
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = 0.2 + (Math.random() * 0.2);
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.05;
    lfo.connect(oscGain.gain);

    osc.connect(oscGain);
    oscGain.connect(backgroundGain!);
    
    osc.start();
    lfo.start();
    
    activeNodes.push(osc, oscGain, lfo, lfoGain);
  });
};

// --- SCENE TRANSITION: SIREN ---
export const startSiren = () => {
  if (!audioCtx || !masterGain) return;
  stopCurrentAmbience();

  backgroundGain = audioCtx.createGain();
  backgroundGain.connect(masterGain);
  backgroundGain.gain.value = 0.35; // Loud but not clipping

  // 1. Main Siren Oscillator (Sawtooth for harshness)
  const osc = audioCtx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = 600; // Base freq

  // 2. LFO for the "Whoop Whoop" sweep
  const lfo = audioCtx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 1.5; // Siren speed (Hz)

  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 300; // Sweep range (+/- 300Hz)

  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  osc.connect(backgroundGain);

  osc.start();
  lfo.start();

  // 3. Underlying tension rumble
  const sub = audioCtx.createOscillator();
  sub.type = 'square';
  sub.frequency.value = 50;
  const subGain = audioCtx.createGain();
  subGain.gain.value = 0.2;
  sub.connect(subGain);
  subGain.connect(backgroundGain);
  sub.start();

  activeNodes.push(osc, lfo, lfoGain, sub, subGain);
};

// --- SCENE 2+: HORROR DRONE ---
export const startHorrorAmbience = () => {
  if (!audioCtx || !masterGain) return;
  stopCurrentAmbience();

  backgroundGain = audioCtx.createGain();
  backgroundGain.connect(masterGain);
  backgroundGain.gain.value = 0;
  backgroundGain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 4); // Slow creepy fade in

  // 1. Sub Bass (The "Dread" frequency)
  const sub = audioCtx.createOscillator();
  sub.type = 'sine';
  sub.frequency.value = 45; // Low rumble
  const subGain = audioCtx.createGain();
  subGain.gain.value = 0.6;
  sub.connect(subGain);
  subGain.connect(backgroundGain);
  sub.start();

  // 2. Dissonant Metallic Drone
  const drone = audioCtx.createOscillator();
  drone.type = 'sawtooth';
  drone.frequency.value = 65; // Clashing low note
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 150;
  filter.Q.value = 5;

  // LFO to modulate filter (making it "alive")
  const lfo = audioCtx.createOscillator();
  lfo.type = 'triangle';
  lfo.frequency.value = 0.1; // Very slow
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 100;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  drone.connect(filter);
  filter.connect(backgroundGain);
  drone.start();

  // 3. Unsettling High Pitch (Tinnitus effect)
  const high = audioCtx.createOscillator();
  high.frequency.value = 12000;
  const highGain = audioCtx.createGain();
  highGain.gain.value = 0.02; // Very quiet but present
  high.connect(highGain);
  highGain.connect(backgroundGain);
  high.start();

  activeNodes.push(sub, subGain, drone, filter, lfo, lfoGain, high, highGain);
};

export const stopAmbience = () => {
    stopCurrentAmbience();
};

// --- SFX ---

export const playCorrectTone = (isHappy: boolean) => {
  if (!audioCtx || !masterGain) return;
  const t = audioCtx.currentTime;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(masterGain);

  if (isHappy) {
      // Pleasant chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, t); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, t + 0.1); // C6
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.4, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
  } else {
      // System success beep
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.setValueAtTime(1760, t + 0.1);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
  }
  
  osc.start();
  osc.stop(t + 0.5);
};

export const playErrorTone = (isHappy: boolean) => {
  if (!audioCtx || !masterGain) return;
  const t = audioCtx.currentTime;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(masterGain);

  if (isHappy) {
      // Cartoonish error
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.linearRampToValueAtTime(100, t + 0.3);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.3);
  } else {
      // Harsh digital glitch
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(50, t);
      // FM Synthesis for noise
      const mod = audioCtx.createOscillator();
      mod.frequency.value = 500;
      const modGain = audioCtx.createGain();
      modGain.gain.value = 1000;
      mod.connect(modGain);
      modGain.connect(osc.frequency);
      mod.start();
      
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
      mod.stop(t + 0.4);
  }

  osc.start();
  osc.stop(t + 0.4);
};

export const playGlitchBurst = () => {
    if (!audioCtx || !masterGain) return;
    const t = audioCtx.currentTime;
    
    // White noise burst
    const bufferSize = audioCtx.sampleRate * 0.2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000 + Math.random() * 2000;
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    noise.start();
};

export const playClickSound = () => {
  if (!audioCtx || !masterGain) return;
  const t = audioCtx.currentTime;
  
  // Short high pitched blip for UI interaction
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
  
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.1, t);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
  
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start();
  osc.stop(t + 0.05);
};
