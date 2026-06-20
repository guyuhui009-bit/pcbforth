import { Shield } from "lucide-react";
import { ServicePageLayout } from "./_ServicePageLayout";

export default function EmcDesign() {
  return (
    <ServicePageLayout
      accentColor="#DC2626"
      accentBg="#FEF2F2"
      icon={<Shield size={28} />}
      titleZh="EMC 设计"
      titleEn="EMC Design"
      subtitleZh="辐射发射仿真、传导干扰分析、ESD 防护设计，支持 FCC / CE / CISPR 标准，帮助您的产品在设计阶段解决 EMC 问题，一次性通过认证测试。"
      subtitleEn="Radiated emission simulation, conducted interference analysis, ESD protection design — supporting FCC / CE / CISPR standards to resolve EMC issues at the design stage and pass certification tests on the first attempt."
      descZh="EMC（电磁兼容性）问题是电子产品研发中最常见的认证失败原因之一。传统的 EMC 整改通常发生在产品样机阶段，成本高昂且周期漫长。PCBforth 的 EMC 设计服务将 EMC 分析前移到 PCB 设计阶段，使用 CST Studio Suite、Ansys HFSS 等专业仿真工具，在制板前识别和解决辐射发射、传导干扰和 ESD 防护等问题。我们的工程师熟悉 FCC Part 15、CE EN 55032、CISPR 32 等主要认证标准，能够提供针对性的设计优化建议，显著提高产品一次性通过认证测试的概率。"
      descEn="EMC (Electromagnetic Compatibility) issues are one of the most common causes of certification failure in electronics development. Traditional EMC remediation typically occurs at the prototype stage, which is costly and time-consuming. PCBforth's EMC design service moves EMC analysis to the PCB design stage, using CST Studio Suite, Ansys HFSS, and other professional simulation tools to identify and resolve radiated emission, conducted interference, and ESD protection issues before fabrication."
      capabilitiesZh={[
        "辐射发射仿真（FCC / CE / CISPR）",
        "传导干扰分析与滤波优化",
        "ESD 防护器件选型与布局",
        "ESD 放电路径优化",
        "共模 / 差模噪声分析",
        "PCB 层叠 EMC 优化",
        "屏蔽设计建议",
        "整改后验证仿真",
      ]}
      capabilitiesEn={[
        "Radiated emission simulation (FCC / CE / CISPR)",
        "Conducted interference analysis & filter optimization",
        "ESD protection device selection & placement",
        "ESD discharge path optimization",
        "Common-mode / differential-mode noise analysis",
        "PCB stackup EMC optimization",
        "Shielding design recommendations",
        "Post-fix verification simulation",
      ]}
      specs={[
        { labelZh: "仿真工具", labelEn: "Simulation Tools", value: "CST Studio Suite / Ansys HFSS" },
        { labelZh: "分析类型", labelEn: "Analysis Types", value: "Radiated / Conducted / ESD" },
        { labelZh: "支持标准", labelEn: "Supported Standards", value: "FCC Part 15 / CE EN 55032 / CISPR 32" },
        { labelZh: "频率范围", labelEn: "Frequency Range", value: "150kHz ~ 6GHz (radiated)" },
        { labelZh: "交付物", labelEn: "Deliverables", value: "EMC Simulation Report + Fix Recommendations" },
        { labelZh: "交付周期", labelEn: "Lead Time", value: "5 ~ 12 business days" },
      ]}
      workflow={[
        {
          titleZh: "辐射发射分析",
          titleEn: "Radiated Emission Analysis",
          descZh: "仿真 PCB 的辐射发射特性，识别主要辐射源（时钟信号、高速总线、电源纹波等），分析辐射路径，提供布线优化、屏蔽设计和滤波建议，确保满足 FCC/CE 标准限值。",
          descEn: "Simulate PCB radiated emission characteristics, identify major radiation sources (clock signals, high-speed buses, power ripple), analyze radiation paths, and provide routing optimization, shielding design, and filtering recommendations to meet FCC/CE standard limits.",
        },
        {
          titleZh: "传导干扰分析",
          titleEn: "Conducted Interference Analysis",
          descZh: "分析电源线和信号线上的传导干扰，评估共模和差模噪声水平，优化 EMI 滤波器设计（LC 滤波器、共模扼流圈、铁氧体磁珠），降低传导噪声至标准限值以下。",
          descEn: "Analyze conducted interference on power and signal lines, evaluate common-mode and differential-mode noise levels, optimize EMI filter design (LC filters, common-mode chokes, ferrite beads) to reduce conducted noise below standard limits.",
        },
        {
          titleZh: "ESD 防护设计",
          titleEn: "ESD Protection Design",
          descZh: "评估 ESD 保护器件（TVS、ESD 阵列）的选型和布局，优化 ESD 放电路径（保护器件靠近接口、低阻抗放电路径），保护关键器件免受 IEC 61000-4-2 规定的 ESD 冲击损伤。",
          descEn: "Evaluate ESD protection device (TVS, ESD array) selection and placement, optimize ESD discharge paths (protection devices near interfaces, low-impedance discharge paths) to protect critical components from ESD impacts per IEC 61000-4-2.",
        },
        {
          titleZh: "整改验证",
          titleEn: "Fix Verification",
          descZh: "对整改后的设计进行仿真验证，对比整改前后的辐射发射、传导干扰数据，确认 EMC 性能满足目标标准，输出完整的整改报告和验证数据。",
          descEn: "Verify the revised design through simulation, compare radiated emission and conducted interference data before and after fixes, confirm EMC performance meets target standards, and output a complete fix report with verification data.",
        },
      ]}
      faqZh={[
        {
          q: "EMC 仿真能完全替代实验室测试吗？",
          a: "不能完全替代，但可以大幅提高通过率。EMC 仿真帮助您在制板前发现和解决主要问题，减少实验室测试次数和整改成本。通常经过仿真优化的产品，实验室测试一次通过率可以从 30%~50% 提升到 80%~90%。",
        },
        {
          q: "你们支持哪些 EMC 认证标准？",
          a: "我们支持 FCC Part 15（美国）、CE EN 55032/EN 55035（欧盟）、CISPR 32/CISPR 35（国际）、GB/T 9254（中国）等主要认证标准，也可根据客户需求支持特定行业标准（如汽车 CISPR 25、医疗 IEC 60601-1-2）。",
        },
        {
          q: "PCB 设计阶段做 EMC 仿真需要提供哪些文件？",
          a: "需要提供：PCB 设计文件（Gerber 或 ODB++）、原理图（用于理解电路功能）、关键信号的频率和电平信息、产品外壳结构（如有）。",
        },
      ]}
      faqEn={[
        {
          q: "Can EMC simulation completely replace laboratory testing?",
          a: "Not completely, but it can significantly improve pass rates. EMC simulation helps identify and resolve major issues before fabrication, reducing laboratory test iterations and remediation costs. Products optimized through simulation typically see first-pass lab test rates improve from 30%~50% to 80%~90%.",
        },
        {
          q: "Which EMC certification standards do you support?",
          a: "We support FCC Part 15 (USA), CE EN 55032/EN 55035 (EU), CISPR 32/CISPR 35 (international), GB/T 9254 (China), and other major standards. We can also support specific industry standards such as automotive CISPR 25 and medical IEC 60601-1-2.",
        },
        {
          q: "What files are needed for EMC simulation at the PCB design stage?",
          a: "Required: PCB design files (Gerber or ODB++), schematic (for circuit function understanding), key signal frequency and level information, and product enclosure structure (if available).",
        },
      ]}
    />
  );
}
