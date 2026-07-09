export let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const getAudioMode = (): number => {
  if (typeof window === 'undefined') return 1;
  const saved = localStorage.getItem('audioMode');
  if (saved !== null) {
    const parsed = parseInt(saved, 10);
    return isNaN(parsed) ? 1 : parsed;
  }
  return 1;
};

export const setAudioMode = (mode: number) => {
  localStorage.setItem('audioMode', mode.toString());
  updateBgmStateFromMode();
};

const playTone = (freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
  const mode = getAudioMode();
  if (mode === 3) return; // Senyap

  try {
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Audio error:", e);
  }
};

export const playClick = () => {
  const mode = getAudioMode();
  if (mode === 3) return;
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.1);
  } catch(e) {}
};

export const playCorrect = () => {
  const mode = getAudioMode();
  if (mode === 3) return;

  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, now); // E5
    osc.frequency.setValueAtTime(880.00, now + 0.1); // A5
    
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {}
};

export const playWrong = () => {
  const mode = getAudioMode();
  if (mode === 3) return;
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.3);
  } catch(e) {}
};

export const playWin = () => {
  const mode = getAudioMode();
  if (mode === 3) return;

  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.3); // G5
    osc.frequency.setValueAtTime(1046.50, now + 0.45); // C6
    
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.45);
    gainNode.gain.linearRampToValueAtTime(0, now + 1.0);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 1.0);
  } catch (e) {}
};

export const playLose = () => {
  const mode = getAudioMode();
  if (mode === 3) return;
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(392.00, now); // G4
    osc.frequency.setValueAtTime(311.13, now + 0.2); // D#4
    osc.frequency.setValueAtTime(261.63, now + 0.4); // C4
    osc.frequency.setValueAtTime(196.00, now + 0.6); // G3
    
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 1.2);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 1.2);
  } catch(e) {}
};

export const playCoin = () => {
  const mode = getAudioMode();
  if (mode === 3) return;
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.50, now); // C6
    osc.frequency.setValueAtTime(1318.51, now + 0.1); // E6
    
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.3);
  } catch(e) {}
};


// ==========================================
// BACKGROUND MUSIC (BGM) PLATFORM UPGRADE
// ==========================================

export const TRACKS: Record<string, string> = {
  landing: 'https://raw.githubusercontent.com/Radarya/KoinKita/main/public/audio/Akustik.mp3',
  dashboard: 'https://raw.githubusercontent.com/Radarya/KoinKita/main/public/audio/Akustik.mp3',
  'detektif-cuan': 'https://raw.githubusercontent.com/Radarya/KoinKita/main/public/audio/Mystery.mp3',
  'koki-anggaran': 'https://raw.githubusercontent.com/Radarya/KoinKita/main/public/audio/Jazz.mp3',
  'tebak-kata': 'https://raw.githubusercontent.com/Radarya/KoinKita/main/public/audio/Retro.mp3',
  'pohon-aset': 'https://raw.githubusercontent.com/Radarya/KoinKita/main/public/audio/Synthpop.mp3'
};

let bgmAudio: HTMLAudioElement | null = null;
let currentTrackKey: string = 'landing';
let fadeInterval: any = null;

export const getBgmVolume = (): number => {
  if (typeof window === 'undefined') return 0.5;
  const saved = localStorage.getItem('volume');
  if (saved !== null) {
    const parsed = parseFloat(saved);
    return isNaN(parsed) ? 0.5 : parsed;
  }
  return 0.5;
};

export const initBgm = () => {
  if (typeof window === 'undefined') return;
  if (!bgmAudio) {
    bgmAudio = new Audio();
    bgmAudio.src = TRACKS[currentTrackKey];
    bgmAudio.volume = 0; // Start at 0 for fade in
    bgmAudio.loop = true;
  }
};

