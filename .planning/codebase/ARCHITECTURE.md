# Architecture

## Overview
Single-file SPA (Single Page Application) with modular class-based architecture.

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
Face Detection → FaceAnalyzer → Mood Classification
                                           ↓
              ParticleOcean ←→ AudioEngine ←┘
                    ↓
              Visual/Audio Crossfade (mood-driven)
```

## Mood States
- 平静 (Calm)
- 愉悦 (Happy)
- 悲伤 (Sad)
- 焦虑 (Anxious)
- 兴奋 (Excited)
- 专注 (Focused)
