// PCBforth — Design Services Overview
// Inspired by Linkytech PCB Design page layout
// Hero with real PCB background image + 4 advantage cards + capability list + service grid + CTA

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  Activity, Layers, Zap, Cpu, Shield, CheckCircle, Package,
  ArrowRight, ChevronRight, Globe, Phone, Mail,
  Users, Award, Star, Wrench,
} from "lucide-react";

const HERO_BG = "/manus-storage/pcb-design-hero_8ddb0a66.jpg";

// ── Design tokens ──
const C = {
  sidebarBgDark:  "#122A52",
  sidebarBorder:  "rgba(255,255,255,0.12)",
  pageBg:         "#FFFFFF",
  cardBg:         "#FFFFFF",
  cardBorder:     "#E8EFF8",
  sectionAlt:     "#F5F8FF",
  heading:        "#0D2A5E",
  body:           "#3A5070",
  muted:          "#6B8CB8",
  blue:           "#1565E8",
  blueDark:       "#0D4DC4",
  blueLight:      "#EBF3FF",
  divider:        "#C8DEFF",
};

function PcbLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="8" fill="#1565E8"/>
      <rect x="6" y="6" width="10" height="10" rx="2" fill="none" stroke="#60A5FA" strokeWidth="1.5"/>
      <rect x="20" y="6" width="10" height="10" rx="2" fill="none" stroke="#60A5FA" strokeWidth="1.5"/>
      <rect x="6" y="20" width="10" height="10" rx="2" fill="none" stroke="#60A5FA" strokeWidth="1.5"/>
      <rect x="20" y="20" width="10" height="10" rx="2" fill="#1565E8" stroke="#60A5FA" strokeWidth="1.5"/>
      <line x1="11" y1="16" x2="11" y2="20" stroke="#93C5FD" strokeWidth="1.5"/>
      <line x1="25" y1="16" x2="25" y2="20" stroke="#93C5FD" strokeWidth="1.5"/>
      <line x1="16" y1="11" x2="20" y2="11" stroke="#93C5FD" strokeWidth="1.5"/>
      <line x1="16" y1="25" x2="20" y2="25" stroke="#93C5FD" strokeWidth="1.5"/>
      <circle cx="25" cy="25" r="3" fill="#60A5FA"/>
    </svg>
  );
}

// ── 4 Core Advantages (Linkytech-style) ──
const advantages = [
  {
    icon: <Users size={40} strokeWidth={1.5} />,
    titleZh: "最专业的设计团队",
    titleEn: "Most Professional Design Team",
    pointsZh: [
      "72 人的设计团队",
      "平均工作经验 6 年以上",
      "10 年以上的设计人员占 22%",
      "81.16% 大学本科学历",
      "18.84% 大专学历",
    ],
    pointsEn: [
      "72-person design team",
      "Average 6+ years of experience",
      "22% with 10+ years experience",
      "81.16% hold bachelor's degrees",
      "18.84% hold associate degrees",
    ],
  },
  {
    icon: <Award size={40} strokeWidth={1.5} />,
    titleZh: "领先的设计经验",
    titleEn: "Leading Design Experience",
    pointsZh: [
      "国内外技术先进知名通信公司设计经验",
      "大型芯片公司的设计指导要求",
      "精通 40G 高速设计要求",
      "精通大电流高压的设计要求",
      "精通 EMC 的设计要求",
    ],
    pointsEn: [
      "Experience with leading global telecom companies",
      "Guided by major chip company design standards",
      "Proficient in 40G high-speed design",
      "Expertise in high-current high-voltage design",
      "Proficient in EMC design requirements",
    ],
  },
  {
    icon: <Star size={40} strokeWidth={1.5} />,
    titleZh: "高品质设计质量体系",
    titleEn: "High-Quality Design System",
    pointsZh: [
      "严格的质量体系流程",
      "严格的评审制度",
      "零出错率的品质要求",
    ],
    pointsEn: [
      "Rigorous quality management process",
      "Strict design review system",
      "Zero-defect quality standard",
    ],
  },
  {
    icon: <Wrench size={40} strokeWidth={1.5} />,
    titleZh: "高难度设计",
    titleEn: "High-Complexity Design",
    pointsZh: [
      "最大设计规模 90000 pin",
      "HDI / Any layer PCB 设计",
      "3D PCB 设计",
      "RF 设计",
      "56G 高速设计",
    ],
    pointsEn: [
      "Max design scale: 90,000 pins",
      "HDI / Any layer PCB design",
      "3D PCB design",
      "RF design",
      "56G high-speed design",
    ],
  },
];

