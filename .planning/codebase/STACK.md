# Technology Stack

**Analysis Date:** 2026-04-02

## Languages

**Primary:**
- JavaScript (ES6+) - Core application logic, all scripts in `index.html`
- GLSL (OpenGL Shading Language) - Custom vertex and fragment shaders for particle ocean effect
- HTML5 - Single-page structure
- CSS3 - UI styling, animations, and responsive layout

## Runtime

**Environment:**
- Web browser (client-side only, no Node.js server)
- Target browsers: Modern browsers with WebGL and WebRTC support

**Package Manager:**
- None (single-file application, dependencies loaded via CDN)

## Frameworks

**Core:**
- **Three.js r127** - WebGL 3D rendering engine for particle ocean visualization
  - Location: CDN via `https://cdn.jsdelivr.net/npm/three@0.127.0/build/three.min.js`
  - Used for: Scene, camera, renderer, point geometry, shader materials

**Post-processing:**
- **UnrealBloomPass** - Bloom/glow effect on wave peaks
- **EffectComposer** - Post-processing pipeline
- **RenderPass** - Base rendering pass
- **ShaderPass** - Custom shader post-processing
- **CopyShader / LuminosityHighPassShader** - Bloom shader dependencies
- All loaded from Three.js examples/js directory

**Animation:**
- **Tween.js v21** - Smooth value interpolation for mood transitions
  - Location: CDN via `https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@21/dist/tween.umd.js`

**Face Detection:**
- **face-api.js v1.7.12** - Facial expression analysis via webcam
  - Location: CDN via `https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/dist/face-api.min.js`
  - Models: TinyFaceDetector + face landmark models

**Audio:**
- **Web Audio API** (native browser API) - Noise synthesis engine
  - No external library; implemented using AudioContext, BiquadFilterNode, GainNode, BufferSourceNode

## Build/Dev Tools

- None (single HTML file, no build process)

## Configuration

**No configuration files required** - All settings are hardcoded in `index.html`

**Key runtime configurations:**
- Camera: 320x240 resolution, user-facing mode
- Face detection interval: 500ms
- Audio crossfade time: 2 seconds
- Mood change threshold: 2 consecutive detections
- Particle grid: 100x100 (10,000 particles)
- Particle spacing: 1.2 units

## Key Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| three.js | r127 | WebGL rendering, particle system |
| @tweenjs/tween.js | 21 | Smooth animations |
| @vladmandic/face-api | 1.7.12 | Face/landmark detection |
| DM Sans | (Google Fonts) | Typography |

---

*Stack analysis: 2026-04-02*
