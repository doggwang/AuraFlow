# Requirements: AuraFlow Bug Fixes & Tech Debt

**Defined:** 2026-04-02
**Core Value:** 修复所有已知问题，建立可维护的代码库

## v1 Requirements

### Bug Fixes (Phase 1 - Critical)

- [ ] **BUG-01**: 焦虑检测功能 - `FaceAnalyzer.calcBrowEyeRatio()` 计算了 brow distance 和 eye distance ratio，但 `detect()` 方法从未使用此值导致焦虑情绪永远无法触发
- [ ] **BUG-02**: Debug 面板 toggle 失效 - `debugPanel.classList.toggle('visible')` 但面板使用 `.hidden` class，导致调试面板无法通过按钮显示/隐藏
- [ ] **BUG-03**: 火焰音频 b5 系数符号错误 - Line 1193 `b5 = -0.7616 * b5 - white * 0.0168980` 负系数可能产生错误的低频轰鸣声
- [ ] **BUG-04**: 鼠标涟漪 shader 不平滑 - `step(distToMouse, 30.0)` 创建硬切断，应使用 `smoothstep()` 实现指数衰减

### Tech Debt (Phase 2)

- [x] **DEBT-01**: 添加 resize 防抖 - `onResize()` 在窗口拖动时连续触发，应添加 100ms 防抖
- [ ] **DEBT-02**: 添加 AudioEngine.dispose() - 重启应用时音频节点未清理，导致内存泄漏
- [ ] **DEBT-03**: CDN 依赖添加 SRI 校验 - 所有外部脚本添加 `integrity` 和 `crossorigin` 属性

### Testing (Phase 3)

- [ ] **TEST-01**: 建立测试框架 - 引入 Vitest，配置基本测试环境
- [ ] **TEST-02**: 添加核心功能测试 - AudioEngine 音频合成测试、FaceAnalyzer 情绪分类阈值测试

### Security & Polish (Phase 4)

- [x] **SEC-01**: Camera 权限状态监控 - 添加 `navigator.mediaDevices.ondevicechange` 监听权限变更并给出反馈
- [ ] **POLISH-01**: 视频镜像一致性 - placeholder 状态下禁用 `transform: scaleX(-1)`，与实际摄像头状态一致
- [ ] **PERF-01**: 移动端 Touch Ripple - 添加 touch 事件支持移动端用户

## Out of Scope

| Feature | Reason |
|---------|--------|
| face-api.js 升级 | Package 已停止维护，升级风险太高，需单独评估 |
| Three.js 版本升级 | r127 → r150+ 需要 shader 语法调整，工作量大 |
| Web Worker 面部检测 | 重构过大，当前阶段仅修复已知问题 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BUG-01 | Phase 1 | Pending |
| BUG-02 | Phase 1 | Pending |
| BUG-03 | Phase 1 | Pending |
| BUG-04 | Phase 1 | Pending |
| DEBT-01 | Phase 2 | Complete |
| DEBT-02 | Phase 2 | Pending |
| DEBT-03 | Phase 2 | Pending |
| TEST-01 | Phase 3 | Pending |
| TEST-02 | Phase 3 | Pending |
| SEC-01 | Phase 4 | Complete |
| POLISH-01 | Phase 4 | Pending |
| PERF-01 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-02*
