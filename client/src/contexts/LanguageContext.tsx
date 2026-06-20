import React, { createContext, useContext, useState } from "react";

type Lang = "zh" | "en";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Nav
  "nav.home": { zh: "首页", en: "Home" },
  "nav.about": { zh: "关于我们", en: "About Us" },
  "nav.services": { zh: "业务范围", en: "Services" },
  "nav.schematic": { zh: "PCB原理图", en: "Schematic Design" },
  "nav.layout": { zh: "PCB Layout", en: "PCB Layout" },
  "nav.bom": { zh: "元器件选型", en: "BOM & Components" },
  "nav.simulation": { zh: "仿真分析", en: "Simulation" },
  "nav.fabrication": { zh: "制板工艺", en: "PCB Fabrication" },
  "nav.smt": { zh: "SMT一站式", en: "SMT One-Stop" },
  "nav.cases": { zh: "合作案例", en: "Cases" },
  "nav.news": { zh: "资讯动态", en: "News" },
  "nav.contact": { zh: "联系我们", en: "Contact" },
  // Hero
  "hero.title": { zh: "一站式PCB制造与组装合作伙伴", en: "One-Stop PCB Manufacturing & Assembly Partner" },
  "hero.subtitle": { zh: "从样板到量产 · 快速交付 · IPC Class 2/3 · 全球发货", en: "Prototype to Mass Production · Fast Turnaround · IPC Class 2/3 · Global Delivery" },
  "hero.badge": { zh: "PCBforth Technology", en: "PCBforth Technology" },
  "hero.cta1": { zh: "立即获取报价", en: "Get Instant Quote" },
  "hero.cta2": { zh: "上传 Gerber 文件", en: "Upload Gerber Files" },
  "hero.stat1.num": { zh: "15+", en: "15+" },
  "hero.stat1.label": { zh: "年行业经验", en: "Years Experience" },
  "hero.stat2.num": { zh: "5000+", en: "5000+" },
  "hero.stat2.label": { zh: "项目交付", en: "Projects Delivered" },
  "hero.stat3.num": { zh: "72H", en: "72H" },
  "hero.stat3.label": { zh: "样板交期", en: "Prototype Lead Time" },
  "hero.stat4.num": { zh: "98.7%", en: "98.7%" },
  "hero.stat4.label": { zh: "准时交付率", en: "On-time Delivery" },
  // About
  "about.title": { zh: "关于PCBforth", en: "About PCBforth" },
  "about.desc1": { zh: "PCBforth是一家专注于PCB全流程服务的高科技企业，拥有超过15年的行业经验。我们从产品系统角度全局考虑，通过对产品原理图、PCB、结构进行详细分析，从源头上解决产品的EMC问题，确保为企业提供快速、高效、低成本、可量产的整改方案。", en: "PCBforth is a high-tech enterprise focused on full-cycle PCB services with over 15 years of industry experience. We take a holistic product-system perspective, conducting detailed analysis of schematics, PCB layouts, and structures to resolve EMC issues at the source." },
  "about.desc2": { zh: "我们的团队由资深硬件工程师、PCB设计专家和制造工艺专家组成，服务涵盖PCB原理图设计、PCB Layout、元器件选型、SI/PI/EMC仿真分析、PCB制板及SMT焊接一站式服务，为客户提供从设计到量产的完整解决方案。", en: "Our team consists of senior hardware engineers, PCB design experts, and manufacturing specialists. Services cover schematic design, PCB layout, component selection, SI/PI/EMC simulation, PCB fabrication, and SMT assembly — delivering complete solutions from design to mass production." },
  "about.feature1": { zh: "全流程服务", en: "Full-Cycle Service" },
  "about.feature2": { zh: "快速交付", en: "Fast Delivery" },
  "about.feature3": { zh: "品质保证", en: "Quality Assured" },
  "about.feature4": { zh: "专业团队", en: "Expert Team" },
  // Schematic
  "schematic.title": { zh: "PCB原理图设计", en: "PCB Schematic Design" },
  "schematic.desc": { zh: "PCBforth拥有专业的原理图设计团队，精通Altium Designer、Cadence OrCAD、KiCad等主流EDA工具。我们从系统架构出发，合理规划电源域、信号完整性和EMC设计，为后续PCB Layout奠定坚实基础。", en: "PCBforth has a professional schematic design team proficient in Altium Designer, Cadence OrCAD, KiCad and other mainstream EDA tools. Starting from system architecture, we plan power domains, signal integrity, and EMC design to lay a solid foundation for PCB layout." },
  "schematic.cap1": { zh: "多层次原理图架构设计", en: "Multi-level schematic architecture" },
  "schematic.cap2": { zh: "电源树与时序分析", en: "Power tree & timing analysis" },
  "schematic.cap3": { zh: "信号完整性预规划", en: "Signal integrity pre-planning" },
  "schematic.cap4": { zh: "EMC设计规范审查", en: "EMC design rule review" },
  "schematic.cap5": { zh: "BOM清单生成与优化", en: "BOM generation & optimization" },
  "schematic.cap6": { zh: "设计文档完整交付", en: "Complete design documentation" },
  // Layout
  "layout.title": { zh: "PCB Layout设计", en: "PCB Layout Design" },
  "layout.desc": { zh: "我们的PCB Layout团队拥有丰富的高速数字电路、射频电路、电源电路设计经验，支持2层至40层PCB设计。严格遵循IPC标准，确保信号完整性、电源完整性和EMC性能达到最优。", en: "Our PCB layout team has extensive experience in high-speed digital, RF, and power circuit design, supporting 2 to 40-layer PCB design. We strictly follow IPC standards to ensure optimal signal integrity, power integrity, and EMC performance." },
  "layout.cap1": { zh: "2~40层高密度互连设计", en: "2~40 layer HDI design" },
  "layout.cap2": { zh: "高速差分信号布线", en: "High-speed differential routing" },
  "layout.cap3": { zh: "射频/微波电路布局", en: "RF/Microwave circuit layout" },
  "layout.cap4": { zh: "电源完整性优化", en: "Power integrity optimization" },
  "layout.cap5": { zh: "热设计与散热规划", en: "Thermal design & heat dissipation" },
  "layout.cap6": { zh: "DFM可制造性设计", en: "DFM design for manufacturability" },
  // BOM
  "bom.title": { zh: "元器件选型", en: "Component Selection" },
  "bom.desc": { zh: "PCBforth提供专业的元器件选型服务，基于对全球主流元器件供应商的深度了解，结合客户的性能需求、成本预算和供货周期，为客户推荐最优的元器件方案，有效降低物料成本和供应链风险。", en: "PCBforth provides professional component selection services. Based on deep knowledge of global component suppliers, combined with customer performance requirements, cost budgets, and lead times, we recommend optimal component solutions to reduce material costs and supply chain risks." },
  "bom.cap1": { zh: "国内外主流品牌覆盖", en: "Global brand coverage" },
  "bom.cap2": { zh: "替代料推荐与验证", en: "Alternative component validation" },
  "bom.cap3": { zh: "成本优化方案", en: "Cost optimization solutions" },
  "bom.cap4": { zh: "供货周期评估", en: "Lead time assessment" },
  "bom.cap5": { zh: "器件可靠性分析", en: "Component reliability analysis" },
  "bom.cap6": { zh: "长期备货策略建议", en: "Long-term stocking strategy" },
  // Simulation
  "simulation.title": { zh: "仿真分析", en: "Simulation Analysis" },
  "simulation.desc": { zh: "PCBforth提供专业的SI/PI/EMC仿真分析服务，使用Ansys SIwave、HyperLynx、CST等业界领先仿真工具，在设计阶段提前发现并解决信号完整性、电源完整性和电磁兼容性问题，大幅降低样板返工风险。", en: "PCBforth provides professional SI/PI/EMC simulation services using industry-leading tools such as Ansys SIwave, HyperLynx, and CST. We identify and resolve signal integrity, power integrity, and EMC issues at the design stage, significantly reducing prototype rework risks." },
  "simulation.cap1": { zh: "信号完整性(SI)分析", en: "Signal Integrity (SI) analysis" },
  "simulation.cap2": { zh: "电源完整性(PI)分析", en: "Power Integrity (PI) analysis" },
  "simulation.cap3": { zh: "EMC仿真与优化", en: "EMC simulation & optimization" },
  "simulation.cap4": { zh: "热仿真分析", en: "Thermal simulation" },
  "simulation.cap5": { zh: "眼图与时序分析", en: "Eye diagram & timing analysis" },
  "simulation.cap6": { zh: "仿真报告输出", en: "Simulation report output" },
  // Fabrication
  "fabrication.title": { zh: "PCB制板工艺", en: "PCB Fabrication" },
  "fabrication.desc": { zh: "PCBforth与中国头部PCB制造工厂建立深度战略合作关系，合作工厂均通过ISO9001、UL、IPC Class 2/3等国际权威认证，具备完善的质量管理体系。支持FR4、高频Rogers、铝基板、软硬结合板等多种材料，最小线宽/间距达到2mil，可承接从样板到百万级量产的全规模订单，为全球客户提供高品质、高可靠性的PCB制板服务。", en: "PCBforth maintains deep strategic partnerships with China's leading PCB manufacturers — all certified under ISO9001, UL, and IPC Class 2/3 international standards with robust quality management systems. We support FR4, high-frequency Rogers, aluminum substrates, flex-rigid boards, and more, with minimum trace/space of 2mil. From prototypes to million-unit mass production, we deliver high-quality, high-reliability PCBs to global customers." },
  "fabrication.cap1": { zh: "战略合作头部PCB工厂", en: "Strategic partner: top-tier PCB factories" },
  "fabrication.cap2": { zh: "ISO9001 / UL / IPC Class 2/3认证", en: "ISO9001 / UL / IPC Class 2/3 certified" },
  "fabrication.cap3": { zh: "最多40层叠层设计", en: "Up to 40-layer stackup" },
  "fabrication.cap4": { zh: "盲埋孔/HDI工艺", en: "Blind/buried via & HDI" },
  "fabrication.cap5": { zh: "阻抗控制±10%，最小线宽2mil", en: "Impedance ±10%, min. trace 2mil" },
  "fabrication.cap6": { zh: "样板至量产全规模承接", en: "Prototype to mass production" },
  // SMT
  "smt.title": { zh: "SMT一站式服务", en: "SMT One-Stop Service" },
  "smt.desc": { zh: "PCBforth提供完整的SMT贴片焊接一站式服务，从钢网制作、锡膏印刷、贴片、回流焊、AOI检测到ICT测试，全流程质量把控。支持0201及以上封装，BGA、QFN等复杂封装焊接，满足从样板到量产的全部需求。", en: "PCBforth provides complete SMT one-stop services — from stencil fabrication, solder paste printing, component placement, reflow soldering, AOI inspection to ICT testing. We support 0201 and above packages, BGA, QFN, and other complex package soldering for prototypes to mass production." },
  "smt.cap1": { zh: "全自动贴片产线", en: "Fully automated SMT lines" },
  "smt.cap2": { zh: "BGA/QFN复杂封装", en: "BGA/QFN complex packages" },
  "smt.cap3": { zh: "AOI光学检测", en: "AOI optical inspection" },
  "smt.cap4": { zh: "X-Ray检测", en: "X-Ray inspection" },
  "smt.cap5": { zh: "ICT功能测试", en: "ICT functional testing" },
  "smt.cap6": { zh: "样板24小时快速交付", en: "Prototype 24h fast delivery" },
  // Cases
  "cases.title": { zh: "合作案例", en: "Cooperation Cases" },
  "cases.subtitle": { zh: "我们服务过众多知名企业，涵盖通信、消费电子、工业控制、医疗设备等领域", en: "We have served many well-known enterprises across communications, consumer electronics, industrial control, and medical devices." },
  "cases.case1.title": { zh: "某知名通信设备商 — 5G基站主板", en: "Leading Telecom Vendor — 5G Base Station Mainboard" },
  "cases.case1.desc": { zh: "为国内某知名通信设备商设计20层5G基站主板，涵盖高速SerDes接口、DDR5内存、复杂电源树设计，通过严格的SI/PI仿真验证，一次性通过EMC认证测试。", en: "Designed a 20-layer 5G base station mainboard for a leading domestic telecom vendor, covering high-speed SerDes interfaces, DDR5 memory, and complex power tree design. Passed SI/PI simulation verification and EMC certification in one shot." },
  "cases.case1.tag1": { zh: "20层PCB", en: "20-Layer PCB" },
  "cases.case1.tag2": { zh: "5G通信", en: "5G Telecom" },
  "cases.case1.tag3": { zh: "高速设计", en: "High-Speed" },
  "cases.case2.title": { zh: "全球知名笔记本品牌 — 超薄主板", en: "Global Notebook Brand — Ultra-thin Mainboard" },
  "cases.case2.desc": { zh: "参与全球知名笔记本电脑超薄主板PCB设计，实现极致小型化布局，板厚仅0.8mm，支持USB4、Thunderbolt 4等高速接口，成功量产并全球发售。", en: "Participated in the PCB design of an ultra-thin notebook mainboard for a global brand, achieving extreme miniaturization with 0.8mm board thickness, supporting USB4 and Thunderbolt 4 interfaces. Successfully mass-produced and sold globally." },
  "cases.case2.tag1": { zh: "超薄设计", en: "Ultra-thin" },
  "cases.case2.tag2": { zh: "消费电子", en: "Consumer Electronics" },
  "cases.case2.tag3": { zh: "量产交付", en: "Mass Production" },
  "cases.case3.title": { zh: "工业控制企业 — 伺服驱动器", en: "Industrial Control — Servo Driver" },
  "cases.case3.desc": { zh: "为某工业自动化企业设计高功率密度伺服驱动器PCB，集成GaN功率器件，优化散热设计，通过CE/UL认证，产品已在多条自动化产线稳定运行。", en: "Designed a high-power-density servo driver PCB for an industrial automation company, integrating GaN power devices with optimized thermal design. Passed CE/UL certification and is stably running on multiple automated production lines." },
  "cases.case3.tag1": { zh: "工业控制", en: "Industrial Control" },
  "cases.case3.tag2": { zh: "GaN功率", en: "GaN Power" },
  "cases.case3.tag3": { zh: "CE/UL认证", en: "CE/UL Certified" },
  "cases.case4.title": { zh: "医疗设备企业 — 便携式监护仪", en: "Medical Device — Portable Patient Monitor" },
  "cases.case4.desc": { zh: "为医疗设备企业设计便携式患者监护仪主板，满足IEC 60601医疗电气安全标准，实现超低功耗设计，电池续航提升40%，通过FDA 510(k)认证。", en: "Designed the mainboard for a portable patient monitor for a medical device company, meeting IEC 60601 medical electrical safety standards. Achieved ultra-low power design with 40% improved battery life, passing FDA 510(k) certification." },
  "cases.case4.tag1": { zh: "医疗设备", en: "Medical Device" },
  "cases.case4.tag2": { zh: "低功耗", en: "Low Power" },
  "cases.case4.tag3": { zh: "FDA认证", en: "FDA Certified" },
  // Contact
  "contact.title": { zh: "联系我们", en: "Contact Us" },
  "contact.phone": { zh: "电话", en: "Phone" },
  "contact.email": { zh: "邮箱", en: "Email" },
  "contact.address": { zh: "地址", en: "Address" },
  "contact.address.val": { zh: "深圳市南山区科技园高新南七道PCBforth科技大厦", en: "PCBforth Tech Tower, Hi-Tech Park, Nanshan, Shenzhen" },
  "contact.form.name": { zh: "您的姓名", en: "Your Name" },
  "contact.form.company": { zh: "公司名称", en: "Company" },
  "contact.form.phone": { zh: "联系电话", en: "Phone Number" },
  "contact.form.message": { zh: "需求描述", en: "Project Description" },
  "contact.form.submit": { zh: "提交咨询", en: "Submit Inquiry" },
  // Social & Email
  "contact.email.sales": { zh: "销售邮箱", en: "Sales" },
  "contact.email.support": { zh: "技术支持", en: "Support" },
  "contact.email.quote": { zh: "报价邮箱", en: "Quote" },
  "social.follow": { zh: "关注我们", en: "Follow Us" },
  "social.linkedin": { zh: "领英", en: "LinkedIn" },
  "social.twitter": { zh: "推特", en: "Twitter / X" },
  "social.youtube": { zh: "YouTube", en: "YouTube" },
  "social.facebook": { zh: "脸书", en: "Facebook" },
  "social.wechat": { zh: "微信", en: "WeChat" },
  "social.whatsapp": { zh: "WhatsApp", en: "WhatsApp" },
  // Footer
  "footer.rights": { zh: "© 2024 PCBforth 版权所有", en: "© 2024 PCBforth. All rights reserved." },
  "footer.slogan": { zh: "精密驱动创新，从原理图到成品", en: "Precision Drives Innovation — From Schematic to Product" },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "zh",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
