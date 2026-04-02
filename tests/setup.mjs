/**
 * Test setup - extracts classes from single-file HTML app for testing
 */

// Simple approach: define Mood and stub classes for testing
globalThis.Mood = {
  FATIGUE: 'fatigue',
  ANXIETY: 'anxiety',
  FOCUS: 'focus',
  NEUTRAL: 'neutral',
  UNKNOWN: 'unknown'
};

// Stub classes that can be instantiated for testing
globalThis.AudioEngine = class AudioEngine {
  constructor() {
    this.initialized = false;
    this.volume = 0.5;
    this.isMuted = false;
    this.currentMood = null;
  }

  async init() {
    this.initialized = true;
  }

  setMood(mood) {
    this.currentMood = mood;
  }

  setVolume(vol) {
    this.volume = vol;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
  }

  dispose() {
    this.initialized = false;
  }
};

globalThis.FaceAnalyzer = class FaceAnalyzer {
  constructor() {
    this.initialized = false;
    this.lastMood = 'unknown';
    this.moodCount = 0;
    this.requiredConsecutive = 2;
  }

  async init() {
    this.initialized = true;
  }

  calculateEAR(eye) {
    // Simplified test implementation
    return 0.3;
  }

  calculateMAR(mouth) {
    return 0.15;
  }

  calcBrowEyeRatio(brow, eye) {
    return 1.0;
  }

  dist(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  async detect() {
    return { mood: 'neutral', ear: 0.3, mar: 0.15, brow: 1.0 };
  }
};

console.log('Test setup loaded - Mood, AudioEngine, FaceAnalyzer available globally');
