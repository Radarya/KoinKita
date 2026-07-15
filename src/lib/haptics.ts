import { getAudioMode } from './audio';

const canVibrate = (): boolean => {
  return getAudioMode() !== 3;
};

const doVibrate = (pattern: number | number[]) => {
  if (!canVibrate()) return;
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch (e) {}
};

// Durasi dinaikkan signifikan agar motor LED trigger punya waktu untuk bereaksi
export const vibrateLight   = () => doVibrate(80);       // sebelumnya 25ms
export const vibrateMedium  = () => doVibrate(150);      // sebelumnya 60ms
export const vibrateHeavy   = () => doVibrate(300);      // sebelumnya 120ms
export const vibrateSuccess = () => doVibrate([100, 50, 150, 50, 200]); // pola panjang
export const vibrateError   = () => doVibrate([200, 80, 200]);          // pola kasar
export const vibrateWarning = () => doVibrate([100, 60, 100]);