// ── 7 Service Cards ──
const services = [
  {
    path: "/design-services/schematic",
    icon: <Activity size={26} />,
    color: "#1565E8",
    bgColor: "#EBF3FF",
    titleZh: "原理图设计",
    titleEn: "Schematic Design",
    descZh: "基于 Altium Designer / Cadence / KiCad，从需求分析到完整原理图交付，支持 10,000+ 网络规模，含 DRC 与 EMC 规则检查。",
    descEn: "Full schematic design using Altium / Cadence / KiCad, supporting 10,000+ net designs with DRC and EMC rule checks.",
    tagsZh: ["Altium Designer", "Cadence", "KiCad", "DRC 检查"],
    tagsEn: ["Altium Designer", "Cadence", "KiCad", "DRC Check"],
  },
  {
    path: "/design-services/pcb-layout",
    icon: <Layers size={26} />,
    color: "#0891B2",
    bgColor: "#E0F7FA",
    titleZh: "PCB Layout",
    titleEn: "PCB Layout",
    descZh: "支持最高 40 层 HDI 设计，最小线宽/间距 2mil/2mil，覆盖高速信号、差分对、阻抗控制等高端布线需求。",
    descEn: "Up to 40-layer HDI design, 2mil/2mil min trace/space, covering high-speed signals, differential pairs, and impedance control.",
    tagsZh: ["HDI 设计", "阻抗控制", "差分对布线", "40 层"],
    tagsEn: ["HDI Design", "Impedance Ctrl", "Diff. Pairs", "40 Layers"],
  },
  {
    path: "/design-services/si",
    icon: <Zap size={26} />,
    color: "#7C3AED",
    bgColor: "#F3EEFF",
    titleZh: "信号完整性分析",
    titleEn: "Signal Integrity",
    descZh: "覆盖高速串行（224G PAM4）、DDR3~DDR5 内存接口仿真，提供 S 参数分析、眼图仿真及整改建议报告。",
    descEn: "Covers high-speed serial (224G PAM4), DDR3~DDR5 memory interfaces, S-parameter analysis, eye diagram simulation, and fix reports.",
    tagsZh: ["224G PAM4", "DDR5", "S 参数", "眼图仿真"],
    tagsEn: ["224G PAM4", "DDR5", "S-Parameters", "Eye Diagram"],
  },
  {
    path: "/design-services/pi",
    icon: <Cpu size={26} />,
    color: "#D97706",
    bgColor: "#FFF8E1",
    titleZh: "电源完整性分析",
    titleEn: "Power Integrity",
    descZh: "IR-Drop 仿真、PDN 阻抗分析、平面谐振评估及电热协同仿真，优化去耦电容方案，确保电源供电网络稳定。",
    descEn: "IR-Drop simulation, PDN impedance analysis, plane resonance evaluation, and electrothermal co-simulation for stable power delivery.",
    tagsZh: ["IR-Drop", "PDN 阻抗", "去耦优化", "热分析"],
    tagsEn: ["IR-Drop", "PDN Impedance", "Decoupling", "Thermal"],
  },
  {
    path: "/design-services/emc",
    icon: <Shield size={26} />,
    color: "#DC2626",
    bgColor: "#FEF2F2",
    titleZh: "EMC 设计",
    titleEn: "EMC Design",
    descZh: "辐射发射仿真、传导干扰分析、ESD 防护设计，支持 FCC / CE / CISPR 标准，帮助产品一次性通过认证测试。",
    descEn: "Radiated emission simulation, conducted interference analysis, ESD protection design. Supports FCC / CE / CISPR standards.",
    tagsZh: ["FCC / CE", "辐射发射", "ESD 防护", "CISPR"],
    tagsEn: ["FCC / CE", "Radiated Emission", "ESD Protection", "CISPR"],
  },
  {
    path: "/design-services/dfm",
    icon: <CheckCircle size={26} />,
    color: "#059669",
    bgColor: "#ECFDF5",
    titleZh: "DFM 审查",
    titleEn: "DFM Review",
    descZh: "制造可行性分析，识别可能导致生产问题的设计缺陷，提供焊盘尺寸、丝印间距、孔径等优化建议，降低首板返工率。",
    descEn: "Manufacturing feasibility analysis identifying design defects. Recommendations on pad size, silkscreen, drill, and more.",
    tagsZh: ["制造可行性", "焊盘优化", "孔径检查", "首板良率"],
    tagsEn: ["Manufacturability", "Pad Optimization", "Drill Check", "First-Pass Yield"],
  },
  {
    path: "/design-services/components",
    icon: <Package size={26} />,
    color: "#0891B2",
    bgColor: "#E0F7FA",
    titleZh: "元器件选型",
    titleEn: "Component Selection",
    descZh: "基于 TI / NXP / ST / Infineon 等主流供应商资源，提供 BOM 优化、替代料推荐、价格谈判及备货建议，降低物料成本。",
    descEn: "BOM optimization, alternate component recommendations, and pricing negotiation leveraging TI / NXP / ST / Infineon supplier networks.",
    tagsZh: ["BOM 优化", "替代料", "TI / NXP / ST", "成本降低"],
    tagsEn: ["BOM Optimization", "Alternates", "TI / NXP / ST", "Cost Reduction"],
  },
];

