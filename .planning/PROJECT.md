# AuraFlow - 情绪驱动白噪音修复项目

## What This Is

AuraFlow 是一个情绪驱动的白噪音 Web 应用，通过摄像头分析面部表情动态合成环境音。项目已完成基础功能开发，但存在多个 bug 和技术债务需要修复。

**Core value:** 修复所有已知问题，建立可维护的代码库，为后续功能开发奠定基础。

## Context

**Existing codebase:**
- 单文件 HTML 应用 (1672 行)
- Three.js r127 粒子海洋
- face-api.js 面部检测
- Web Audio API 音频合成
- 无自动化测试

**Already mapped:**
- `.planning/codebase/` 包含完整代码库分析
- CONCERNS.md 详细记录了所有问题

## Requirements

### Validated

(None yet — all features need verification after fixes)

### Active

**Bug Fixes (Phase 1 - Priority: Critical)**
- [ ] **BUG-01**: 焦虑检测无效 - `calcBrowEyeRatio()` 计算了但从未使用
- [ ] **BUG-02**: Debug 面板 toggle 用错 class (`.visible` vs `.hidden`)
- [ ] **BUG-03**: 火焰音频 b5 系数符号错误
- [ ] **BUG-04**: 鼠标涟漪 shader 用 `step()` 硬切断，需改为 `smoothstep()`

**Tech Debt (Phase 2)**
- [ ] **DEBT-01**: 无 resize 防抖 - 窗口拖动时性能下降
- [ ] **DEBT-02**: 无 AudioEngine.dispose() - 重启时内存泄漏
- [ ] **DEBT-03**: CDN 依赖无 SRI 校验 - 安全风险

**Testing (Phase 3)**
- [ ] **TEST-01**: 建立基础测试框架
- [ ] **TEST-02**: 添加核心功能单元测试

**Security & Polish (Phase 4)**
- [ ] **SEC-01**: Camera 权限状态监控
- [ ] **POLISH-01**: 视频镜像与 placeholder 一致性
- [ ] **PERF-01**: 移动端 Touch Ripple 支持

### Out of Scope

- [ ] Face-api.js 升级/替换 - 风险太高，后续单独评估
- [ ] Three.js 版本升级 - shader 兼容性问题
- [ ] Web Worker 迁移 - 重构过大

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 修复范围 | 所有 CONCERNS.md 中列出的项目 | 分阶段执行 |
| 优先级 | BUG-01 焦虑检测最优先 | Phase 1 |
| 测试策略 | 先建立框架，再逐步添加 | Phase 3 |
| 保持单文件 | 避免架构大改，聚焦问题修复 | - |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-02 after initialization*
