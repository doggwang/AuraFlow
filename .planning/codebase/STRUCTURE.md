# Project Structure

## Files
- `index.html` - Complete single-file application (~1672 lines)
- `SPEC.md` - Project specification and acceptance criteria
- `.claude/` - GSD framework installation
- `.github/` - GitHub configuration
- `.playwright-mcp/` - Playwright MCP cache
- `.planning/` - GSD planning directory

## index.html Structure
- **HTML Section** (~100 lines) - DOM structure
- **CSS Section** (~530 lines) - Embedded styles with CSS custom properties
- **JavaScript Section** (~1040+ lines) - ES6 classes and application logic

## Dependencies (CDN)
- Three.js r127 - 3D rendering
- face-api.js - Facial expression detection
- Tween.js - Animation
- Google Fonts - Typography

## No Build Process
- Single HTML file, no bundler
- No npm/package.json
- No separate module files
- CDN-loaded dependencies only
