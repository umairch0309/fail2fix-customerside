// Notification sound utility using Web Audio API
// Creates beautiful, modern notification sounds programmatically

type SoundType = "message" | "success" | "error" | "warning" | "info" | "request";

let audioContext: AudioContext | null = null;
let audioContextReady = false;

async function getAudioContext(): Promise<AudioContext | null> {
  if (typeof window === "undefined") return null;

  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }

  // Resume if suspended (required by browser autoplay policies)
  if (audioContext.state === "suspended") {
    try {
      await audioContext.resume();
      audioContextReady = true;
    } catch {
      console.warn("Failed to resume audio context");
      return null;
    }
  } else if (audioContext.state === "running") {
    audioContextReady = true;
  }

  return audioContext;
}

// Initialize audio context on first user interaction
function initAudioOnInteraction() {
  if (typeof window === "undefined") return;

  const initAudio = async () => {
    await getAudioContext();
    // Remove listeners after first interaction
    window.removeEventListener("click", initAudio);
    window.removeEventListener("keydown", initAudio);
    window.removeEventListener("touchstart", initAudio);
  };

  window.addEventListener("click", initAudio);
  window.addEventListener("keydown", initAudio);
  window.addEventListener("touchstart", initAudio);
}

// Auto-init on module load
if (typeof window !== "undefined") {
  initAudioOnInteraction();
}

// Modern notification sound - pleasant two-tone chime
function playMessageSound(ctx: AudioContext) {
  const now = ctx.currentTime;

  // First tone
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.frequency.value = 830; // G#5
  osc1.type = "sine";
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.3, now + 0.02);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
  osc1.start(now);
  osc1.stop(now + 0.3);

  // Second tone (higher, slight delay)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.frequency.value = 1046; // C6
  osc2.type = "sine";
  gain2.gain.setValueAtTime(0, now + 0.08);
  gain2.gain.linearRampToValueAtTime(0.25, now + 0.1);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
  osc2.start(now + 0.08);
  osc2.stop(now + 0.4);
}

// Success sound - ascending pleasant chime
function playSuccessSound(ctx: AudioContext) {
  const now = ctx.currentTime;
  const notes = [523, 659, 784]; // C5, E5, G5 - major chord arpeggio

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    const startTime = now + i * 0.08;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);
    osc.start(startTime);
    osc.stop(startTime + 0.25);
  });
}

// Error sound - low descending tone
function playErrorSound(ctx: AudioContext) {
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
  osc.type = "sine";
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
  osc.start(now);
  osc.stop(now + 0.2);

  // Second descending tone
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.frequency.setValueAtTime(350, now + 0.12);
  osc2.frequency.exponentialRampToValueAtTime(180, now + 0.27);
  osc2.type = "sine";
  gain2.gain.setValueAtTime(0, now + 0.12);
  gain2.gain.linearRampToValueAtTime(0.2, now + 0.14);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
  osc2.start(now + 0.12);
  osc2.stop(now + 0.32);
}

// Warning sound - attention-grabbing double beep
function playWarningSound(ctx: AudioContext) {
  const now = ctx.currentTime;

  [0, 0.15].forEach((delay) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880; // A5
    osc.type = "sine";
    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(0.2, now + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.1);
    osc.start(now + delay);
    osc.stop(now + delay + 0.1);
  });
}

// Info sound - soft single tone
function playInfoSound(ctx: AudioContext) {
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 600;
  osc.type = "sine";
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
  osc.start(now);
  osc.stop(now + 0.2);
}

// Request sound - gentle, pleasant notification chime (like iOS/macOS)
function playRequestSound(ctx: AudioContext) {
  const now = ctx.currentTime;

  // Create a soft, warm marimba-like tone
  const playTone = (freq: number, startTime: number, duration: number, volume: number) => {
    // Main tone
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Add a subtle filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2000;
    filter.Q.value = 1;

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.frequency.value = freq;
    osc.type = "sine";

    // Soft attack, gentle decay (like a soft mallet hit)
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(volume * 0.3, startTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration);

    // Add subtle harmonic for richness
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = freq * 2;
    osc2.type = "sine";
    gain2.gain.setValueAtTime(0, startTime);
    gain2.gain.linearRampToValueAtTime(volume * 0.15, startTime + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.6);
    osc2.start(startTime);
    osc2.stop(startTime + duration * 0.6);
  };

  // Pleasant ascending two-note chime (like a gentle doorbell)
  // Using notes from C major pentatonic for a warm, friendly feel
  playTone(523.25, now, 0.4, 0.18);          // C5 - first note
  playTone(659.25, now + 0.12, 0.5, 0.15);   // E5 - second note (major third up)
}

export async function playNotificationSound(type: SoundType = "message") {
  const ctx = await getAudioContext();
  if (!ctx) return;

  switch (type) {
    case "message":
      playMessageSound(ctx);
      break;
    case "success":
      playSuccessSound(ctx);
      break;
    case "error":
      playErrorSound(ctx);
      break;
    case "warning":
      playWarningSound(ctx);
      break;
    case "info":
      playInfoSound(ctx);
      break;
    case "request":
      playRequestSound(ctx);
      break;
    default:
      playMessageSound(ctx);
  }
}

// Utility to check if sound is enabled
export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return true;
}
