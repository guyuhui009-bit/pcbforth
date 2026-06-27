# PCBforth Static Assets Manifest

> 本文档列出网站所有静态图片资源，供 AI 工具、自动化脚本及开发者调用时参考。
> 所有图片通过 Manus CDN 提供服务，在代码中以 `/manus-storage/<filename>` 路径引用。
> 原始文件存储于 `static-assets/` 目录（本仓库根目录下）。

---

## 命名规范

| 规则 | 说明 |
|------|------|
| 全小写 | 所有文件名均为小写字母 |
| 连字符分隔 | 单词间使用 `-` 分隔，不使用空格或下划线（仿真图除外） |
| 类别前缀 | `case-` 案例图、`sim-` 仿真图、`semi-` 半导体测试图、`service-` 服务图 |
| 格式优先级 | WebP（最优）> JPG > PNG；同名文件优先使用 `.webp` 版本 |

---

## 根目录图片（主要页面用图）

| 文件名 | 大小 | 用途说明 |
|--------|------|----------|
| `hero-office.jpg` | 4.5M | 首页 Hero 背景图（工程师办公室） |
| `schematic-design.jpg` | 4.4M | 原理图设计服务页主图 |
| `pcb-factory.jpg` | 5.1M | PCB 工厂制造环境图 |
| `smt-assembly.jpg` | 4.7M | SMT 贴装工艺图 |
| `smt-factory.jpg` | 4.9M | SMT 工厂全景图 |
| `pcb-layout.jpg` | 5.1M | PCB Layout 设计图（大图） |
| `pcb-layout-new.jpg` | 872K | PCB Layout 设计图（优化版） |
| `pcb-closeup.jpg` | 5.6M | PCB 板近景特写 |
| `pcb-design-work.jpg` | 5.1M | PCB 设计工作场景 |
| `pcb-design-hero.jpg` | 56K | PCB 设计页 Hero 图（小图） |
| `bom-components.jpg` | 5.9M | BOM 元器件选型图 |
| `pcb-board-clean.jpg` | 472K | 清洁 PCB 板图 |
| `pcb-board-bg.webp` | 96K | PCB 板背景纹理图 |
| `industrial-board.jpg` | 616K | 工业控制板图 |
| `pcbforth-logo.png` | 3.0M | PCBforth 品牌 Logo（高清版） |
| `pcbforth-logo_original.png` | 2.4M | PCBforth 品牌 Logo（原始版） |

---

## PCB 产品图（产品展示区）

| 文件名 | 大小 | 用途说明 |
|--------|------|----------|
| `pcb-optical-module.png` | 56K | 光模块 PCB（PNG 版） |
| `pcb-optical-module.webp` | 40K | 光模块 PCB（WebP 版，推荐） |
| `pcb-5g-trx.png` | 112K | 5G 收发器 PCB（PNG 版） |
| `pcb-5g-trx.webp` | 40K | 5G 收发器 PCB（WebP 版，推荐） |
| `pcb-server-board.png` | 144K | 服务器主板 PCB |
| `pcb-medical-device.png` | 140K | 医疗设备 PCB |
| `pcb-dac-converter.png` | 72K | DAC 转换器 PCB |
| `pcb-microwave-stepped.png` | 68K | 微波阶梯阻抗 PCB（PNG 版） |
| `pcb-microwave-stepped.webp` | 48K | 微波阶梯阻抗 PCB（WebP 版，推荐） |

---

## FPC / 半导体测试板图

| 文件名 | 大小 | 用途说明 |
|--------|------|----------|
| `fpc-flex.jpg` | 12K | FPC 柔性板图 |
| `fpc-rigid-flex.jpg` | 20K | 刚挠结合板图 |
| `semi-bib.png` | 20K | 半导体 BIB 测试板 |
| `semi-interposer.png` | 24K | 半导体 Interposer 测试板 |
| `semi-load-board.png` | 64K | 半导体 Load Board 测试板 |
| `semi-probe-card.png` | 28K | 半导体 Probe Card 测试板 |

