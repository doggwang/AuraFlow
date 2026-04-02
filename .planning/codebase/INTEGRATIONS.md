# External Integrations

**Analysis Date:** 2026-04-02

## APIs & External Services

**3D Graphics:**
- Three.js CDN (`jsdelivr.net`)
  - Package: `three@0.127.0`
  - Scripts loaded:
    - `build/three.min.js` - Core library
    - `examples/js/shaders/CopyShader.js`
    - `examples/js/shaders/LuminosityHighPassShader.js`
    - `examples/js/postprocessing/EffectComposer.js`
    - `examples/js/postprocessing/RenderPass.js`
    - `examples/js/postprocessing/ShaderPass.js`
    - `examples/js/postprocessing/UnrealBloomPass.js`

**Animation:**
- Tween.js CDN (`jsdelivr.net`)
  - Package: `@tweenjs/tween.js@21`

**Face Detection:**
- face-api.js CDN (`jsdelivr.net`)
  - Package: `@vladmandic/face-api@1.7.12`
  - Model URL: `https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model`
  - Models loaded: TinyFaceDetector + face landmark 68 tiny model

**Typography:**
- Google Fonts
  - Font: DM Sans (weights 400, 500, 600)
  - Preconnect hints for performance optimization

## Browser APIs (Native)

**Media:**
- **WebRTC / getUserMedia** - Camera access for face detection
  - Requested constraints: `{ video: { facingMode: 'user', width: 320, height: 240 } }`
  - No audio from microphone

**Audio:**
- **Web Audio API** - Client-side audio synthesis
  - Noise types: White, Pink, Rain (filtered), Fire/rumble
  - Processing: BiquadFilter nodes, Gain nodes, BufferSource nodes
  - No external audio files - all synthesized

## Data Storage

**None:**
- No localStorage or IndexedDB used
- No cookies
- All state is in-memory only

## Authentication & Identity

**None:**
- No authentication
- No user accounts
- No server-side sessions

## Monitoring & Observability

**Logs:**
- Console logging for debugging (detection values, errors)
- Debug panel UI shows real-time detection metrics (EAR, MAR, brow tension)
- No external logging service

## CI/CD & Deployment

**Hosting:**
- Static single HTML file
- Can be served from any static file host or opened directly in browser

**No CI/CD pipeline** - Single-file application

## Environment Configuration

**Required browser features:**
- WebGL
- WebRTC (camera access)
- Web Audio API
- ES6 JavaScript support

**No environment variables or secrets required**

## Webhooks & Callbacks

**None:**
- No outgoing HTTP requests after initial page load
- No webhooks
- No server communication

## Privacy

- All processing occurs locally in browser
- No video/data transmitted to any server
- Camera stream is displayed locally and processed for face detection only
- Camera indicator dot shows when camera is active

---

*Integration audit: 2026-04-02*
