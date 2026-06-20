import { Activity } from "lucide-react";
import { ServicePageLayout } from "./_ServicePageLayout";

export default function SchematicDesign() {
  return (
    <ServicePageLayout
      accentColor="#1565E8"
      accentBg="#EBF3FF"
      icon={<Activity size={28} />}
      titleZh="原理图设计"
      titleEn="Schematic Design"
      subtitleZh="基于 Altium Designer / Cadence Allegro / KiCad，提供从需求分析到完整原理图交付的全流程设计服务，支持复杂多板系统设计。"
      subtitleEn="Full-cycle schematic design using Altium Designer / Cadence Allegro / KiCad — from requirements analysis to complete schematic delivery, supporting complex multi-board systems."
      descZh="PCBforth 的原理图设计服务由具备 10 年以上经验的资深硬件工程师执行。我们不仅绘制原理图，更深入理解电路功能，确保每一个网络连接、每一个器件选型都经过工程验证。服务涵盖模拟电路、数字电路、电源管理、高速接口（PCIe / USB / DDR / Ethernet）等各类复杂系统，支持 Altium Designer、Cadence Allegro、KiCad 等主流 EDA 工具。设计完成后提供完整的 DRC 检查报告、BOM 清单及设计说明文档，确保后续 PCB Layout 和制造环节顺利推进。"
      descEn="PCBforth's schematic design service is executed by senior hardware engineers with 10+ years of experience. We don't just draw schematics — we deeply understand circuit functionality to ensure every net connection and component selection is engineering-validated. Services cover analog circuits, digital circuits, power management, high-speed interfaces (PCIe / USB / DDR / Ethernet), and complex multi-board systems. Supported EDA tools: Altium Designer, Cadence Allegro, KiCad. Deliverables include complete DRC check reports, BOM lists, and design documentation."
      capabilitiesZh={[
        "Altium Designer / Cadence / KiCad",
        "支持 10,000+ 网络规模",
        "模拟 / 数字 / 混合信号电路",
        "电源管理 (PMIC / DC-DC / LDO)",
        "高速接口 (PCIe 5.0 / USB 4 / DDR5)",
        "DRC + EMC 规则检查",
        "多板系统层次化设计",
        "完整 BOM 清单输出",
      ]}
      capabilitiesEn={[
        "Altium Designer / Cadence / KiCad",
        "Up to 10,000+ net designs",
        "Analog / Digital / Mixed-signal",
        "Power Management (PMIC / DC-DC / LDO)",
        "High-speed interfaces (PCIe 5.0 / USB 4 / DDR5)",
        "DRC + EMC rule checks",
        "Hierarchical multi-board design",
        "Complete BOM list output",
      ]}
      specs={[
        { labelZh: "支持 EDA 工具", labelEn: "EDA Tools", value: "Altium Designer / Cadence Allegro / KiCad" },
        { labelZh: "原理图规模", labelEn: "Schematic Scale", value: "Up to 10,000+ nets" },
        { labelZh: "交付周期", labelEn: "Lead Time", value: "3 ~ 10 business days" },
        { labelZh: "设计审查", labelEn: "Design Review", value: "DRC + EMC rule check" },
        { labelZh: "交付物", labelEn: "Deliverables", value: "Schematic + BOM + DRC Report" },
        { labelZh: "支持格式", labelEn: "Output Formats", value: "PDF / SCH / OrcadLib / Altium" },
      ]}
      workflow={[
        {
          titleZh: "需求分析",
          titleEn: "Requirements Analysis",
          descZh: "与客户深入沟通，明确系统功能需求、接口定义、电源预算、工作环境等关键参数，输出需求规格书（SRS）作为设计基准。",
          descEn: "In-depth communication with the client to clarify system functional requirements, interface definitions, power budget, operating environment, and other key parameters. Output a System Requirements Specification (SRS) as the design baseline.",
        },
        {
          titleZh: "架构规划",
          titleEn: "Architecture Planning",
          descZh: "基于需求规格，规划系统架构和模块划分，选定主控芯片、电源方案、关键接口芯片，输出系统框图和初步 BOM。",
          descEn: "Based on the requirements specification, plan the system architecture and module division, select the main controller, power solution, and key interface chips. Output a system block diagram and preliminary BOM.",
        },
        {
          titleZh: "原理图绘制",
          titleEn: "Schematic Drawing",
          descZh: "按照架构规划绘制详细原理图，遵循 IPC-2612 标准，确保网络命名规范、去耦电容布置合理、电源域划分清晰。",
          descEn: "Draw detailed schematics according to the architecture plan, following IPC-2612 standards. Ensure proper net naming, decoupling capacitor placement, and clear power domain partitioning.",
        },
        {
          titleZh: "DRC 检查与审查",
          titleEn: "DRC Check & Review",
          descZh: "运行完整的 DRC（设计规则检查），同时进行 EMC 规则审查，识别潜在的 ESD 风险、电源噪声路径和信号完整性隐患，输出审查报告。",
          descEn: "Run a complete DRC (Design Rule Check) and perform an EMC rule review to identify potential ESD risks, power noise paths, and signal integrity issues. Output a review report.",
        },
        {
          titleZh: "交付与归档",
          titleEn: "Delivery & Documentation",
          descZh: "交付最终原理图（PDF + 源文件）、完整 BOM 清单、DRC 报告及设计说明文档，确保后续 PCB Layout 工程师能够顺利接手。",
          descEn: "Deliver the final schematic (PDF + source files), complete BOM list, DRC report, and design documentation to ensure a smooth handoff to the PCB layout engineer.",
        },
      ]}
      faqZh={[
        {
          q: "你们支持哪些 EDA 工具？",
          a: "我们主要使用 Altium Designer 和 Cadence Allegro，同时支持 KiCad。如果您有特定的工具要求，请在询价时说明。",
        },
        {
          q: "原理图设计周期大概多长？",
          a: "简单原理图（<500 网络）通常 3~5 个工作日，复杂系统（>5000 网络）需要 10~20 个工作日。具体时间取决于设计复杂度和需求确认速度。",
        },
        {
          q: "你们会提供 BOM 吗？",
          a: "是的，我们会提供完整的 BOM 清单，包含器件型号、封装、数量、推荐供应商和参考价格。如需元器件选型优化服务，请参考我们的元器件选型服务页面。",
        },
      ]}
      faqEn={[
        {
          q: "Which EDA tools do you support?",
          a: "We primarily use Altium Designer and Cadence Allegro, with KiCad also supported. If you have specific tool requirements, please mention them when requesting a quote.",
        },
        {
          q: "What is the typical turnaround time for schematic design?",
          a: "Simple schematics (<500 nets) typically take 3~5 business days. Complex systems (>5000 nets) may require 10~20 business days, depending on design complexity and requirements confirmation speed.",
        },
        {
          q: "Do you provide a BOM?",
          a: "Yes, we provide a complete BOM list including part numbers, packages, quantities, recommended suppliers, and reference pricing. For component optimization services, please refer to our Component Selection service page.",
        },
      ]}
    />
  );
}