---

## 合作案例图（`cases/` 目录）

| 文件名 | 大小 | 用途说明 |
|--------|------|----------|
| `cases/case-pcb-5g-base.webp` | 120K | 5G 基站 PCB 案例 |
| `cases/case-pcb-industrial.jpg` | 220K | 工业控制 PCB 案例 |
| `cases/case-pcb-laptop.jpg` | 100K | 笔记本主板 PCB 案例 |
| `cases/case-pcb-server.jpg` | 848K | 服务器 PCB 案例 |
| `cases/case-pcba-consumer.jpg` | 212K | 消费电子 PCBA 案例 |
| `cases/case-pcba-industrial.jpg` | 68K | 工业 PCBA 案例 |
| `cases/case-pcba-medical.webp` | 28K | 医疗 PCBA 案例 |
| `cases/case-si-ddr5.jpg` | 32K | DDR5 信号完整性案例 |
| `cases/case-si-eye-diagram.png` | 68K | 眼图信号完整性案例 |
| `cases/case-si-pcie.jpg` | 60K | PCIe 信号完整性案例 |

---

## 服务页图片（`service-imgs/` 目录）

| 文件名 | 大小 | 用途说明 |
|--------|------|----------|
| `service-imgs/schematic.jpg` | 120K | 原理图设计服务图 |
| `service-imgs/pcb-layout.jpg` | 176K | PCB Layout 服务图 |
| `service-imgs/bom-parts.jpg` | 212K | BOM 元器件服务图 |
| `service-imgs/pcb-fab.jpg` | 48K | PCB 制板服务图 |
| `service-imgs/smt-line.jpg` | 48K | SMT 贴装服务图 |

---

## 仿真分析图（`sim/` 目录）

> 文件名中使用下划线（`_`）分隔，与其他目录风格略有不同，保持原始命名。

| 文件名 | 大小 | 用途说明 |
|--------|------|----------|
| `sim/sim_highspeed_sparams.png` | 28K | 高速信号 S 参数（插入损耗/回波损耗） |
| `sim/sim_highspeed_eye.jpg` | 60K | 高速串行眼图仿真（PAM4） |
| `sim/sim_ddr_timing.jpg` | 76K | DDR3 时序仿真分析 |
| `sim/sim_emc_cst.png` | 340K | EMC 辐射仿真（CST） |
| `sim/sim_pi_irdrop.png` | 64K | 电源完整性 IR Drop 仿真 |
| `sim/sim_pi_pdn.png` | 28K | PDN 电源分配网络仿真 |
| `sim/sim_thermal_temp.png` | 420K | 热仿真温度分布图 |

---

## 合作伙伴 Logo（`logos/` 目录）

> 每个品牌提供 PNG（位图）和 SVG（矢量）两种格式，推荐使用 SVG。

| 品牌 | PNG 文件 | SVG 文件 |
|------|----------|----------|
| 华为 Huawei | `logos/huawei.png` | `logos/huawei.svg` |
| 大疆 DJI | `logos/dji.png` | `logos/dji.svg` |
| 比亚迪 BYD | `logos/byd.png` | `logos/byd.svg` |
| 富士康 Foxconn | `logos/foxconn.png` | `logos/foxconn.svg` |
| 海康威视 Hikvision | `logos/hikvision.png` | `logos/hikvision.svg` |
| 联想 Lenovo | `logos/lenovo.png` | `logos/lenovo.svg` |
| 小米 Xiaomi | `logos/xiaomi.png` | `logos/xiaomi.svg` |
| OPPO | `logos/oppo.png` | `logos/oppo.svg` |

---

## CDN URL 映射（代码中的实际引用路径）

以下为代码中使用的 `/manus-storage/` CDN 路径与本地文件的对应关系：

