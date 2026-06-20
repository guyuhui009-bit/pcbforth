// PCBforth — Design Services Overview Page
// Blue-white theme matching Home.tsx design tokens

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  Activity, Layers, Zap, Cpu, Shield, CheckCircle, Package,
  ArrowRight, ChevronRight, Globe, Phone, Mail,
} from "lucide-react";

// ── Design tokens (same as Home.tsx) ──
const C = {
  sidebarBg:      "#1A3A6B",
  sidebarBgDark:  "#122A52",
  sidebarBorder:  "rgba(255,255,255,0.12)",
  sidebarText:    "#B8D4F8",
  pageBg:         "#F0F6FF",
  cardBg:         "#FFFFFF",
  cardBorder:     "#D0E4FF",
  sectionAlt:     "#EBF3FF",
  heading:        "#0D2A5E",
  body:           "#2C4A7A",
  muted:          "#6B8CB8",
  blue:           "#1565E8",
  blueDark:       "#0D4DC4",
  blueLight:      "#EBF3FF",
  cyan:           "#0EA5E9",
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

const services = [
  {
    path: "/design-services/schematic",
    icon: <Activity size={28} />,
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
    icon: <Layers size={28} />,
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
    icon: <Zap size={28} />,
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
    icon: <Cpu size={28} />,
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
    icon: <Shield size={28} />,
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
    icon: <CheckCircle size={28} />,
    color: "#059669",
    bgColor: "#ECFDF5",
    titleZh: "DFM 审查",
    titleEn: "DFM Review",
    descZh: "制造可行性分析，识别可能导致生产问题的设计缺陷，提供焊盘尺寸、丝印间距、孔径等优化建议，降低首板返工率。",
    descEn: "Manufacturing feasibility analysis identifying design defects that cause production issues. Recommendations on pad size, silkscreen, drill, and more.",
    tagsZh: ["制造可行性", "焊盘优化", "孔径检查", "首板良率"],
    tagsEn: ["Manufacturability", "Pad Optimization", "Drill Check", "First-Pass Yield"],
  },
  {
    path: "/design-services/components",
    icon: <Package size={28} />,
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

const differentiators = [
  {
    zh: "工程师团队，不是工厂",
    en: "Engineers, Not a Factory",
    descZh: "PCBforth 核心团队由资深硬件工程师组成，具备 Ansys SIwave、HyperLynx、CST 等专业仿真工具使用经验，而非仅提供制造报价。",
    descEn: "PCBforth's core team consists of senior hardware engineers with hands-on experience in Ansys SIwave, HyperLynx, CST, and other professional simulation tools.",
  },
  {
    zh: "设计与制造一体化",
    en: "Design-to-Manufacturing Integration",
    descZh: "设计团队与制造工厂深度协作，DFM 审查在设计阶段即完成，避免制板后返工，首板良率显著高于行业平均水平。",
    descEn: "Design team works closely with the manufacturing floor. DFM review is completed at the design stage, avoiding post-fabrication rework.",
  },
  {
    zh: "全流程责任制",
    en: "Full-Cycle Accountability",
    descZh: "从需求分析、原理图、Layout、仿真验证到制板、SMT，同一团队负责全流程，避免多供应商协调导致的信息断层。",
    descEn: "From requirements analysis, schematic, layout, simulation verification to fabrication and SMT — one team owns the full cycle.",
  },
  {
    zh: "高速高频专项能力",
    en: "High-Speed / High-Frequency Expertise",
    descZh: "在 224G PAM4、DDR5、5G 毫米波、光模块等高速高频领域具备丰富实战经验，能解决 PCBWay/JLCPCB 无法覆盖的复杂工程问题。",
    descEn: "Extensive hands-on experience in 224G PAM4, DDR5, 5G mmWave, and optical modules — solving complex engineering challenges beyond standard PCB factories.",
  },
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

      {/* ── Hero ── */}
      <section className="relative py-20 px-8 lg:px-16 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${C.sidebarBgDark} 0%, #1A3A6B 60%, #1E4080 100%)` }}>
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-white/50" />
              <span className="text-xs tracking-[0.3em] uppercase font-mono text-white/60">PCBforth Design Services</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-5"
              style={{ fontFamily: "'Orbitron', monospace" }}>
              {lang === "zh" ? "专业 PCB 工程设计服务" : "Professional PCB\nEngineering Services"}
            </h1>
            <p className="text-lg text-white/75 mb-4 leading-relaxed max-w-2xl">
              {lang === "zh"
                ? "PCBforth 不只是 PCB 工厂。我们的工程师团队提供从原理图设计、PCB Layout 到 SI/PI/EMC 仿真的全链路设计服务，帮助您的产品在制板前解决所有工程问题。"
                : "PCBforth is more than a PCB factory. Our engineering team provides full-cycle design services — from schematic and PCB layout to SI/PI/EMC simulation — solving all engineering challenges before fabrication."}
            </p>
            <p className="text-sm text-white/55 mb-10 max-w-xl">
              {lang === "zh"
                ? "这是我们与 PCBWay / JLCPCB 的核心差异：我们是工程合作伙伴，而非单纯的制造商。"
                : "This is our core differentiation from PCBWay / JLCPCB: we are your engineering partner, not just a manufacturer."}
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate("/quote")}
                className="flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-white text-sm shadow-lg transition-all active:scale-95"
                style={{ background: C.blue }}>
                {lang === "zh" ? "获取工程评估" : "Get Engineering Review"} <ArrowRight size={15} />
              </button>
              <button onClick={() => navigate("/")}
                className="flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.35)", color: "#FFFFFF", background: "rgba(255,255,255,0.08)" }}>
                {lang === "zh" ? "返回首页" : "Back to Home"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Why PCBforth vs PCBWay/JLCPCB ── */}
      <section className="py-14 px-8 lg:px-16" style={{ background: C.pageBg }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <div className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: C.blue }}>
              {lang === "zh" ? "核心差异化" : "Core Differentiation"}
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
              {lang === "zh" ? "为什么选择 PCBforth 设计服务？" : "Why PCBforth Design Services?"}
            </h2>
            <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: C.muted }}>
              {lang === "zh"
                ? "PCBWay 和 JLCPCB 提供优质的 PCB 制造服务，但它们不提供工程设计支持。PCBforth 填补了这一空白。"
                : "PCBWay and JLCPCB offer excellent PCB manufacturing, but they don't provide engineering design support. PCBforth fills that gap."}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {differentiators.map((d, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }}
                className="p-6 rounded-xl"
                style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, boxShadow: "0 2px 12px rgba(21,101,232,0.06)" }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: C.blue }}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2" style={{ color: C.heading }}>
                      {lang === "zh" ? d.zh : d.en}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: C.body }}>
                      {lang === "zh" ? d.descZh : d.descEn}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Cards Grid ── */}
      <section className="py-14 px-8 lg:px-16" style={{ background: C.sectionAlt }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: C.blue }}>
              {lang === "zh" ? "服务项目" : "Our Services"}
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
              {lang === "zh" ? "7 项专业设计服务" : "7 Professional Design Services"}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc, i) => (
              <motion.div key={svc.path}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
                onClick={() => navigate(svc.path)}
                className="group cursor-pointer rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, boxShadow: "0 2px 12px rgba(21,101,232,0.06)" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(21,101,232,0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(21,101,232,0.06)")}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: svc.bgColor, color: svc.color }}>
                  {svc.icon}
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: C.heading }}>
                  {lang === "zh" ? svc.titleZh : svc.titleEn}
                </h3>
                <p className="text-xs leading-relaxed mb-4 line-clamp-3" style={{ color: C.body }}>
                  {lang === "zh" ? svc.descZh : svc.descEn}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(lang === "zh" ? svc.tagsZh : svc.tagsEn).map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: svc.bgColor, color: svc.color }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold transition-colors group-hover:gap-2"
                  style={{ color: svc.color }}>
                  {lang === "zh" ? "了解详情" : "Learn More"} <ChevronRight size={13} />
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
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
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
