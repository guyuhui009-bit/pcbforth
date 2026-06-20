import { Zap } from "lucide-react";
import { ServicePageLayout } from "./_ServicePageLayout";

export default function SignalIntegrity() {
  return (
    <ServicePageLayout
      accentColor="#7C3AED"
      accentBg="#F3EEFF"
      icon={<Zap size={28} />}
      titleZh="信号完整性分析"
      titleEn="Signal Integrity Analysis"
      subtitleZh="覆盖高速串行（224G PAM4）、DDR3~DDR5 内存接口，提供 S 参数分析、眼图仿真及完整整改建议报告，在制板前解决信号质量问题。"
      subtitleEn="Covering high-speed serial (224G PAM4), DDR3~DDR5 memory interfaces — S-parameter analysis, eye diagram simulation, and complete fix reports to resolve signal quality issues before fabrication."
      descZh="信号完整性（SI）分析是高速 PCB 设计的核心环节。随着信号速率不断提升（PCIe 5.0、224G PAM4、DDR5），传统的经验设计方法已无法保证信号质量，必须借助仿真工具进行量化分析。PCBforth 使用 Ansys SIwave、HyperLynx、HSPICE 等业界主流仿真工具，提供从层叠设计、板材选型到 S 参数通道评估、有源眼图仿真的完整 SI 分析服务。每个项目交付详细的仿真报告，包含问题识别、根因分析和具体整改建议，帮助您在制板前解决所有信号质量隐患。"
      descEn="Signal Integrity (SI) analysis is the core of high-speed PCB design. As signal rates continue to increase (PCIe 5.0, 224G PAM4, DDR5), traditional empirical design methods can no longer guarantee signal quality — quantitative simulation analysis is essential. PCBforth uses Ansys SIwave, HyperLynx, HSPICE, and other industry-leading simulation tools to provide complete SI analysis services from stackup design and material selection to S-parameter channel evaluation and active eye diagram simulation."
      capabilitiesZh={[
        "高速串行：224G PAM4 / 112G / 56G",
        "PCIe 5.0 / 4.0 通道分析",
        "DDR3 / DDR4 / DDR5 / LPDDR5",
        "S 参数插入损耗/回波损耗",
        "Hspice / AMI 有源眼图仿真",
        "时序裕量分析（建立/保持时间）",
        "串扰分析与间距建议",
        "板材选型建议（FR4/Rogers/Megtron）",
      ]}
      capabilitiesEn={[
        "High-speed serial: 224G PAM4 / 112G / 56G",
        "PCIe 5.0 / 4.0 channel analysis",
        "DDR3 / DDR4 / DDR5 / LPDDR5",
        "S-parameter insertion/return loss",
        "Hspice / AMI active eye diagram sim",
        "Timing margin analysis (setup/hold)",
        "Crosstalk analysis & spacing recommendations",
        "Material selection (FR4 / Rogers / Megtron)",
      ]}
      specs={[
        { labelZh: "仿真工具", labelEn: "Simulation Tools", value: "Ansys SIwave / HyperLynx / HSPICE" },
        { labelZh: "最高速率", labelEn: "Max Data Rate", value: "224G PAM4" },
        { labelZh: "频率范围", labelEn: "Frequency Range", value: "DC ~ 100GHz" },
        { labelZh: "支持接口", labelEn: "Supported Interfaces", value: "PCIe 5.0 / DDR5 / USB4 / 224G PAM4" },
        { labelZh: "交付物", labelEn: "Deliverables", value: "S-param + Eye Diagram + Fix Report" },
        { labelZh: "交付周期", labelEn: "Lead Time", value: "5 ~ 10 business days" },
      ]}
      workflow={[
        {
          titleZh: "层叠设计",
          titleEn: "Stackup Design",
          descZh: "根据实际情况规划层叠，综合考虑半固化片/芯板型号、厚度、含胶量等，提供阻抗控制和布线层规划建议，为后续仿真建立准确的物理模型。",
          descEn: "Plan the stackup based on actual requirements, considering prepreg/core type, thickness, and resin content. Provide impedance control and routing layer recommendations, establishing an accurate physical model for subsequent simulation.",
        },
        {
          titleZh: "板材选型",
          titleEn: "Material Selection",
          descZh: "根据系统信号种类及通道情况，合理选择板材（FR4/Rogers/Megtron），在保证信号质量的前提下，综合考虑成本和加工难度，提供最优选型建议。",
          descEn: "Select appropriate materials (FR4/Rogers/Megtron) based on signal type and channel conditions. Balance signal quality, cost, and manufacturing complexity to provide optimal material recommendations.",
        },
        {
          titleZh: "S 参数无源通道评估",
          titleEn: "S-Parameter Passive Channel Evaluation",
          descZh: "通过 S 参数判断通道是否符合协议标准，对插入损耗（IL）、回波损耗（RL）、近端串扰（NEXT）、远端串扰（FEXT）等指标进行详细分析，定位通道瓶颈。",
          descEn: "Evaluate channel compliance via S-parameters — analyze insertion loss (IL), return loss (RL), near-end crosstalk (NEXT), and far-end crosstalk (FEXT) to identify channel bottlenecks.",
        },
        {
          titleZh: "有源眼图仿真",
          titleEn: "Active Eye Diagram Simulation",
          descZh: "加入特定速率码型和 IBIS/SPICE 模型进行眼图仿真，通过眼高、眼宽、抖动等指标衡量信号质量，与协议掩模对比，提供量化的整改建议。",
          descEn: "Run eye diagram simulation with specific rate patterns and IBIS/SPICE models. Evaluate signal quality through eye height, eye width, and jitter metrics against protocol masks, and provide quantified fix recommendations.",
        },
        {
          titleZh: "报告交付与整改支持",
          titleEn: "Report Delivery & Fix Support",
          descZh: "输出完整的 SI 分析报告，包含仿真截图、数据表格、问题清单和具体整改建议（调整布线、更换板材、增加均衡器等），并提供整改后的验证仿真。",
          descEn: "Output a complete SI analysis report including simulation screenshots, data tables, issue list, and specific fix recommendations (routing adjustments, material changes, equalizer additions). Provide verification simulation after fixes.",
        },
      ]}
      faqZh={[
        {
          q: "什么情况下需要进行 SI 仿真？",
          a: "当信号速率超过 1Gbps 时，建议进行 SI 仿真。对于 PCIe 4.0/5.0、DDR4/DDR5、224G PAM4 等高速接口，SI 仿真是必不可少的设计验证步骤。",
        },
        {
          q: "SI 仿真能在 Layout 之前进行吗？",
          a: "可以。我们建议在 Layout 之前进行预仿真（Pre-layout Simulation），评估层叠和板材方案；Layout 完成后再进行后仿真（Post-layout Simulation）验证实际布线效果。",
        },
        {
          q: "仿真报告里会有哪些内容？",
          a: "报告包含：仿真模型说明、S 参数曲线（IL/RL/NEXT/FEXT）、眼图截图、时序裕量计算、问题清单及整改建议。所有数据均与协议规范对比，清晰标注合格/不合格项。",
        },
      ]}
      faqEn={[
        {
          q: "When is SI simulation necessary?",
          a: "SI simulation is recommended when signal rates exceed 1Gbps. For high-speed interfaces like PCIe 4.0/5.0, DDR4/DDR5, and 224G PAM4, SI simulation is an essential design verification step.",
        },
        {
          q: "Can SI simulation be performed before PCB layout?",
          a: "Yes. We recommend pre-layout simulation to evaluate stackup and material options, followed by post-layout simulation after layout completion to verify actual routing performance.",
        },
        {
          q: "What does the simulation report include?",
          a: "The report includes: simulation model description, S-parameter curves (IL/RL/NEXT/FEXT), eye diagram screenshots, timing margin calculations, issue list, and fix recommendations — all compared against protocol specifications with clear pass/fail indicators.",
        },
      ]}
    />
  );
}