// ── Design Process Steps ──
const processSteps = [
  { numZh: "01", numEn: "01", titleZh: "需求沟通", titleEn: "Requirements", descZh: "了解产品功能、性能指标、应用场景及预算约束", descEn: "Understand product function, performance specs, application, and budget" },
  { numZh: "02", numEn: "02", titleZh: "方案评估", titleEn: "Feasibility", descZh: "技术可行性分析、器件选型建议、风险识别", descEn: "Technical feasibility analysis, component selection, risk identification" },
  { numZh: "03", numEn: "03", titleZh: "原理图设计", titleEn: "Schematic", descZh: "完整原理图绘制、DRC 检查、评审确认", descEn: "Full schematic drawing, DRC check, design review" },
  { numZh: "04", numEn: "04", titleZh: "PCB Layout", titleEn: "PCB Layout", descZh: "布局布线、阻抗控制、DFM 同步审查", descEn: "Placement, routing, impedance control, simultaneous DFM review" },
  { numZh: "05", numEn: "05", titleZh: "仿真验证", titleEn: "Simulation", descZh: "SI/PI/EMC 仿真分析，出具整改报告", descEn: "SI/PI/EMC simulation analysis with remediation report" },
  { numZh: "06", numEn: "06", titleZh: "交付制板", titleEn: "Delivery", descZh: "Gerber 文件交付，对接制造与 SMT 生产", descEn: "Gerber file delivery, handoff to fabrication and SMT production" },
];

