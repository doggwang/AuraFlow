# Codebase Concerns

**Analysis Date:** 2026-04-02
**Last Updated:** 2026-04-02 (Phase 1 bug fixes)

## Fixed (Phase 1 - 2026-04-02)

- [x] **Anxiety Detection** - FIXED: Integrated `calcBrowEyeRatio()` into `detect()`, now uses brow landmarks for anxiety classification
- [x] **Mouse Ripple Shader** - FIXED: Replaced `step(distToMouse, 30.0)` with `smoothstep(20.0, 30.0, distToMouse)`
- [x] **Fire Buffer b5 Coefficient** - FIXED: Changed `-0.7616` to `0.7616` (positive feedback for pink noise)
- [x] **Debug Panel Toggle** - FIXED: Changed `classList.toggle('visible')` to `classList.toggle('hidden')`

## Tech Debt

**Anxiety Detection is Non-Functional:**
- ~~Issue: The SPEC.md defines Anxiety detection via eyebrow tension, but `detect()` method (lines 1369-1390) never actually uses brow metrics~~
- ~~Files: `index.html` lines 1369-1390, 1420-1437~~
- ~~Impact: Anxiety mood never triggers - detection defaults to Neutral regardless of actual anxiety state~~
- ~~Fix approach: Integrate `calcBrowEyeRatio()` into `detect()` logic, or simplify to a working subset of moods~~
- **STATUS: FIXED 2026-04-02** - Now uses brow landmarks and avgBrowRatio < 0.9 for anxiety detection

**Mouse Ripple Shader Discontinuity:**
- ~~Issue: `step(distToMouse, 30.0)` creates hard cutoff at 30 units instead of smooth fade~~
- ~~Files: `index.html` line 759 (vertex shader)~~
- ~~Impact: Visible seam/jarring transition as ripple effect abruptly ends~~
- ~~Fix approach: Replace `step()` with `smoothstep()` for exponential decay~~
- **STATUS: FIXED 2026-04-02** - Now uses `smoothstep(20.0, 30.0, distToMouse)`

**Fire Buffer b5 Coefficient Sign Error:**
- ~~Issue: Line 1193 has `b5 = -0.7616 * b5 - white * 0.0168980` - negative coefficient may produce incorrect rumble character~~
- ~~Files: `index.html` line 1193~~
- ~~Impact: Fire/campfire audio may sound wrong or not match SPEC.md intent~~
- ~~Fix approach: Verify against reference pink noise implementation, correct sign~~
- **STATUS: FIXED 2026-04-02** - Changed to `b5 = 0.7616 * b5 - white * 0.0168980`

**No Debounced Window Resize:**
- Issue: `onResize()` fires continuously during drag, causing per-frame recalculation
- Files: `index.html` lines 873, 1039-1052
- Impact: Performance degradation during window resize, potential frame drops
- Fix approach: Add resize debouncing (e.g., 100ms throttle)

**No Cleanup on App Restart:**
- Issue: `AudioEngine` creates buffer sources but never stops them if `init()` is called again; no `dispose()` method exists
- Files: `index.html` lines 1084-1170
- Impact: Memory leak if app reinitializes; orphaned audio nodes
- Fix approach: Add `dispose()` method to stop and disconnect all nodes

## Known Bugs

**Face-api Model Loading Unreliable:**
- Issue: Multiple fallback attempts for landmark models (lines 1304-1330) - if all fail, `initialized` stays false silently
- Files: `index.html` lines 1283-1337
- Symptoms: No console error after final failure, face detection just never works
- Trigger: Network issues, CDN blocking, or browser compatibility problems
- Workaround: Check debug panel shows "--" for all values; reload page

**Debug Toggle Uses Wrong Class:**
- Issue: `debugPanel.classList.toggle('visible')` but panel uses `.hidden` class (line 318)
- Files: `index.html` lines 318, 1670
- Symptoms: Debug panel never shows/hides via toggle button
- Trigger: Click debug toggle button
- Workaround: None - debug panel unusable

**Mood Bar Marker Missing Active State:**
- Issue: Marker uses `mood-bar-marker` class but CSS targets `.mood-bar-marker.active` (line 295)
- Files: `index.html` lines 295, 1487, 1492
- Impact: Value label above marker never displays
- Trigger: Any mood detection

**Video Mirroring Not Disabled for Placeholder:**
- Issue: `#video` has `transform: scaleX(-1)` but placeholder is a static div - inconsistent user experience
- Files: `index.html` lines 129-130
- Impact: When camera shows, face is mirrored (self-view natural); placeholder icon is not
- Trigger: Camera unavailable state

## Security Considerations

**CDN Dependencies No Integrity Checking:**
- Risk: All external scripts loaded without SRI (Subresource Integrity) hashes
- Files: `index.html` lines 617-625
- Impact: Man-in-the-middle could inject malicious code via compromised CDN
- Current mitigation: None
- Recommendations: Add `integrity` and `crossorigin` attributes to CDN script tags

**No HTTPS Enforcement:**
- Risk: getUserMedia requires HTTPS in modern browsers; HTTP localhost may have restrictions
- Files: `index.html` line 1587
- Impact: Camera may fail on HTTP deployment
- Current mitigation: Works on localhost due to browser exceptions
- Recommendations: Ensure deployment uses HTTPS

**No Camera Permission Expiration Handling:**
- Risk: If camera permission is revoked mid-session, app continues trying to detect
- Files: `index.html` line 1587
- Impact: Continuous failed getUserMedia calls, battery drain, no user feedback
- Current mitigation: None
- Recommendations: Add permission state monitoring via `navigator.mediaDevices.ondevicechange`

