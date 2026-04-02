<!-- GSD:project-start source:PROJECT.md -->
## Project

**AuraFlow - 情绪驱动白噪音修复项目**

AuraFlow 是一个情绪驱动的白噪音 Web 应用，通过摄像头分析面部表情动态合成环境音。项目已完成基础功能开发，但存在多个 bug 和技术债务需要修复。

**Core value:** 修复所有已知问题，建立可维护的代码库，为后续功能开发奠定基础。
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- JavaScript (ES6+) - Core application logic, all scripts in `index.html`
- GLSL (OpenGL Shading Language) - Custom vertex and fragment shaders for particle ocean effect
- HTML5 - Single-page structure
- CSS3 - UI styling, animations, and responsive layout
## Runtime
- Web browser (client-side only, no Node.js server)
- Target browsers: Modern browsers with WebGL and WebRTC support
- None (single-file application, dependencies loaded via CDN)
## Frameworks
- **Three.js r127** - WebGL 3D rendering engine for particle ocean visualization
- **UnrealBloomPass** - Bloom/glow effect on wave peaks
- **EffectComposer** - Post-processing pipeline
- **RenderPass** - Base rendering pass
- **ShaderPass** - Custom shader post-processing
- **CopyShader / LuminosityHighPassShader** - Bloom shader dependencies
- All loaded from Three.js examples/js directory
- **Tween.js v21** - Smooth value interpolation for mood transitions
- **face-api.js v1.7.12** - Facial expression analysis via webcam
- **Web Audio API** (native browser API) - Noise synthesis engine
## Build/Dev Tools
- None (single HTML file, no build process)
## Configuration
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
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Overview
## Naming Conventions
- **Classes**: `PascalCase` (e.g., `ParticleOcean`, `AudioEngine`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_PARTICLE_COUNT`)
- **Variables/Functions**: `camelCase` (e.g., `particleCount`, `initializeOcean`)
## Architecture Pattern
- `ParticleOcean` - Visual particle system
- `AudioEngine` - Web Audio API audio processing
- `FaceAnalyzer` - Canvas-based facial analysis
- `UIController` - UI state and DOM management
- `AuraFlowApp` - Main application orchestrator
## Styling
- CSS embedded in `<style>` tag within HTML
- CSS custom properties (variables) for theming
- No external CSS framework
## Linting/Formatting
- No linting or formatting tools configured
- Manual code style maintenance required
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Overview
## Core Components
### ParticleOcean
- Three.js r127 based particle system
- Custom GLSL shaders for visual effects
- Handles mood-reactive visual transitions
### AudioEngine
- Web Audio API synthesis chain
- Architecture: Noise Source → Filter Chain → Gain Nodes → Master Gain
- Generates ambient soundscapes driven by mood analysis
### FaceAnalyzer
- face-api.js for client-side facial expression detection
- Processes canvas-based facial analysis
- Extracts mood/emotion data from video feed
### UIController
- Manages UI state and DOM interactions
- Controls debug panel, mood display, and camera feed
- Handles user interaction events
### AuraFlowApp
- Main application orchestrator
- Coordinates between all subsystems
- Manages initialization and runtime state
## Data Flow
```
```
## Mood States
- 平静 (Calm)
- 愉悦 (Happy)
- 悲伤 (Sad)
- 焦虑 (Anxious)
- 兴奋 (Excited)
- 专注 (Focused)
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
