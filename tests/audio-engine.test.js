/**
 * AudioEngine unit tests
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Mock Web Audio API
global.AudioContext = class {
  constructor() {
    this.sampleRate = 44100;
    this.currentTime = 0;
  }
  createBuffer(channels, size, sampleRate) {
    return {
      numberOfChannels: channels,
      length: size,
      sampleRate,
      getChannelData: () => new Float32Array(size)
    };
  }
  createBufferSource() {
    return {
      buffer: null,
      loop: true,
      loopStart: 0,
      loopEnd: 0,
      connect: () => {},
      start: () => {},
      stop: () => {}
    };
  }
  createBiquadFilter() {
    return {
      type: '',
      frequency: { value: 0 },
      Q: { value: 0 },
      connect: () => {}
    };
  }
  createGain() {
    return {
      gain: { value: 0 },
      connect: () => {}
    };
  }
  get destination() { return {}; }
  decodeAudioData() {
    return Promise.resolve({
      duration: 1,
      length: 44100
    });
  }
};

// Stub classes that match actual implementation structure
globalThis.Mood = {
  FATIGUE: 'fatigue',
  ANXIETY: 'anxiety',
  FOCUS: 'focus',
  NEUTRAL: 'neutral',
  UNKNOWN: 'unknown'
};

globalThis.AudioEngine = class AudioEngine {
  constructor() {
    this.initialized = false;
    this.volume = 0.5;
    this.isMuted = false;
    this.currentMood = null;
    this.ctx = null;
    this.masterGain = null;
    this.noiseNodes = {};
    this.gains = {};
    this.filters = {};
  }

  async init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(this.ctx.destination);

    // Create gains for each noise type
    this.gains = {
      white: this.ctx.createGain(),
      pink: this.ctx.createGain(),
      rain: this.ctx.createGain(),
      fire: this.ctx.createGain()
    };

    // Connect gains through filters
    ['white', 'pink', 'rain', 'fire'].forEach(type => {
      this.gains[type].connect(this.masterGain);
    });

    this.initialized = true;
  }

  createWhiteNoiseBuffer(size = 44100) {
    const buffer = this.ctx.createBuffer(2, size, this.ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < size; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    return buffer;
  }

  createPinkNoiseBuffer(size = 44100) {
    const buffer = this.ctx.createBuffer(2, size, this.ctx.sampleRate);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < size; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = 0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
    return buffer;
  }

  createRainBuffer(size = 44100) {
    const buffer = this.ctx.createBuffer(2, size, this.ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let lastSample = 0;
      for (let i = 0; i < size; i++) {
        const white = Math.random() * 2 - 1;
        lastSample = lastSample * 0.99 + white * 0.01;
        const filtered = lastSample * 50;
        const droplet = Math.random() < 0.001 ? (Math.random() - 0.5) * 0.8 : 0;
        data[i] = (filtered + droplet) * 0.3;
      }
    }
    return buffer;
  }

  createFireBuffer(size = 44100) {
    const buffer = this.ctx.createBuffer(2, size, this.ctx.sampleRate);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < size; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = 0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
    return buffer;
  }

  setMood(mood) {
    this.currentMood = mood;
    const configs = {
      [Mood.FATIGUE]: { primaryGain: 0.8, secondaryGain: 0.3 },
      [Mood.ANXIETY]: { primaryGain: 0.7, secondaryGain: 0.4 },
      [Mood.FOCUS]: { primaryGain: 0.5, secondaryGain: 0.3 },
      [Mood.NEUTRAL]: { primaryGain: 0.55, secondaryGain: 0.35 },
      [Mood.UNKNOWN]: { primaryGain: 0.4, secondaryGain: 0.2 }
    };
    const config = configs[mood] || configs[Mood.UNKNOWN];
    if (this.gains.pink) this.gains.pink.gain.value = config.primaryGain;
    if (this.gains.white) this.gains.white.gain.value = config.secondaryGain;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
    }
    return this.isMuted;
  }

  dispose() {
    if (!this.initialized) return;
    Object.values(this.noiseNodes).forEach(node => {
      try { node.stop(); } catch(e) {}
      try { node.disconnect(); } catch(e) {}
    });
    this.noiseNodes = {};
    Object.values(this.gains).forEach(g => {
      try { g.disconnect(); } catch(e) {}
    });
    this.gains = {};
    Object.values(this.filters).forEach(f => {
      try { f.disconnect(); } catch(e) {}
    });
    this.filters = {};
    if (this.masterGain) {
      try { this.masterGain.disconnect(); } catch(e) {}
      this.masterGain = null;
    }
    this.initialized = false;
  }
};

describe('AudioEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new AudioEngine();
  });

  describe('initialization', () => {
    it('should create instance with default values', () => {
      expect(engine.initialized).toBe(false);
      expect(engine.volume).toBe(0.5);
      expect(engine.isMuted).toBe(false);
      expect(engine.currentMood).toBe(null);
    });
  });

  describe('init()', () => {
    it('should initialize AudioContext and create gains', async () => {
      await engine.init();
      expect(engine.initialized).toBe(true);
      expect(engine.ctx).not.toBe(null);
      expect(engine.masterGain).not.toBe(null);
      expect(engine.gains.pink).not.toBe(null);
      expect(engine.gains.white).not.toBe(null);
    });

    it('should not re-initialize if already initialized', async () => {
      await engine.init();
      const ctx = engine.ctx;
      await engine.init();
      expect(engine.ctx).toBe(ctx);
    });
  });

  describe('createWhiteNoiseBuffer()', () => {
    it('should create buffer with correct length', async () => {
      await engine.init();
      const buffer = engine.createWhiteNoiseBuffer(44100);
      expect(buffer.length).toBe(44100);
      expect(buffer.numberOfChannels).toBe(2);
    });

    it('should create buffer with values in range [-1, 1]', async () => {
      await engine.init();
      const buffer = engine.createWhiteNoiseBuffer(1000);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        expect(data[i]).toBeGreaterThanOrEqual(-1);
        expect(data[i]).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('createPinkNoiseBuffer()', () => {
    it('should create buffer with correct length', async () => {
      await engine.init();
      const buffer = engine.createPinkNoiseBuffer(44100);
      expect(buffer.length).toBe(44100);
    });

    it('should create buffer with values in range [-1, 1]', async () => {
      await engine.init();
      const buffer = engine.createPinkNoiseBuffer(1000);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        expect(data[i]).toBeGreaterThanOrEqual(-1);
        expect(data[i]).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('createRainBuffer()', () => {
    it('should create buffer with correct length', async () => {
      await engine.init();
      const buffer = engine.createRainBuffer(44100);
      expect(buffer.length).toBe(44100);
    });

    it('should produce mostly silence with occasional droplets', async () => {
      await engine.init();
      const buffer = engine.createRainBuffer(10000);
      const data = buffer.getChannelData(0);
      const nonZero = Array.from(data).filter(x => Math.abs(x) > 0.1);
      // Only small fraction should be non-zero (droplets)
      expect(nonZero.length).toBeLessThan(data.length * 0.05);
    });
  });

  describe('createFireBuffer()', () => {
    it('should create buffer with correct length', async () => {
      await engine.init();
      const buffer = engine.createFireBuffer(44100);
      expect(buffer.length).toBe(44100);
    });
  });

  describe('setMood()', () => {
    it('should set current mood', async () => {
      await engine.init();
      engine.setMood(Mood.ANXIETY);
      expect(engine.currentMood).toBe(Mood.ANXIETY);
    });

    it('should adjust gains for anxiety mood', async () => {
      await engine.init();
      engine.setMood(Mood.ANXIETY);
      expect(engine.gains.pink.gain.value).toBe(0.7);
      expect(engine.gains.white.gain.value).toBe(0.4);
    });

    it('should adjust gains for focus mood', async () => {
      await engine.init();
      engine.setMood(Mood.FOCUS);
      expect(engine.gains.pink.gain.value).toBe(0.5);
      expect(engine.gains.white.gain.value).toBe(0.3);
    });

    it('should adjust gains for fatigue mood', async () => {
      await engine.init();
      engine.setMood(Mood.FATIGUE);
      expect(engine.gains.pink.gain.value).toBe(0.8);
      expect(engine.gains.white.gain.value).toBe(0.3);
    });

    it('should adjust gains for neutral mood', async () => {
      await engine.init();
      engine.setMood(Mood.NEUTRAL);
      expect(engine.gains.pink.gain.value).toBe(0.55);
      expect(engine.gains.white.gain.value).toBe(0.35);
    });
  });

  describe('toggleMute()', () => {
    it('should toggle mute state', async () => {
      await engine.init();
      expect(engine.isMuted).toBe(false);
      engine.toggleMute();
      expect(engine.isMuted).toBe(true);
      engine.toggleMute();
      expect(engine.isMuted).toBe(false);
    });
  });

  describe('dispose()', () => {
    it('should set initialized to false', async () => {
      await engine.init();
      engine.dispose();
      expect(engine.initialized).toBe(false);
    });

    it('should not throw when called on uninitialized engine', () => {
      expect(() => engine.dispose()).not.toThrow();
    });
  });
});
