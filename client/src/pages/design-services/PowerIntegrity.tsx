import { Cpu } from "lucide-react";
import { ServicePageLayout } from "./_ServicePageLayout";

export default function PowerIntegrity() {
  return (
    <ServicePageLayout
      accentColor="#D97706"
      accentBg="#FFF8E1"
      icon={<Cpu size={28} />}
      titleZh="电源完整性分析"
      titleEn="Power Integrity Analysis"
      subtitleZh="IR-Drop 仿真、PDN 阻抗分析、平面谐振评估及电热协同仿真，优化去耦电容方案，确保电源供电网络在高速数字系统中稳定可靠。"
      subtitleEn="IR-Drop simulation, PDN impedance analysis, plane resonance evaluation, and electrothermal co-simulation — optimizing decoupling capacitor placement for stable power delivery in high-speed digital systems."
      descZh="电源完整性（PI）是高速数字系统设计中最容易被忽视却影响最大的环节。电源噪声、IR-Drop 超标和平面谐振会直接导致系统不稳定、误码率升高甚至硬件损坏。PCBforth 使用 Ansys SIwave、PowerSI 等专业工具，提供从 DC IR-Drop 分析到 PDN 阻抗优化的完整 PI 仿真服务。我们的电热协同仿真能够同时分析电源分布和温度分布，帮助您在设计阶段发现并解决电源完整性问题，避免昂贵的硬件返工。"
      descEn="Power Integrity (PI) is the most overlooked yet most impactful aspect of high-speed digital system design. Power noise, IR-Drop violations, and plane resonance directly cause system instability, increased BER, and even hardware damage. PCBforth uses Ansys SIwave, PowerSI, and other professional tools to provide complete PI simulation services from DC IR-Drop analysis to PDN impedance optimization. Our electrothermal co-simulation simultaneously analyzes power distribution and temperature distribution."
      capabilitiesZh={[
        "DC IR-Drop 直流压降仿真",
        "PDN 阻抗频率特性分析",
        "去耦电容方案优化",
        "平面谐振仿真与评估",
        "电热协同仿真（焦耳热）",
        "电流密度与载流能力分析",
        "电源域划分建议",
        "VRM 反馈点位置优化",
      ]}
      capabilitiesEn={[
        "DC IR-Drop voltage drop simulation",
        "PDN impedance frequency analysis",
        "Decoupling capacitor optimization",
        "Plane resonance simulation & evaluation",
        "Electrothermal co-simulation (Joule heat)",
        "Current density & current-carrying analysis",
        "Power domain partitioning recommendations",
        "VRM feedback point location optimization",
      ]}
      specs={[
        { labelZh: "仿真工具", labelEn: "Simulation Tools", value: "Ansys SIwave / PowerSI / Icepak" },
        { labelZh: "分析类型", labelEn: "Analysis Types", value: "IR-Drop / PDN Impedance / Thermal" },
        { labelZh: "频率范围", labelEn: "Frequency Range", value: "DC ~ 10GHz" },
        { labelZh: "热分析类型", labelEn: "Thermal Analysis", value: "Steady-state / Transient" },
        { labelZh: "交付物", labelEn: "Deliverables", value: "IR-Drop Map + PDN Curve + Optimization Plan" },
        { labelZh: "交付周期", labelEn: "Lead Time", value: "5 ~ 10 business days" },
      ]}
      workflow={[
        {
          titleZh: "IR-Drop 仿真",
          titleEn: "IR-Drop Simulation",
          descZh: "确定电源压降是否符合要求，仿真分析电流密度分布和铜箔载流能力，定位最佳 VRM 反馈点位置，输出 IR-Drop 热力图，直观显示压降分布。",
          descEn: "Verify power voltage drop compliance, analyze current density distribution and copper current-carrying capacity, locate optimal VRM feedback point, and output an IR-Drop heatmap showing voltage distribution.",
        },
        {
          titleZh: "PDN 阻抗分析",
          titleEn: "PDN Impedance Analysis",
          descZh: "分析电源供电网络（PDN）的阻抗频率特性，评估电源噪声与纹波，识别谐振峰，优化去耦电容的类型、容值和摆放位置，将 PDN 阻抗控制在目标阻抗以下。",
          descEn: "Analyze the PDN impedance frequency characteristics, evaluate power noise and ripple, identify resonance peaks, and optimize decoupling capacitor type, value, and placement to keep PDN impedance below the target impedance.",
        },
        {
          titleZh: "平面谐振分析",
          titleEn: "Plane Resonance Analysis",
          descZh: "基于 EMC 要求进行平面谐振仿真分析，评估电源/地平面的谐振频率和谐振强度，提供 PCB 设计优化建议（调整平面尺寸、增加去耦电容、添加吸波材料等）。",
          descEn: "Perform plane resonance simulation based on EMC requirements, evaluate resonance frequency and intensity of power/ground planes, and provide PCB design optimization recommendations (adjusting plane dimensions, adding decoupling capacitors, adding absorbing materials).",
        },
        {
          titleZh: "电热协同仿真",
          titleEn: "Electrothermal Co-Simulation",
          descZh: "协同分析静态焦耳热、导体电导率及器件功耗，仿真单板温度分布，识别热点区域，指导 PCB 散热设计（铜箔面积、过孔密度、散热焊盘等）。",
          descEn: "Co-analyze static Joule heat, conductor conductivity, and device power dissipation. Simulate board temperature distribution, identify hot spots, and guide PCB thermal design (copper area, via density, thermal pads).",
        },
        {
          titleZh: "优化方案与报告",
          titleEn: "Optimization Plan & Report",
          descZh: "基于仿真结果提供详细的优化方案，包括去耦电容选型表、PDN 阻抗曲线对比（优化前后）、IR-Drop 改善方案，并提供优化后的验证仿真结果。",
          descEn: "Provide a detailed optimization plan based on simulation results, including decoupling capacitor selection table, PDN impedance curve comparison (before/after optimization), IR-Drop improvement plan, and verification simulation results after optimization.",
        },
      ]}
      faqZh={[
        {
          q: "什么样的产品需要做 PI 仿真？",
          a: "高速数字系统（服务器、通信设备、FPGA 板卡）、电源密度较高的产品（AI 加速卡、GPU 板卡）以及对电源噪声敏感的产品（ADC/DAC 板卡、射频模块）都需要进行 PI 仿真。",
        },
        {
          q: "PI 仿真需要哪些输入文件？",
          a: "通常需要：PCB 设计文件（Gerber 或 ODB++）、原理图（用于确认电源域划分）、器件功耗数据（数据手册或实测值）、VRM 规格参数。",
        },
        {
          q: "去耦电容优化能节省多少成本？",
          a: "通过 PI 仿真优化去耦电容方案，通常可以减少 20%~40% 的去耦电容数量，在保证电源质量的前提下显著降低 BOM 成本。",
        },
      ]}
      faqEn={[
        {
          q: "What types of products need PI simulation?",
          a: "High-speed digital systems (servers, telecom equipment, FPGA boards), high power density products (AI accelerators, GPU boards), and power-noise-sensitive products (ADC/DAC boards, RF modules) all benefit from PI simulation.",
        },
        {
          q: "What input files are needed for PI simulation?",
          a: "Typically required: PCB design files (Gerber or ODB++), schematic (for power domain confirmation), device power dissipation data (datasheet or measured values), and VRM specifications.",
        },
        {
          q: "How much cost can decoupling capacitor optimization save?",
          a: "PI simulation-based decoupling optimization typically reduces the number of decoupling capacitors by 20%~40%, significantly lowering BOM cost while maintaining power quality.",
        },
      ]}
    />
  );
}
