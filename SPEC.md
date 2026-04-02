# AuraFlow - 情绪驱动白噪音

## 1. Project Overview

**Name**: AuraFlow
**Type**: Single-page Web App (Vibe Coding)
**Core Functionality**: Real-time facial expression analysis via webcam to dynamically synthesize ambient white noise based on emotional state.
**Target Users**: Remote workers, students, anyone seeking focus-enhancing or calming audio environments.

## 2. Visual & Rendering Specification

### WebGL Particle Ocean (Background)
- **Engine**: Three.js r127 + custom GLSL shaders
- **Grid**: 100×100 = 10,000 particles in structured XZ plane grid
- **Spacing**: 1.2 units between particles
- **Post-processing**: UnrealBloomPass for wave peak glow

### Shader Architecture
- **Vertex Shader**: 3D Simplex noise for Y-axis wave displacement
- **Fragment Shader**: Height-based cyan-to-white gradient with hex quantization

### Particle Features
| Feature | Implementation |
|---------|---------------|
| Wave Motion | Multi-octave Perlin noise (3 layers) |
| Random Jitter | ±0.1-0.2 units per axis |
| Mouse Ripple | Radial wave from cursor, exponential decay |
| Retro Color | 6-step hex quantization (0x00, 0x33, 0x66, 0x99, 0xCC, 0xFF) |
| Bloom | UnrealBloomPass on wave peaks |

### Mood Color Palettes (Deep Cyan Base)
| Mood | Low Color | High Color | Speed |
|------|-----------|------------|-------|
| Fatigue | #332200 (Amber dark) | #FFAA00 (Amber) | 0.3x |
| Anxiety | #330011 (Crimson dark) | #FF2255 (Crimson) | 1.5x |
| Focus | #003322 (Emerald dark) | #00FF88 (Emerald) | 1.0x |
| Neutral | #001133 (Blue dark) | #4488FF (Blue) | 0.7x |

### Camera Preview
- **Shape**: Circular crop, 280px diameter
- **Border**: Soft glow aura effect (color changes with mood)
- **Fallback**: Elegant placeholder when camera unavailable

### Color Palette
| Mood State | Aura Color |
|------------|------------|
| Loading/Initializing | #6366f1 (Indigo) |
| Fatigue (疲惫) | #f59e0b (Amber) - warm, sleepy |
| Anxiety (焦虑) | #ef4444 (Red) - alert |
| Focus (专注) | #22c55e (Green) - calm focus |
| Neutral (平静) | #8b5cf6 (Violet) - balanced |

### Typography
- **Font**: "DM Sans" from Google Fonts (modern, clean)
- **Mood Label**: 14px, uppercase, letter-spacing 2px
- **Instructions**: 12px, muted gray

### UI Components
1. **Camera Container**: Centered, circular with glowing border (mood-reactive)
2. **Mood Blood Bar**: Horizontal spectrum indicator showing emotional state position
   - Gradient from Anxiety (left, red) → Fatigue (30%, amber) → Neutral (55%, violet) → Focus (right, green)
   - Sliding marker with spring animation indicates current mood
   - Labels below: 焦虑 | 疲惫 | 平静 | 专注
3. **Audio Control**: Minimal - single mute/unmute toggle button
4. **Volume Slider**: Subtle, appears on hover near mute button

## 3. Audio Synthesis Specification

### Web Audio API Architecture
```
[Noise Source] → [Filter Chain] → [Gain Nodes] → [Master Gain] → [Destination]
```

### Noise Types

#### White Noise
- Random values with flat spectral density
- Frequency range: 20Hz - 20kHz
- Use: Constant ambient background

#### Pink Noise
- 1/f spectral decay (more energy at low frequencies)
- Frequency range: 20Hz - 20kHz
- Use: Deep focus, calming

#### Rain Sound (Synthesized)
- Filtered white noise (bandpass 400Hz-4kHz)
- Randomized amplitude modulation (droplet pattern)
- Gentle high-frequency shimmer
- Use: Focus, relaxation

#### Fireplace/Campfire (Synthesized)
- Low-frequency filtered noise (lowpass ~200Hz) for base rumble
- Randomized crackling impulses
- Occasional pops with quick decay
- Use: Warmth, comfort, stress relief

### Dynamic Parameters by Mood

| Mood | Primary Sound | Secondary Sound | Filter Cutoff | Gain |
|------|---------------|-----------------|---------------|------|
| Fatigue | Pink Noise | Low rumble | 800Hz | 0.6 → 1.0 (fade in) |
| Anxiety | Pink Noise | Soft rain | 1200Hz | 0.8 (steady) |
| Focus | Rain | White noise (subtle) | 3000Hz | 0.5 (subdued) |
| Neutral | Rain | White noise mix | 2000Hz | 0.6 |

### Transition Behavior
- Mood changes trigger 2-second crossfade between audio states
- No abrupt audio cuts
- Smooth parameter interpolation

## 4. Face Analysis Specification

### Detection Library
- **Library**: face-api.js (via CDN)
- **Models**: tiny_face_detector + face_landmark_68_tiny_model
- **Run Location**: Browser (client-side, no server required)

### Expression Detection
- **Method**: Facial landmarks geometry analysis
- **Detection Points**:
  - Eye aspect ratio (EAR) for fatigue/blink
  - Mouth aspect ratio for yawning
  - Eyebrow raise for surprise/concern

### Mood Classification Logic

```
if (eyeOpenness < 0.2 && mouthOpenness > 0.3) → Fatigue
else if (eyebrowTension > 0.7) → Anxiety
else if (eyeOpenness > 0.3 && mouthOpenness < 0.1 && eyebrowPosition stable) → Focus
else → Neutral
```

### Detection Frequency
- Run face analysis every 500ms to balance performance/responsiveness
- Use confidence threshold of 0.6 for mood state changes
- Require 2 consecutive detections before changing mood state (prevent flicker)

## 5. Interaction Specification

### User Controls
1. **Click anywhere on page**: Toggle mute/unmute
2. **Scroll wheel over page**: Adjust volume (0-100%)
3. **Spacebar**: Quick mute toggle

### Privacy
- No video/data sent to any server
- All processing local in browser
- Camera indicator dot shows when active

## 6. Acceptance Criteria

1. ✅ Page loads without errors
2. ✅ Camera permission prompt appears on load
3. ✅ Camera preview displays in circular frame with mood-colored glow
4. ✅ Face detection runs continuously with mood label updating
5. ✅ Audio synthesizes on first user interaction (click to start - browser autoplay policy)
6. ✅ Mood changes trigger smooth audio transitions (no clicks/pops)
7. ✅ Volume control works via scroll wheel
8. ✅ Mute toggle responds to click and spacebar
9. ✅ Fallback UI when camera unavailable
10. ✅ Responsive: works on 375px-1440px viewport widths

## 7. File Structure

```
AuraFlow/
├── SPEC.md
└── index.html    # Complete single-file application
```
