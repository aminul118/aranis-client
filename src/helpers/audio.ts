/**
 * Plays a premium, synthesized dual-tone electronic chime using Web Audio API.
 * This is 100% self-contained and does not load any external asset files,
 * ensuring high reliability and instant playback.
 */
export const playNotificationSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Play a premium dual-tone chime:
    // First tone: 660Hz (E5) decay over 0.4s
    // Second tone: 990Hz (B5) starting after 80ms, decaying over 0.5s
    const playTone = (freq: number, startOffset: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);

      // Smooth attack and exponential decay envelope
      gainNode.gain.setValueAtTime(0, ctx.currentTime + startOffset);
      gainNode.gain.linearRampToValueAtTime(
        0.08,
        ctx.currentTime + startOffset + 0.04,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + startOffset + duration,
      );

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime + startOffset);
      osc.stop(ctx.currentTime + startOffset + duration);
    };

    playTone(660, 0, 0.4);
    playTone(990, 0.08, 0.5);
  } catch (error) {
    console.warn('Web Audio notification sound could not play:', error);
  }
};
