# PCBforth TODO

- [x] 首页 PCB 外贸网站基础布局（侧边栏导航 + 蓝白主题）
- [x] 多语言支持（中文 / 英文切换）
- [x] Hero 区域（PCB 背景图 + 统计数据动画）
- [x] 关于我们 / 服务介绍各板块（原理图、Layout、BOM、仿真、制板、SMT）
- [x] 仿真分析详细展示（5 个仿真类型 + 步骤流程 + 仿真截图）
- [x] 制板工艺产品画廊（PCB / 半导体测试板 / FPC 三类产品）
- [x] 合作案例 + 合作伙伴 + 应用领域
- [x] 联系我们（表单 + 多邮箱 + 地址）
- [x] 文件上传报价功能（/quote 页面）
  - [x] 数据库 schema：quote_requests + quote_files 表
  - [x] 后端 tRPC 接口：uploadFile / submit / list / get / updateStatus
  - [x] 前端报价页面：文件拖拽上传 + PCB 规格表单 + 服务选择
  - [x] 侧边栏 "立即获取报价" 按钮
  - [x] Hero CTA 按钮链接到 /quote
  - [x] 提交成功页面（含报价编号）
  - [x] 管理员通知（提交后自动通知站长）
  - [x] vitest 单元测试（6 个测试全部通过）
- [x] Design Services 独立一级菜单板块
  - [x] 侧边栏添加 "PCB Design Services" 可折叠菜单（含7个子项）
  - [x] Design Services 总览页（/design-services）：差异化定位 + 7张服务卡片
  - [x] Schematic Design 子页（/design-services/schematic）
  - [x] PCB Layout 子页（/design-services/pcb-layout）
  - [x] Signal Integrity Analysis 子页（/design-services/si）
  - [x] Power Integrity Analysis 子页（/design-services/pi）
  - [x] EMC Design 子页（/design-services/emc）
  - [x] DFM Review 子页（/design-services/dfm）
  - [x] Component Selection 子页（/design-services/components）
  - [x] 共享 ServicePageLayout 组件（Header 面包屑 + Hero + 服务说明 + 流程 + 规格表 + FAQ + CTA）
  - [x] App.tsx 注册所有 Design Services 路由

## 首页全面改版（2026-06-22）

- [x] P1: 重构 Hero 区 — 主标题改为 "Professional PCB Design & Hardware Engineering Services"，副标题 "From Concept to Production"，服务标签行，双 CTA 按钮
- [x] P2: 新增 "Why PCBFORTH" 模块 — 4张优势卡片 + 能力标签列表
- [x] P3: 新增 "How We Work" 9步流程模块
- [x] P4: 新增 "Featured Projects" 案例模块 — 3个项目卡片含规格标签
- [x] P5: 新增 "Engineering Capabilities" 能力展示 — 三列
- [x] P6: 新增 "Tools We Use" 工具展示
- [x] P7: 更新 index.html meta SEO 标签
- [x] P8: 新增 "Free PCB Design Review" Lead Magnet 模块
- [x] P9: 新增固定右下角联系浮窗（WhatsApp / Email / WeChat）+ "Response within 12 hours"

## PCB 作品社区展示平台（2026-06-23）

- [x] 数据库 schema：pcb_projects 表（id, userId, title, description, tags, imageUrl, imageKey, layers, software, createdAt）
- [x] 数据库 schema：pcb_likes 表（id, projectId, userId, createdAt）
- [x] 数据库 schema：pcb_comments 表（id, projectId, userId, content, createdAt）
- [x] 运行 pnpm db:push 推送迁移
- [x] tRPC 接口：projects.list（分页）、projects.create（上传图片+信息）、projects.like/unlike、projects.getComments、projects.addComment
- [x] 前端页面 /community：作品瀑布流/网格展示
- [x] 前端：上传表单（图片上传 + 标题/描述/标签/层数/软件）
- [x] 前端：点赞按钮（乐观更新）
- [x] 前端：评论列表与评论输入框
- [x] 首页精选项目区替换为社区入口（展示最新 3 条 + 查看全部按钮）
- [x] 导航栏新增 Community 菜单项

## 图片更新与代码优化（2026-06-24）

- [x] Phase 1: index.html 优化（favicon SVG inline、SEO tags、preload、JSON-LD、移除 Umami）
- [x] Phase 2: 代码架构改进（theme.ts、PcbLogo.tsx、useCountUp.ts、OptimizedImage.tsx、App.tsx React.lazy）
- [x] Phase 3: 案例图片更新 — 8张新图复制到 public/images/cases/
  - [x] case1-1 → highspeed-adc-board.webp（高速数据采集板）
  - [x] case1-2 → purley-server.webp（Purley服务器板）
  - [x] case1-3 → fpga-board.webp（FPGA开发板）
  - [x] case1-5 → industrial-board.jpg（工业控制板）
  - [x] case1-6 → medical-board.jpg（医疗设备主板）
  - [x] case1-7 → desktop-pc-1.jpg + hoverImg: desktop-pc-2.jpg（超薄笔记本主板，悬停切图）
  - [x] PCB_LAYOUT_IMG → /images/pcb-layout-new.jpg
- [x] Hero 第三个 CTA 按钮 "Request PCB Fab Quote"（绿色 #059669）
- [x] 案例卡片交互升级：
  - [x] 点击图片弹出灯箱（Lightbox 组件，支持 ESC 关闭）
  - [x] 悬停放大镜提示 overlay
  - [x] 双图卡片显示"悬停切图/Hover to switch"标签
  - [x] 移除旧版 CaseCard 重复函数定义