| CDN 路径（代码中引用） | 对应本地文件 |
|------------------------|--------------|
| `/manus-storage/hero-office_047863ed.webp` | `hero-office.jpg`（CDN 自动转 WebP） |
| `/manus-storage/schematic-design_7a529f76.webp` | `schematic-design.jpg` |
| `/manus-storage/pcb-factory_f5af8ff9.webp` | `pcb-factory.jpg` |
| `/manus-storage/smt-assembly_6cba567b.webp` | `smt-assembly.jpg` |
| `/manus-storage/pcb-layout-new_a89a07bb.jpg` | `pcb-layout-new.jpg` |
| `/manus-storage/bom-components_84ef3017.webp` | `bom-components.jpg` |
| `/manus-storage/pcb-board-clean_d0418efd.webp` | `pcb-board-clean.jpg` |
| `/manus-storage/industrial-board_345365b4.jpg` | `industrial-board.jpg` |
| `/manus-storage/pcb-design-hero_8ddb0a66.jpg` | `pcb-design-hero.jpg` |
| `/manus-storage/pcb-optical-module_53700548.webp` | `pcb-optical-module.webp` |
| `/manus-storage/pcb-5g-trx_95516967.webp` | `pcb-5g-trx.webp` |
| `/manus-storage/pcb-server-board_4290055b.webp` | `pcb-server-board.png` |
| `/manus-storage/pcb-medical-device_b9bb6a04.webp` | `pcb-medical-device.png` |
| `/manus-storage/pcb-dac-converter_f1d17eda.webp` | `pcb-dac-converter.png` |
| `/manus-storage/pcb-microwave-stepped_dfbb47f2.webp` | `pcb-microwave-stepped.webp` |
| `/manus-storage/fpc-flex_57f88286.webp` | `fpc-flex.jpg` |
| `/manus-storage/fpc-rigid-flex_65aa4365.webp` | `fpc-rigid-flex.jpg` |
| `/manus-storage/semi-bib_dd3b2ef8.webp` | `semi-bib.png` |
| `/manus-storage/semi-interposer_6ca9b98e.webp` | `semi-interposer.png` |
| `/manus-storage/semi-load-board_482bb926.webp` | `semi-load-board.png` |
| `/manus-storage/semi-probe-card_6eab6e57.webp` | `semi-probe-card.png` |
| `/manus-storage/sim-highspeed-sparams_b7a1f213.webp` | `sim/sim_highspeed_sparams.png` |
| `/manus-storage/sim-highspeed-eye_10ae1a89.webp` | `sim/sim_highspeed_eye.jpg` |
| `/manus-storage/sim-ddr-timing_9c550513.webp` | `sim/sim_ddr_timing.jpg` |
| `/manus-storage/sim-emc-cst_27299993.webp` | `sim/sim_emc_cst.png` |
| `/manus-storage/sim-pi-irdrop_5aada9a3.webp` | `sim/sim_pi_irdrop.png` |
| `/manus-storage/sim-pi-pdn_da8d0d7f.webp` | `sim/sim_pi_pdn.png` |
| `/manus-storage/sim-thermal-temp_27fe9115.webp` | `sim/sim_thermal_temp.png` |
| `/manus-storage/fpga-board_6b0dca4c.webp` | *(AI 生成图，无本地文件)* |
| `/manus-storage/highspeed-adc-board_274bb725.webp` | *(AI 生成图，无本地文件)* |
| `/manus-storage/purley-server_fca61a7b.webp` | *(AI 生成图，无本地文件)* |
| `/manus-storage/medical-board_6514e803.webp` | *(AI 生成图，无本地文件)* |
| `/manus-storage/desktop-pc-1_4b8e0740.jpg` | *(AI 生成图，无本地文件)* |
| `/manus-storage/desktop-pc-2_12658cac.webp` | *(AI 生成图，无本地文件)* |

---

*最后更新：2026-06-27*
