import { Layers } from "lucide-react";
import { ServicePageLayout } from "./_ServicePageLayout";

export default function PcbLayout() {
  return (
    <ServicePageLayout
      accentColor="#0891B2"
      accentBg="#E0F7FA"
      icon={<Layers size={28} />}
      titleZh="PCB Layout"
      titleEn="PCB Layout"
      subtitleZh="支持最高 40 层 HDI 设计，最小线宽/间距 2mil/2mil，覆盖高速信号、差分对、阻抗控制等高端布线需求，深度结合 SI/PI 仿真结果。"
      subtitleEn="Up to 40-layer HDI design, 2mil/2mil min trace/space, covering high-speed signals, differential pairs, and impedance control — deeply integrated with SI/PI simulation results."
      descZh="PCBforth 的 PCB Layout 服务专注于高速、高密度、高可靠性设计。我们的布局工程师不仅具备深厚的 EDA 工具操作经验，更理解信号完整性、电源完整性和 EMC 的底层原理，能够在布局阶段主动规避设计风险。服务支持 Altium Designer、Cadence Allegro、Mentor PADS 等主流工具，覆盖 HDI 盲埋孔、背钻、任意层互联等高端工艺，适用于服务器主板、5G 通信设备、光模块、医疗设备等复杂产品。每个项目交付前均进行完整的 DFM 检查，确保制造可行性。"
      descEn="PCBforth's PCB Layout service focuses on high-speed, high-density, and high-reliability designs. Our layout engineers have deep EDA tool expertise and understand the underlying principles of signal integrity, power integrity, and EMC — proactively avoiding design risks at the layout stage. Supported tools: Altium Designer, Cadence Allegro, Mentor PADS. Covers HDI blind/buried vias, back-drilling, and any-layer interconnects for server motherboards, 5G equipment, optical modules, and medical devices."
      capabilitiesZh={[
        "最高 40 层 HDI 设计",
        "最小线宽/间距 2mil/2mil",
        "最小钻孔 0.1mm 激光孔",
        "差分对等长布线",
        "阻抗控制 ±5%",
        "盲埋孔 / 背钻工艺",
        "DDR5 / PCIe 5.0 高速布线",
        "DFM 检查随路交付",
      ]}
      capabilitiesEn={[
        "Up to 40-layer HDI design",
        "Min trace/space 2mil/2mil",
        "Min drill 0.1mm laser via",
        "Matched differential pair routing",
        "Impedance control ±5%",
        "Blind/buried via & back-drill",
        "DDR5 / PCIe 5.0 high-speed routing",
        "DFM check included",
      ]}
      specs={[
        { labelZh: "最大层数", labelEn: "Max Layers", value: "40 layers" },
        { labelZh: "最小线宽/间距", labelEn: "Min Trace/Space", value: "2mil / 2mil" },
        { labelZh: "最小钻孔", labelEn: "Min Via Drill", value: "0.1mm (laser)" },
        { labelZh: "板厚范围", labelEn: "Board Thickness", value: "0.4mm ~ 6.0mm" },
        { labelZh: "阻抗精度", labelEn: "Impedance Accuracy", value: "±5%" },
        { labelZh: "支持工具", labelEn: "Supported Tools", value: "Altium / Cadence Allegro / PADS" },
        { labelZh: "交付周期", labelEn: "Lead Time", value: "5 ~ 15 business days" },
        { labelZh: "交付物", labelEn: "Deliverables", value: "Gerber + ODB++ + DFM Report" },
      ]}
      workflow={[
        {
          titleZh: "需求确认与层叠设计",
          titleEn: "Requirements & Stackup Design",
          descZh: "与客户确认信号速率、阻抗要求、板厚约束等参数，规划最优层叠结构（Stackup），综合考虑信号层、电源层、参考平面的分配，为后续布线奠定基础。",
          descEn: "Confirm signal rate, impedance requirements, and board thickness constraints with the client. Plan the optimal stackup structure, considering signal layer, power layer, and reference plane allocation as the foundation for routing.",
        },
        {
          titleZh: "元器件布局",
          titleEn: "Component Placement",
          descZh: "按照信号流向、热管理需求和 EMC 原则进行器件布局，关键器件（晶振、电源模块、高速芯片）优先定位，确保布线路径最优、散热路径畅通。",
          descEn: "Place components according to signal flow, thermal management requirements, and EMC principles. Prioritize critical components (crystal oscillators, power modules, high-speed chips) to ensure optimal routing paths and thermal dissipation.",
        },
        {
          titleZh: "高速信号布线",
          titleEn: "High-Speed Signal Routing",
          descZh: "对差分对、时钟信号、高速总线进行等长布线和阻抗控制，遵循 3W 规则、20H 规则等 EMC 设计准则，结合 SI 仿真结果优化关键信号路径。",
          descEn: "Apply length matching and impedance control to differential pairs, clock signals, and high-speed buses. Follow EMC design rules (3W rule, 20H rule) and optimize critical signal paths based on SI simulation results.",
        },
        {
          titleZh: "电源与地平面处理",
          titleEn: "Power & Ground Plane Processing",
          descZh: "合理分割电源平面和地平面，优化去耦电容摆放，处理电源岛和地岛的连接，确保 PDN 阻抗满足设计要求，避免地弹和电源噪声问题。",
          descEn: "Properly partition power and ground planes, optimize decoupling capacitor placement, handle power island and ground island connections, and ensure PDN impedance meets design requirements to avoid ground bounce and power noise.",
        },
        {
          titleZh: "DFM 检查与交付",
          titleEn: "DFM Check & Delivery",
          descZh: "完成布线后进行全面的 DFM（制造可行性）检查，包括最小间距、孔径、丝印冲突等，输出 Gerber 文件、ODB++ 文件和 DFM 报告，确保制造顺利进行。",
          descEn: "After routing, perform a comprehensive DFM (Design for Manufacturability) check including minimum spacing, drill sizes, and silkscreen conflicts. Output Gerber files, ODB++ files, and a DFM report to ensure smooth manufacturing.",
        },
      ]}
      faqZh={[
        {
          q: "PCB Layout 和原理图设计可以同时委托给你们吗？",
          a: "可以，我们提供从原理图设计到 PCB Layout 的一站式服务，两个环节由同一工程团队负责，信息传递更顺畅，设计质量更有保障。",
        },
        {
          q: "你们能处理多少层的 HDI 设计？",
          a: "我们支持最高 40 层的 HDI 设计，包括盲孔、埋孔、任意层互联（ELIC）等高端工艺，适用于服务器主板、5G 设备等高密度产品。",
        },
        {
          q: "Layout 完成后会提供 DFM 报告吗？",
          a: "是的，每个 Layout 项目交付时均包含完整的 DFM 检查报告，帮助您在制板前发现并解决潜在的制造问题，降低首板返工率。",
        },
      ]}
      faqEn={[
        {
          q: "Can we commission both schematic design and PCB layout from you?",
          a: "Yes, we offer a one-stop service from schematic design to PCB layout. Both stages are handled by the same engineering team, ensuring smoother information transfer and higher design quality.",
        },
        {
          q: "How many layers of HDI design can you handle?",
          a: "We support up to 40-layer HDI designs, including blind vias, buried vias, and any-layer interconnects (ELIC), suitable for high-density products like server motherboards and 5G equipment.",
        },
        {
          q: "Will you provide a DFM report after layout?",
          a: "Yes, every layout project delivery includes a complete DFM check report, helping you identify and resolve potential manufacturing issues before fabrication to reduce first-pass rework rates.",
        },
      ]}
    />
  );
}