## Performance Bottlenecks

**10,000 Particles with Per-Frame Post-Processing:**
- Problem: 100x100 grid with UnrealBloomPass renders every frame at potentially 60fps
- Files: `index.html` lines 833-936 (createParticles), 943-957 (bloom setup)
- Cause: Additive blending + bloom on 10K points is GPU-intensive
- Improvement path: Reduce particle count for mobile, disable bloom on low-end devices

**Audio Buffer Pre-Generation:**
- Problem: Creates `sampleRate * 2` length buffers (~96KB at 48kHz) for all 4 noise types on init
- Files: `index.html` lines 1085-1170
- Cause: Large memory allocation at startup, especially on mobile
- Improvement path: Generate buffers lazily or use smaller sizes with loop points

**Detection Runs on Main Thread:**
- Problem: Face-api detection blocks UI during `detect()` every 500ms
- Files: `index.html` line 1605
- Cause: No Web Worker usage for face detection
- Impact: UI may stutter during detection, especially on slower devices
- Improvement path: Move face detection to Web Worker

**No Performance Monitoring:**
- Problem: No FPS counter, no WebGL error reporting, no memory monitoring
- Files: N/A
- Impact: Hard to diagnose performance issues in production
- Improvement path: Add stats.js or custom performance panel

## Fragile Areas

**Face-api CDN Model Loading:**
- Why fragile: Falls back through 5 different landmark model functions; any CDN change breaks detection
- Files: `index.html` lines 1304-1330
- Safe modification: Add version pinning and verify CDN URLs before fallback loop
- Test coverage: Manual only - no automated testing of model loading

**WebGL Renderer Initialization:**
- Why fragile: No error handling if WebGL context fails or context lost
- Files: `index.html` lines 855-860
- Safe modification: Wrap in try-catch, show fallback message
- Test coverage: None - would require WebGL emulation

**Audio Context State Machine:**
- Why fragile: Relies on browser autoplay policy; requires user gesture to start; no state reconciliation
- Files: `index.html` lines 1072-1082
- Safe modification: Add explicit state checks before audio operations
- Test coverage: None - requires actual audio hardware

## Scaling Limits

**Memory (Audio Buffers):**
- Current capacity: 4 noise buffers * 96KB = ~384KB for audio alone
- Limit: Mobile devices may struggle with multiple large allocations
- Scaling path: Use smaller buffer sizes (1 second loop with interpolation)

**Face Detection Input Size:**
- Current capacity: Fixed 224x224 input to TinyFaceDetector
- Limit: Small faces or crowded frames may not detect
- Scaling path: Allow higher input resolution on capable devices

**Particle Count:**
- Current capacity: 10,000 particles fixed
- Limit: Low-end devices (integrated graphics, mobile) will drop frames
- Scaling path: Add device capability detection, reduce particles dynamically

## Dependencies at Risk

**Three.js r127 (2021):**
- Risk: Very outdated version; security vulnerabilities may exist
- Impact: CVE in Three.js could affect this app
- Migration plan: Update to r150+ but verify shader compatibility (shader syntax changes between versions)

**face-api.js @1.7.12:**
- Risk: Package may be unmaintained; model format may become deprecated
- Impact: Face detection stops working if browsers deprecate required WebGL features
- Migration plan: Switch to TensorFlow.js BlazeFace or MediaPipe Face Detection as alternatives

**@vladmandic/face-api fork:**
- Risk: Fork may diverge from original; CDN URL may change
- Impact: Detection breaks if CDN URL becomes invalid
- Migration plan: Host models locally or use official face-api CDN

## Missing Critical Features

**Error Boundaries:**
- Problem: No try-catch around main app initialization; any error crashes silently
- Blocks: User sees frozen/dead page with no feedback

**Offline Support:**
- Problem: No service worker; app unusable without network for CDN assets
- Blocks: Use in airplane mode, poor connectivity environments

**Mobile Touch Optimization:**
- Problem: Mouse ripple only; no touch ripple for mobile users
- Blocks: Mobile users lose interactive wave feature

**Accessibility:**
- Problem: No reduced motion preference check; no screen reader support; no keyboard navigation beyond mute
- Blocks: Users with motion sensitivity, visual impairments

**Camera Selection:**
- Problem: No way to choose front/back camera on mobile
- Blocks: Users with multiple cameras cannot switch

## Test Coverage Gaps

**No Automated Tests:**
- What's not tested: All functionality is manual-only
- Files: None (no test files exist)
- Risk: Any refactoring could break functionality with no warning
- Priority: Critical

**No Audio Testing:**
- What's not tested: Audio synthesis, gain transitions, mute/unmute behavior
- Files: N/A
- Risk: Audio glitches or clicks during mood transitions go undetected
- Priority: High

**No WebGL Testing:**
- What's not tested: Particle rendering, shader compilation, post-processing
- Files: N/A
- Risk: WebGL context loss or shader errors go undetected
- Priority: High

**No Face Detection Threshold Testing:**
- What's not tested: Mood classification thresholds (EAR/MAR values)
- Files: N/A
- Risk: False positive/negative mood detections not caught
- Priority: Medium

**No Cross-Browser Testing:**
- What's not tested: Firefox, Safari, Edge compatibility
- Files: N/A
- Risk: Browser-specific bugs in WebGL or Web Audio not caught
- Priority: Medium

---

*Concerns audit: 2026-04-02*
