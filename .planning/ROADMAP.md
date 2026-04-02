# Roadmap: AuraFlow Bug Fixes & Tech Debt

## Overview

修复 AuraFlow 项目中 CONCERNS.md 记录的所有 bug 和技术债务，分 4 个阶段执行：Bug 修复 -> Tech Debt -> 测试框架 -> 安全与优化。

## Phases

- [ ] **Phase 1**: Bug Fixes - 修复 4 个关键 bug（焦虑检测、调试面板、火焰音频、Shader 涟漪）
- [ ] **Phase 2**: Tech Debt - 解决性能和安全问题（resize 防抖、内存泄漏、SRI 校验）
- [ ] **Phase 3**: Testing - 建立测试框架并添加核心功能测试
- [ ] **Phase 4**: Security & Polish - 权限监控、UI 一致性、移动端支持

## Phase Details

### Phase 1: Bug Fixes
**Goal**: 修复所有关键功能性 bug，使应用按预期工作
**Depends on**: Nothing (first phase)
**Requirements**: BUG-01, BUG-02, BUG-03, BUG-04
**Success Criteria** (what must be TRUE):
  1. 焦虑检测功能激活 - 当用户皱眉紧张时，系统能正确识别并触发焦虑情绪
  2. 调试面板可正常显示/隐藏 - 点击调试按钮，面板正确切换可见状态
  3. 火焰音频正常播放 - 篝火/壁炉声音的低频轰鸣声符合预期
  4. 鼠标涟漪平滑过渡 - 粒子海洋中鼠标周围的涟漪效果无硬边
**Plans**: 4 plans

Plans:
- [x] 01-01-PLAN.md: 修复焦虑检测 - 集成 calcBrowEyeRatio() 到 detect() 方法
- [x] 01-02-PLAN.md: 修复调试面板 toggle - 将 '.visible' 改为 '.hidden'
- [x] 01-03-PLAN.md: 修复火焰音频 b5 系数 - 验证并修正负系数问题
- [x] 01-04-PLAN.md: 平滑化鼠标涟漪 shader - step() 改为 smoothstep()

### Phase 2: Tech Debt
**Goal**: 解决性能和安全相关的技术债务
**Depends on**: Phase 1
**Requirements**: DEBT-01, DEBT-02, DEBT-03
**Success Criteria** (what must be TRUE):
  1. 窗口调整时性能稳定 - resize 操作有防抖，不再每帧触发重计算
  2. 应用重启无内存泄漏 - AudioEngine.dispose() 正确清理所有音频节点
  3. CDN 资源完整性可验证 - 所有外部脚本标签包含正确的 integrity 和 crossorigin 属性
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md: 添加 resize 防抖 - 实现 100ms 防抖 throttle
- [x] 02-02-PLAN.md: 添加 AudioEngine.dispose() - 实现清理方法
- [x] 02-03-PLAN.md: 添加 CDN SRI 校验 - 为所有 CDN 脚本添加 integrity 属性

### Phase 3: Testing
**Goal**: 建立自动化测试体系，保证重构和后续开发的质量
**Depends on**: Phase 2
**Requirements**: TEST-01, TEST-02
**Success Criteria** (what must be TRUE):
  1. Vitest 测试框架已配置 - `npm test` 可运行
  2. 核心功能有测试覆盖 - AudioEngine 和 FaceAnalyzer 有单元测试
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md: 建立测试框架 - 引入 Vitest，配置测试环境
- [x] 03-02-PLAN.md: 添加核心功能测试 - AudioEngine 和 FaceAnalyzer 单元测试

### Phase 4: Security & Polish
**Goal**: 提升安全性和用户体验的最终细节
**Depends on**: Phase 3
**Requirements**: SEC-01, POLISH-01, PERF-01
**Success Criteria** (what must be TRUE):
  1. 摄像头权限变更有反馈 - 权限撤销后界面显示提示，不再无声失败
  2. 界面状态一致 - 视频预览和占位符的镜像处理一致
  3. 移动端有触摸交互 - 手机用户可使用触摸产生涟漪效果
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md: 添加摄像头权限监控 - 监听设备变化，给出用户反馈
- [x] 04-02-PLAN.md: 统一视频镜像处理 - 占位符状态禁用 scaleX(-1)
- [x] 04-03-PLAN.md: 添加移动端 Touch Ripple - 支持 touch 事件

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Bug Fixes | 4/4 | Complete | 2026-04-02 |
| 2. Tech Debt | 3/3 | Complete | 2026-04-02 |
| 3. Testing | 2/2 | Complete | 2026-04-02 |
| 4. Security & Polish | 3/3 | Complete | 2026-04-02 |


## PLANNING COMPLETE

**Phase:** 02-tech-debt
**Plans:** 3 plan(s) in 1 wave(s)

### Wave Structure

| Wave | Plans | Autonomous |
|------|-------|------------|
| 1 | 02-01, 02-02, 02-03 | yes, yes, yes |

### Plans Created

| Plan | Objective | Tasks | Files |
|------|-----------|-------|-------|
| 02-01 | 添加 resize 防抖 | 1 | index.html |
| 02-02 | 添加 AudioEngine.dispose() | 1 | index.html |
| 02-03 | 添加 CDN SRI 校验 | 1 | index.html |

### Next Steps

Execute: `/gsd:execute-phase 02-tech-debt`

<sub>`/clear` first - fresh context window</sub>