const fadeAudio = (targetVolume: number, durationMs: number = 500) => {
  if (!bgmAudio) return;
  if (fadeInterval) clearInterval(fadeInterval);

  const steps = 20;
  const stepTime = durationMs / steps;
  const currentVol = bgmAudio.volume;
  const diff = targetVolume - currentVol;
  const volStep = diff / steps;

  let stepCount = 0;
  
  if (targetVolume > 0 && bgmAudio.paused) {
    bgmAudio.play().catch(() => setupBypassListeners());
  }

  fadeInterval = setInterval(() => {
    if (!bgmAudio) {
      clearInterval(fadeInterval);
      return;
    }
    stepCount++;
    const newVol = currentVol + (volStep * stepCount);
    
    bgmAudio.volume = Math.max(0, Math.min(1, newVol));

    if (stepCount >= steps) {
      clearInterval(fadeInterval);
      bgmAudio.volume = Math.max(0, Math.min(1, targetVolume));
      if (targetVolume === 0) {
        bgmAudio.pause();
      }
    }
  }, stepTime);
};

export const updateBgmStateFromMode = () => {
  initBgm();
  const mode = getAudioMode();
  const targetVolume = (mode === 1 && !gamePaused) ? getBgmVolume() : (mode === 1 && gamePaused) ? getBgmVolume() * 0.3 : 0;
  fadeAudio(targetVolume);
};

export const setBgmVolume = (vol: number) => {
  const sanitizedVolume = Math.max(0, Math.min(1, vol));
  localStorage.setItem('volume', sanitizedVolume.toFixed(2));
  updateBgmStateFromMode();
};

export const setGameViewTrack = (viewKey: string) => {
  if (!TRACKS[viewKey]) return;
  if (currentTrackKey === viewKey && bgmAudio && !bgmAudio.paused) return;

  initBgm();
  
  if (bgmAudio) {
    // Fade out current, then swap
    fadeAudio(0, 1000); // 1 second fade out
    setTimeout(() => {
      if (bgmAudio && currentTrackKey !== viewKey) {
        currentTrackKey = viewKey;
        bgmAudio.src = TRACKS[viewKey];
        bgmAudio.load();
        const mode = getAudioMode();
        if (mode === 1) {
          bgmAudio.play().then(() => {
             fadeAudio(gamePaused ? getBgmVolume() * 0.3 : getBgmVolume(), 1500); // 1.5 seconds fade in
          }).catch(() => setupBypassListeners());
        }
      } else if (bgmAudio && currentTrackKey === viewKey) {
        const mode = getAudioMode();
        if (mode === 1) fadeAudio(gamePaused ? getBgmVolume() * 0.3 : getBgmVolume(), 1500);
      }
    }, 1050); // wait for fade out to complete plus a tiny delay
  } else {
    currentTrackKey = viewKey;
  }
};

let gamePaused = false;
let pauseSubscribers = new Set<(isPaused: boolean) => void>();
export const subscribeToPause = (cb: (isPaused: boolean) => void) => {
  pauseSubscribers.add(cb);
  return () => { pauseSubscribers.delete(cb); };
};

export const setGamePaused = (isPaused: boolean) => {
  if (gamePaused === isPaused) return;
  gamePaused = isPaused;
  pauseSubscribers.forEach(cb => cb(isPaused));

  initBgm();
  const mode = getAudioMode();
  if (mode === 1) {
    const defaultVol = getBgmVolume();
    fadeAudio(isPaused ? defaultVol * 0.3 : defaultVol, 300); // 30% vol if paused
  } else if (mode === 0) {
    fadeAudio(0, 300);
  }
};

let bypassInteractionsRegistered = false;
const triggerPlayOnInteraction = () => {
  updateBgmStateFromMode();
  removeBypassListeners();
};

const setupBypassListeners = () => {
  if (bypassInteractionsRegistered) return;
  bypassInteractionsRegistered = true;
  window.addEventListener('click', triggerPlayOnInteraction, { once: true });
  window.addEventListener('keydown', triggerPlayOnInteraction, { once: true });
  window.addEventListener('touchstart', triggerPlayOnInteraction, { once: true });
};

const removeBypassListeners = () => {
  window.removeEventListener('click', triggerPlayOnInteraction);
  window.removeEventListener('keydown', triggerPlayOnInteraction);
  window.removeEventListener('touchstart', triggerPlayOnInteraction);
  bypassInteractionsRegistered = false;
};

export const bypassAutoplay = () => {
  initAudio();
  triggerPlayOnInteraction();
};
