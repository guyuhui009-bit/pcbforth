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