export default function DesignServices() {
  const [, navigate] = useLocation();
  const [lang, setLang] = useState<"zh" | "en">("en");

  return (
    <div className="min-h-screen font-sans" style={{ background: C.pageBg }}>

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 shadow-sm"
        style={{ background: C.sidebarBgDark, borderBottom: `1px solid ${C.sidebarBorder}` }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <PcbLogo size={28} />
            <span className="font-bold text-sm tracking-widest text-white" style={{ fontFamily: "'Orbitron', monospace" }}>PCBforth</span>
          </button>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "#7EB3F5" }}>
            {lang === "zh" ? "PCB 设计服务" : "PCB Design Services"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Globe size={13} style={{ color: "#7EB3F5" }} />
            <button onClick={() => setLang("en")}
              className="text-xs px-2.5 py-1 rounded-full transition-all font-medium"
              style={{ background: lang === "en" ? "#FFFFFF" : "transparent", color: lang === "en" ? C.blue : "#B8D4F8" }}>
              EN
            </button>
            <button onClick={() => setLang("zh")}
              className="text-xs px-2.5 py-1 rounded-full transition-all font-medium"
              style={{ background: lang === "zh" ? "#FFFFFF" : "transparent", color: lang === "zh" ? C.blue : "#B8D4F8" }}>
              中文
            </button>
          </div>
          <button onClick={() => navigate("/quote")}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
            style={{ background: C.blue }}>
            {lang === "zh" ? "获取报价" : "Get Quote"} <ArrowRight size={12} />
          </button>
        </div>
      </header>

      {/* ── Hero — Full-width PCB background image (Linkytech style) ── */}
      <section className="relative h-72 lg:h-96 overflow-hidden">
        <img
          src={HERO_BG}
          alt="PCB Design"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: "rgba(10,20,50,0.62)" }} />
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-10 lg:px-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-3xl lg:text-5xl font-black text-white mb-4 leading-tight"
              style={{ fontFamily: "'Orbitron', monospace", textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}>
              {lang === "zh" ? "PCBforth 专业设计团队" : "PCBforth Technology"}
            </h1>
            <p className="text-base lg:text-lg text-white/85 max-w-2xl leading-relaxed">
              {lang === "zh"
                ? "按时交付、达到客户要求的品质，是 PCBforth 工程团队始终坚守的使命。"
                : "Determined to deliver products to our customers on time, to the required quality is a mission we at PCBforth are committed to."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section Title: PCB Design ── */}
      <section className="py-12 px-8 lg:px-16 text-center" style={{ background: C.pageBg }}>
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-px w-16" style={{ background: C.divider }} />
          <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
            {lang === "zh" ? "PCB 设计" : "PCB Design"}
          </h2>
          <div className="h-px w-16" style={{ background: C.divider }} />
        </div>
        <p className="text-sm mt-3 max-w-xl mx-auto leading-relaxed" style={{ color: C.muted }}>
          {lang === "zh"
            ? "从原理图到制板，PCBforth 提供全流程工程设计支持，覆盖高速、高频、高密度各类复杂设计需求。"
            : "From schematic to fabrication, PCBforth provides full-cycle engineering design support covering high-speed, high-frequency, and high-density complex design requirements."}
        </p>
      </section>

      {/* ── 4 Advantage Cards (Linkytech-style icon + title + bullet list) ── */}
      <section className="pb-16 px-8 lg:px-16" style={{ background: C.pageBg }}>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((adv, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
              className="flex flex-col items-center text-center px-4 py-8 rounded-xl transition-all duration-300 hover:shadow-lg"
              style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              {/* Icon */}
              <div className="mb-5" style={{ color: C.blue }}>
                {adv.icon}
              </div>
              {/* Title */}
              <h3 className="font-bold text-base mb-4" style={{ color: C.heading }}>
                {lang === "zh" ? adv.titleZh : adv.titleEn}
              </h3>
              {/* Bullet list */}
              <ul className="space-y-1.5 text-left w-full">
                {(lang === "zh" ? adv.pointsZh : adv.pointsEn).map((pt, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: C.body }}>
                    <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: C.blue }} />
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Design Process ── */}
      <section className="py-14 px-8 lg:px-16" style={{ background: C.sectionAlt }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="h-px w-12" style={{ background: C.divider }} />
              <h2 className="text-xl lg:text-2xl font-bold" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
                {lang === "zh" ? "设计流程" : "Design Process"}
              </h2>
              <div className="h-px w-12" style={{ background: C.divider }} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {processSteps.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                className="flex gap-4 p-5 rounded-xl"
                style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
                <div className="text-3xl font-black shrink-0 leading-none" style={{ color: C.divider, fontFamily: "monospace" }}>
                  {lang === "zh" ? step.numZh : step.numEn}
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color: C.heading }}>
                    {lang === "zh" ? step.titleZh : step.titleEn}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
                    {lang === "zh" ? step.descZh : step.descEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7 Service Cards Grid ── */}
      <section className="py-14 px-8 lg:px-16" style={{ background: C.pageBg }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="h-px w-12" style={{ background: C.divider }} />
              <h2 className="text-xl lg:text-2xl font-bold" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
                {lang === "zh" ? "7 项专业设计服务" : "7 Professional Design Services"}
              </h2>
              <div className="h-px w-12" style={{ background: C.divider }} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {services.map((svc, i) => (
              <motion.div key={svc.path}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}
                onClick={() => navigate(svc.path)}
                className="group cursor-pointer rounded-xl p-5 transition-all duration-300 hover:-translate-y-1"
                style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, boxShadow: "0 2px 8px rgba(21,101,232,0.04)" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 28px rgba(21,101,232,0.13)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(21,101,232,0.04)")}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{ background: svc.bgColor, color: svc.color }}>
                  {svc.icon}
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: C.heading }}>
                  {lang === "zh" ? svc.titleZh : svc.titleEn}
                </h3>
                <p className="text-xs leading-relaxed mb-3 line-clamp-3" style={{ color: C.body }}>
                  {lang === "zh" ? svc.descZh : svc.descEn}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(lang === "zh" ? svc.tagsZh : svc.tagsEn).map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: svc.bgColor, color: svc.color }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
                  style={{ color: svc.color }}>
                  {lang === "zh" ? "了解详情" : "Learn More"} <ChevronRight size={12} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-8 lg:px-16" style={{ background: C.sidebarBgDark }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Orbitron', monospace" }}>
            {lang === "zh" ? "准备好开始您的项目了吗？" : "Ready to Start Your Project?"}
          </h2>
          <p className="text-white/65 mb-8 text-sm leading-relaxed">
            {lang === "zh"
              ? "上传您的设计文件或描述您的需求，我们的工程师将在 24 小时内提供专业评估和报价。"
              : "Upload your design files or describe your requirements. Our engineers will provide a professional assessment and quote within 24 hours."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => navigate("/quote")}
              className="flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-white text-sm shadow-lg transition-all active:scale-95"
              style={{ background: C.blue }}>
              {lang === "zh" ? "上传文件获取报价" : "Upload Files & Get Quote"} <ArrowRight size={15} />
            </button>
            <a href="mailto:sales@pcbforth.com"
              className="flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-sm transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.35)", color: "#FFFFFF", background: "rgba(255,255,255,0.08)" }}>
              <Mail size={14} /> sales@pcbforth.com
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-6 px-8 lg:px-16" style={{ background: "#0D1E3A", borderTop: `1px solid ${C.sidebarBorder}` }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PcbLogo size={24} />
            <span className="text-xs font-bold tracking-widest text-white" style={{ fontFamily: "'Orbitron', monospace" }}>PCBforth</span>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: "#4A7AB5" }}>
            <a href="tel:+8675588888888" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone size={11} /> +86 755-8888-8888
            </a>
            <a href="mailto:info@pcbforth.com" className="flex items-center gap-1 hover:text-white transition-colors">
              <Mail size={11} /> info@pcbforth.com
            </a>
          </div>
          <div className="text-xs" style={{ color: "#4A7AB5" }}>
            © 2025 PCBforth Technology. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
