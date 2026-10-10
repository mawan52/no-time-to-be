// Atmospheric Web Audio API Synthesizer for "No Time To Be"

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.droneOsc = null;
    this.droneGain = null;
    this.heartbeatInterval = null;
    this.isMuted = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Soft notification ping / alarm
  playPing(freq = 880, duration = 0.2, type = "sine", vol = 0.15) {
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn(e);
    }
  }

  // Distorted static / glitch crunch sound
  playGlitch(intensity = 1.0) {
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.1 * intensity;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1000 + Math.random() * 3000;
      filter.Q.value = 3;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08 * intensity, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1 * intensity);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch (e) {
      console.warn(e);
    }
  }

  // Glass shatter / boundary enforcement sound (Satisfying & Empowering)
  playGlassShatter() {
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const freqs = [1200, 1800, 2400, 3200];
      freqs.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(f * 0.2, this.ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // Sub bass heartbeat thud (LUB-DUB)
  playHeartbeat() {
    this.ensureContext();
    if (!this.ctx) return;

    try {
      // First thud (Lub)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(75, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.12);

      gain1.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start();
      osc1.stop(this.ctx.currentTime + 0.15);

      // Second thud (Dub) - 140ms later
      setTimeout(() => {
        if (!this.ctx) return;
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(65, this.ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.14);

        gain2.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start();
        osc2.stop(this.ctx.currentTime + 0.16);
      }, 140);
    } catch (e) {
      console.warn(e);
    }
  }

  // Dissonant screech stinger for climax / jumpscare moments
  playStinger() {
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const freqs = [300, 311.13, 440, 466.16, 600]; // Dissonant cluster
      freqs.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(f * (Math.random() > 0.5 ? 1.2 : 0.8), this.ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.6);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // Starts or updates ambient hum according to current day anxiety level (0 to 1)
  setAmbientLevel(anxietyLevel = 0) {
    this.ensureContext();
    if (!this.ctx) return;

    if (anxietyLevel <= 0) {
      if (this.droneOsc) {
        try {
          this.droneOsc.stop();
        } catch (e) {}
        this.droneOsc = null;
      }
      return;
    }

    const targetFreq = 55 + anxietyLevel * 70; // 55Hz to 125Hz hum
    const targetGain = Math.min(0.12, 0.02 + anxietyLevel * 0.08);

    if (!this.droneOsc) {
      try {
        this.droneOsc = this.ctx.createOscillator();
        this.droneGain = this.ctx.createGain();

        this.droneOsc.type = anxietyLevel > 0.6 ? "sawtooth" : "sine";
        this.droneOsc.frequency.setValueAtTime(targetFreq, this.ctx.currentTime);
        this.droneGain.gain.setValueAtTime(targetGain, this.ctx.currentTime);

        this.droneOsc.connect(this.droneGain);
        this.droneGain.connect(this.ctx.destination);
        this.droneOsc.start();
      } catch (e) {
        console.warn(e);
      }
    } else {
      try {
        this.droneOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.5);
        this.droneGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.5);
      } catch (e) {}
    }
  }

  startHeartbeatLoop(intervalMs = 1000) {
    this.stopHeartbeatLoop();
    this.playHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.playHeartbeat();
    }, intervalMs);
  }

  stopHeartbeatLoop() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  stopAll() {
    this.stopHeartbeatLoop();
    if (this.droneOsc) {
      try {
        this.droneOsc.stop();
      } catch (e) {}
      this.droneOsc = null;
    }
  }
}

const audioEngine = new SoundEngine();
export default audioEngine;
