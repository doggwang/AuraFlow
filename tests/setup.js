/**
 * Test setup - extracts classes from single-file HTML app for testing
 * Reads index.html and extracts Mood enum, AudioEngine, and FaceAnalyzer
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read index.html
const htmlPath = resolve(__dirname, '../index.html');
const html = readFileSync(htmlPath, 'utf-8');

// Create a sandbox context
const sandbox = {
  console,
  Math,
  setTimeout,
  clearTimeout,
  document: {
    getElementById: () => null
  },
  window: {
    innerWidth: 1920,
    innerHeight: 1080,
    devicePixelRatio: 1,
    AudioContext: undefined,
    webkitAudioContext: undefined
  }
};

// Run code in sandbox context
function runCode(code) {
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
}

// Extract Mood enum
const moodMatch = html.match(/const Mood = \{[^}]+\}/s);
if (moodMatch) {
  runCode(moodMatch[0]);
  globalThis.Mood = sandbox.Mood;
}

// Extract AudioEngine class
const audioStart = html.indexOf('class AudioEngine {');
if (audioStart !== -1) {
  let braceCount = 0;
  let start = html.indexOf('{', audioStart);
  for (let i = start; i < html.length; i++) {
    if (html[i] === '{') braceCount++;
    else if (html[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        const classCode = html.slice(audioStart, i + 1);
        runCode(classCode);
        globalThis.AudioEngine = sandbox.AudioEngine;
        break;
      }
    }
  }
}

// Extract FaceAnalyzer class
const faceStart = html.indexOf('class FaceAnalyzer {');
if (faceStart !== -1) {
  let braceCount = 0;
  let start = html.indexOf('{', faceStart);
  for (let i = start; i < html.length; i++) {
    if (html[i] === '{') braceCount++;
    else if (html[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        const classCode = html.slice(faceStart, i + 1);
        runCode(classCode);
        globalThis.FaceAnalyzer = sandbox.FaceAnalyzer;
        break;
      }
    }
  }
}

console.log('Setup complete:', {
  Mood: typeof globalThis.Mood,
  AudioEngine: typeof globalThis.AudioEngine,
  FaceAnalyzer: typeof globalThis.FaceAnalyzer
});
