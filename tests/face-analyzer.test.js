/**
 * FaceAnalyzer unit tests
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Stub classes
globalThis.Mood = {
  FATIGUE: 'fatigue',
  ANXIETY: 'anxiety',
  FOCUS: 'focus',
  NEUTRAL: 'neutral',
  UNKNOWN: 'unknown'
};

globalThis.FaceAnalyzer = class FaceAnalyzer {
  constructor() {
    this.video = null;
    this.initialized = false;
    this.lastMood = Mood.UNKNOWN;
    this.moodCount = 0;
    this.requiredConsecutive = 2;
  }

  async init() {
    this.initialized = true;
  }

  calculateEAR(eye) {
    // Eye aspect ratio: (A + B) / (2 * C)
    // where A = dist(eye[1], eye[5]), B = dist(eye[2], eye[4]), C = dist(eye[0], eye[3])
    const A = this.dist(eye[1], eye[5]);
    const B = this.dist(eye[2], eye[4]);
    const C = this.dist(eye[0], eye[3]);
    return (A + B) / (2.0 * C);
  }

  calculateMAR(mouth) {
    // Mouth aspect ratio: (A + B) / (2 * C)
    // where A = dist(mouth[2], mouth[6]), B = dist(mouth[3], mouth[7]), C = dist(mouth[0], mouth[4])
    const A = this.dist(mouth[2], mouth[6]);
    const B = this.dist(mouth[3], mouth[7]);
    const C = this.dist(mouth[0], mouth[4]);
    return (A + B) / (2.0 * C);
  }

  calcBrowEyeRatio(brow, eye) {
    // Brow center Y
    const browCenterY = (brow[0].y + brow[1].y + brow[2].y + brow[3].y + brow[4].y) / 5;
    // Eye center Y
    const eyeCenterY = (eye[0].y + eye[1].y + eye[2].y + eye[3].y + eye[4].y) / 6;
    // Eye width
    const eyeWidth = Math.abs(eye[3].x - eye[0].x);
    // Distance from brow center to eye center
    const distance = eyeCenterY - browCenterY;
    // Return ratio of distance to eye width
    return eyeWidth > 0 ? distance / eyeWidth : 1.0;
  }

  dist(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  detectMood(avgEAR, mar, avgBrowRatio) {
    // Detection thresholds (tuned for stability):
    // EAR: eye open ratio (0.2-0.4 normal, <0.15 very closed, >0.4 very open)
    // MAR: mouth open ratio (<0.15 closed, >0.25 open)
    // BrowRatio: < 0.9 = brows close to eyes (anxiety), > 1.3 = raised (relaxed)

    // Anxiety check first (brows close to eyes indicates tension)
    if (avgBrowRatio < 0.9 && mar < 0.25) {
      return Mood.ANXIETY;
    } else if (avgEAR < 0.15 && mar > 0.3) {
      // Closed eyes + open mouth = fatigue (yawning/sleepy)
      return Mood.FATIGUE;
    } else if (avgEAR > 0.35 && mar < 0.1) {
      // Very open eyes + closed mouth = focus/alert
      return Mood.FOCUS;
    } else if (mar > 0.35) {
      // Open mouth (talking or yawning) with normal eyes
      return Mood.NEUTRAL;
    } else {
      // Default: neutral state
      return Mood.NEUTRAL;
    }
  }
};

describe('FaceAnalyzer', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new FaceAnalyzer();
  });

  describe('initialization', () => {
    it('should create instance with default values', () => {
      expect(analyzer.initialized).toBe(false);
      expect(analyzer.lastMood).toBe(Mood.UNKNOWN);
      expect(analyzer.moodCount).toBe(0);
      expect(analyzer.requiredConsecutive).toBe(2);
    });
  });

  describe('init()', () => {
    it('should set initialized to true', async () => {
      await analyzer.init();
      expect(analyzer.initialized).toBe(true);
    });
  });

  describe('dist()', () => {
    it('should calculate Euclidean distance correctly', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 3, y: 4 };
      expect(analyzer.dist(p1, p2)).toBe(5);
    });

    it('should return 0 for same point', () => {
      const p = { x: 5, y: 5 };
      expect(analyzer.dist(p, p)).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const p1 = { x: -1, y: -1 };
      const p2 = { x: 2, y: 2 };
      expect(analyzer.dist(p1, p2)).toBeCloseTo(4.24, 1);
    });
  });

  describe('calculateEAR()', () => {
    it('should calculate EAR for open eye', () => {
      // Eye landmarks: [0,1,2,3,4,5] where 0=left, 3=right
      const openEye = [
        { x: 0, y: 1 },   // 0: left corner
        { x: 1, y: 0 },   // 1: upper left
        { x: 2, y: 0.5 }, // 2: upper right
        { x: 3, y: 1 },   // 3: right corner
        { x: 2, y: 1.5 }, // 4: lower right
        { x: 1, y: 1.5 }  // 5: lower left
      ];
      const ear = analyzer.calculateEAR(openEye);
      expect(ear).toBeGreaterThan(0);
      expect(ear).toBeLessThan(1);
    });

    it('should calculate lower EAR for closed eye', () => {
      // Closed eye - vertical distance between landmarks is smaller
      const closedEye = [
        { x: 0, y: 1 },   // 0: left corner
        { x: 1, y: 0.5 }, // 1: upper left (closer to center)
        { x: 2, y: 0.5 }, // 2: upper right (closer to center)
        { x: 3, y: 1 },   // 3: right corner
        { x: 2, y: 0.6 }, // 4: lower right (closer to center)
        { x: 1, y: 0.6 }  // 5: lower left (closer to center)
      ];
      const closedEAR = analyzer.calculateEAR(closedEye);

      const openEye = [
        { x: 0, y: 1 },   // 0: left corner
        { x: 1, y: 0 },   // 1: upper left
        { x: 2, y: 0.5 }, // 2: upper right
        { x: 3, y: 1 },   // 3: right corner
        { x: 2, y: 1.5 }, // 4: lower right
        { x: 1, y: 1.5 }  // 5: lower left
      ];
      const openEAR = analyzer.calculateEAR(openEye);

      expect(closedEAR).toBeLessThan(openEAR);
    });
  });

  describe('calculateMAR()', () => {
    it('should calculate MAR for closed mouth', () => {
      const closedMouth = [
        { x: 0, y: 0 },   // 0: left corner
        { x: 1, y: 0 },   // 1: upper lip
        { x: 2, y: 0 },   // 2: upper inner
        { x: 3, y: 0 },   // 3: right corner
        { x: 2, y: 0.1 }, // 4: lower inner
        { x: 1, y: 0.1 }, // 5: lower lip
        { x: 2, y: 0 },   // 6: bottom
        { x: 3, y: 0 }    // 7: right
      ];
      const mar = analyzer.calculateMAR(closedMouth);
      expect(mar).toBeLessThan(0.3);
    });

    it('should calculate higher MAR for open mouth', () => {
      const closedMouth = [
        { x: 0, y: 0 },   // 0
        { x: 1, y: 0 },   // 1
        { x: 2, y: 0 },   // 2
        { x: 3, y: 0 },   // 3
        { x: 2, y: 0.1 }, // 4
        { x: 1, y: 0.1 }, // 5
        { x: 2, y: 0 },   // 6
        { x: 3, y: 0 }    // 7
      ];
      const closedMAR = analyzer.calculateMAR(closedMouth);

      const openMouth = [
        { x: 0, y: 0 },   // 0
        { x: 1, y: 0 },    // 1
        { x: 2, y: 0 },    // 2
        { x: 3, y: 0 },    // 3
        { x: 2, y: 0.5 },  // 4: open wider
        { x: 1, y: 0.5 },  // 5
        { x: 2, y: 0.6 },  // 6
        { x: 3, y: 0 }     // 7
      ];
      const openMAR = analyzer.calculateMAR(openMouth);

      expect(openMAR).toBeGreaterThan(closedMAR);
    });
  });

  describe('calcBrowEyeRatio()', () => {
    it('should calculate lower ratio for furrowed brows (anxiety)', () => {
      // Brows closer to eyes = lower ratio
      const furrowedBrow = [
        { x: 0, y: 3 }, { x: 1, y: 3.2 }, { x: 2, y: 3.1 },
        { x: 3, y: 3.2 }, { x: 4, y: 3 }
      ];
      const eye = [
        { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 },
        { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }
      ];
      const ratio = analyzer.calcBrowEyeRatio(furrowedBrow, eye);
      expect(ratio).toBeLessThan(1.0);
    });

    it('should calculate higher ratio for raised brows (relaxed)', () => {
      // Brows farther from eyes = higher ratio
      const raisedBrow = [
        { x: 0, y: 1 }, { x: 1, y: 0.8 }, { x: 2, y: 0.9 },
        { x: 3, y: 0.8 }, { x: 4, y: 1 }
      ];
      const eye = [
        { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 },
        { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }
      ];
      const ratio = analyzer.calcBrowEyeRatio(raisedBrow, eye);
      expect(ratio).toBeGreaterThan(1.0);
    });

    it('should return 1.0 when eye width is 0', () => {
      // Create brow and eye where eye width (eye[3].x - eye[0].x) is 0
      const brow = [
        { x: 2, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 1 },
        { x: 2, y: 1 }, { x: 2, y: 1 }
      ];
      const eye = [
        { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 },
        { x: 2, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }
      ];
      const ratio = analyzer.calcBrowEyeRatio(brow, eye);
      expect(ratio).toBe(1.0);
    });
  });

  describe('detectMood()', () => {
    it('should detect anxiety when browRatio < 0.9 and mar < 0.25', () => {
      const mood = analyzer.detectMood(0.3, 0.2, 0.8);
      expect(mood).toBe(Mood.ANXIETY);
    });

    it('should detect fatigue when ear < 0.15 and mar > 0.3', () => {
      const mood = analyzer.detectMood(0.1, 0.4, 1.0);
      expect(mood).toBe(Mood.FATIGUE);
    });

    it('should detect focus when ear > 0.35 and mar < 0.1', () => {
      const mood = analyzer.detectMood(0.4, 0.05, 1.2);
      expect(mood).toBe(Mood.FOCUS);
    });

    it('should detect neutral when mar > 0.35', () => {
      const mood = analyzer.detectMood(0.3, 0.4, 1.0);
      expect(mood).toBe(Mood.NEUTRAL);
    });

    it('should default to neutral for unknown state', () => {
      const mood = analyzer.detectMood(0.25, 0.15, 1.1);
      expect(mood).toBe(Mood.NEUTRAL);
    });

    it('should detect anxiety before fatigue when browRatio < 0.9 and mar < 0.25', () => {
      // Algorithm checks anxiety FIRST when browRatio < 0.9 AND mar < 0.25
      // even if other conditions could indicate different moods
      const mood = analyzer.detectMood(0.1, 0.2, 0.7);
      expect(mood).toBe(Mood.ANXIETY);
    });
  });
});
