# Coding Conventions

## Overview
Single-file HTML application with vanilla JavaScript ES6 classes. No build system or npm.

## Naming Conventions
- **Classes**: `PascalCase` (e.g., `ParticleOcean`, `AudioEngine`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_PARTICLE_COUNT`)
- **Variables/Functions**: `camelCase` (e.g., `particleCount`, `initializeOcean`)

## Architecture Pattern
ES6 Classes for modularity:
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
