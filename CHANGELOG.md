# PCBforth 版本记录 (CHANGELOG)

> 项目：PCBforth — Professional PCB One-Stop Service  
> 域名：[pcbservices-ayqjjtjv.manus.space](https://pcbservices-ayqjjtjv.manus.space)  
> 技术栈：React 19 + Tailwind CSS 4 + shadcn/ui + Framer Motion

---

## v 7beb7598 — 2026-06-20
**服务配图精准替换 + 制板工厂战略合作文案**

- 为5个服务板块分别生成专属AI配图，彻底解决多个板块共用同一张图的问题：
  - 原理图设计 → 工程师操作 Altium Designer 双屏工作站
  - PCB Layout → DDR4 高速 PCB 布线俯视图
  - BOM & 元器件 → TI/NXP/Infineon 元器件托盘
  - PCB 制板 → 中国头部工厂 ISO 洁净室生产线
  - SMT 贴片 → ASM SIPLACE 全自动贴片产线
- 更新制板工艺（Fabrication）文案，明确强调：
  - 与中国头部 PCB 工厂建立深度战略合作关系
  - 合作工厂均通过 ISO9001 / UL / IPC Class 2/3 国际认证
  - 可承接样板至百万级量产全规模订单

---

## v cbd734c0 — 2026-06-19
**图片性能优化 — 减少 12 次外部图片请求**

- PCBforth Logo（3 处）改为内联 SVG，零网络请求
- 合作伙伴 Logo（8 个 PNG）改为纯 CSS 品牌色文字卡片，节省 8 次图片请求
- 移除 Unsplash 外链，替换为已有 CDN 图片
- 所有非首屏图片添加 `loading="lazy"` + `decoding="async"` 懒加载
- Hero 背景大图添加 `fetchPriority="high"` 优先加载，提升首屏 LCP 指标

---

## v a226da72 — 2026-06-19
**合作伙伴 Logo 图片化**

- 将合作伙伴区域 8 家公司的文字标签替换为品牌 Logo 图片
- 覆盖：Huawei、Lenovo、Foxconn、BYD、DJI、Hikvision、OPPO、Xiaomi
- Logo 放置于白色圆角卡片中，hover 时阴影加深，统一灰度滤镜保持视觉一致

---

## v e028a604 — 2026-06-19
**仿真板块加入真实仿真截图**

- 参考 linkytech.com 案例展示风格，在每个仿真标签页下方新增"仿真案例图示"区域
- 各标签页新增图片：
  - High-Speed Serial → S 参数插入/回波损耗曲线 + PAM4 眼图
  - DDRx → DDR3 建立/保持时序仿真波形
  - PI → DC IR-Drop 热力图 + PDN 阻抗频率曲线
  - EMC → CST PCB 辐射发射仿真截图
  - Thermal → Icepak PCB 温度场云图
- 图片使用深色背景框 + 蓝色说明文字条，中英文说明同步切换

---

## v 67371724 — 2026-06-18
**仿真分析板块重建 — 5 个详细标签页**

- 参考 edadoc.com 仿真分析页面，将原单一 ServiceSection 替换为专属 `SimulationSection` 组件
- 新增 5 个详细标签页：
  - **High-Speed Serial**：层叠设计→板材选型→S 参数评估→AMI 眼图仿真，支持 224G PAM4
  - **DDRx Simulation**：拓扑规划→时序预算→SI 仿真→串扰分析，覆盖 DDR3~DDR5/LPDDR5
  - **PI Simulation**：IR-drop→PDN 阻抗→平面谐振→电热协同仿真
  - **EMC Simulation**：辐射发射→传导干扰→ESD 防护→整改验证，符合 FCC/CE/CISPR
  - **Thermal Simulation**：热源建模→散热路径→温度场仿真→散热优化，支持 >100W/cm²
- 每个标签含：仿真目标、关键难点卡片、4 步工作流（可点击切换详细说明）、技术规格表
- 全面支持中英文切换

---

## v 6ecfc7b8 — 2026-06-17
**项目初始化 — 网站首次上线**

- 完成 PCBforth 外贸网站完整搭建，包含：
  - 深蓝侧边栏导航 + 白色内容区布局
  - Hero 区：大标题 + 统计数字动画 + 服务快捷入口
  - About Us：公司介绍 + 合作伙伴 Logo 区
  - 6 大服务板块：原理图设计、PCB Layout、BOM 元器件、仿真分析、PCB 制板、SMT 一站式
  - PCB 产品画廊：PCB / 半导体测试板 / FPC 三类产品卡片（悬停展开规格）
  - 合作案例（Cases）板块
  - 联系我们（Contact）板块：表单 + 联系方式
  - 中英双语切换（EN / 中文）
  - 全站 Framer Motion 入场动画
  - 响应式设计，支持移动端

---

*每次发布前请执行 `pnpm build` 验证构建无报错，再点击 Management UI 中的 Publish 按钮发布。*
