// Shared layout for all Design Services sub-pages
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight, ChevronRight, Globe, Phone, Mail, CheckCircle } from "lucide-react";
import { useState } from "react";

export const C = {
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

export function PcbLogo({ size = 36 }: { size?: number }) {
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

export interface ServiceSpec {
  labelZh: string;
  labelEn: string;
  value: string;
}

export interface ServiceWorkflowStep {
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
}

export interface ServicePageProps {
  accentColor: string;
  accentBg: string;
  icon: React.ReactNode;
  titleZh: string;
  titleEn: string;
  subtitleZh: string;
  subtitleEn: string;
  descZh: string;
  descEn: string;
  capabilitiesZh: string[];
  capabilitiesEn: string[];
  specs: ServiceSpec[];
  workflow: ServiceWorkflowStep[];
  faqZh?: { q: string; a: string }[];
  faqEn?: { q: string; a: string }[];
}

export function ServicePageLayout(props: ServicePageProps) {
  const [, navigate] = useLocation();
  const [lang, setLang] = useState<"zh" | "en">("en");
  const [activeStep, setActiveStep] = useState(0);

  const {
    accentColor, accentBg, icon,
    titleZh, titleEn, subtitleZh, subtitleEn,
    descZh, descEn,
    capabilitiesZh, capabilitiesEn,
    specs, workflow,
    faqZh, faqEn,
  } = props;

  return (
    <div className="min-h-screen font-sans" style={{ background: C.pageBg }}>

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 shadow-sm"
        style={{ background: C.sidebarBgDark, borderBottom: `1px solid ${C.sidebarBorder}` }}>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <PcbLogo size={26} />
            <span className="font-bold tracking-widest text-white hidden sm:block" style={{ fontFamily: "'Orbitron', monospace", fontSize: "12px" }}>PCBforth</span>
          </button>
          <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          <button onClick={() => navigate("/design-services")} className="hover:opacity-80 transition-opacity"
            style={{ color: "#7EB3F5", fontSize: "12px" }}>
            {lang === "zh" ? "设计服务" : "Design Services"}
          </button>
          <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          <span style={{ color: "#FFFFFF", fontSize: "12px" }} className="hidden sm:block">
            {lang === "zh" ? titleZh : titleEn}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Globe size={12} style={{ color: "#7EB3F5" }} />
            <button onClick={() => setLang("en")}
              className="text-xs px-2 py-0.5 rounded-full transition-all font-medium"
              style={{ background: lang === "en" ? "#FFFFFF" : "transparent", color: lang === "en" ? C.blue : "#B8D4F8" }}>EN</button>
            <button onClick={() => setLang("zh")}
              className="text-xs px-2 py-0.5 rounded-full transition-all font-medium"
              style={{ background: lang === "zh" ? "#FFFFFF" : "transparent", color: lang === "zh" ? C.blue : "#B8D4F8" }}>中文</button>
          </div>
          <button onClick={() => navigate("/quote")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
            style={{ background: C.blue }}>
            {lang === "zh" ? "获取报价" : "Get Quote"} <ArrowRight size={11} />
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative py-16 px-8 lg:px-16 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${C.sidebarBgDark} 0%, #1A3A6B 70%, #1E4080 100%)` }}>
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: accentBg, color: accentColor }}>
                {icon}
              </div>
              <div>
                <div className="text-xs tracking-widest uppercase font-mono mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                  PCBforth Design Services
                </div>
                <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight"
                  style={{ fontFamily: "'Orbitron', monospace" }}>
                  {lang === "zh" ? titleZh : titleEn}
                </h1>
              </div>
            </div>
            <p className="text-base text-white/70 mb-3 max-w-2xl leading-relaxed">
              {lang === "zh" ? subtitleZh : subtitleEn}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <button onClick={() => navigate("/quote")}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white text-sm shadow-lg transition-all active:scale-95"
                style={{ background: accentColor }}>
                {lang === "zh" ? "立即获取报价" : "Get a Quote Now"} <ArrowRight size={14} />
              </button>
              <button onClick={() => navigate("/design-services")}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#FFFFFF", background: "rgba(255,255,255,0.08)" }}>
                {lang === "zh" ? "查看全部服务" : "All Design Services"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Description + Capabilities ── */}
      <section className="py-14 px-8 lg:px-16" style={{ background: C.pageBg }}>
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-7 rounded-full" style={{ background: `linear-gradient(to bottom, ${C.cyan}, ${accentColor})` }} />
              <h2 className="text-xl font-bold" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
                {lang === "zh" ? "服务说明" : "Service Overview"}
              </h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: C.body }}>
              {lang === "zh" ? descZh : descEn}
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-7 rounded-full" style={{ background: `linear-gradient(to bottom, ${C.cyan}, ${accentColor})` }} />
              <h2 className="text-xl font-bold" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
                {lang === "zh" ? "服务能力" : "Capabilities"}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(lang === "zh" ? capabilitiesZh : capabilitiesEn).map((cap) => (
                <div key={cap} className="flex items-center gap-2.5 py-2 px-3 rounded-lg border"
                  style={{ background: C.blueLight, borderColor: C.cardBorder }}>
                  <CheckCircle size={13} style={{ color: accentColor }} className="shrink-0" />
                  <span className="text-xs" style={{ color: C.body }}>{cap}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Workflow Steps ── */}
      <section className="py-14 px-8 lg:px-16" style={{ background: C.sectionAlt }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-7 rounded-full" style={{ background: `linear-gradient(to bottom, ${C.cyan}, ${accentColor})` }} />
            <h2 className="text-xl font-bold" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
              {lang === "zh" ? "服务流程" : "Service Workflow"}
            </h2>
          </div>
          {/* Step tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {workflow.map((step, i) => (
              <button key={i} onClick={() => setActiveStep(i)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: activeStep === i ? accentColor : C.blueLight,
                  color: activeStep === i ? "#FFFFFF" : C.body,
                  border: `1px solid ${activeStep === i ? accentColor : C.cardBorder}`,
                }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: activeStep === i ? "rgba(255,255,255,0.25)" : accentColor, color: "#fff" }}>
                  {i + 1}
                </span>
                {lang === "zh" ? step.titleZh : step.titleEn}
              </button>
            ))}
          </div>
          <motion.div key={activeStep}
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
            className="p-6 rounded-xl"
            style={{ background: C.cardBg, border: `1px solid ${accentColor}33` }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: accentColor }}>
                {activeStep + 1}
              </div>
              <div>
                <h3 className="font-bold text-base mb-2" style={{ color: C.heading }}>
                  {lang === "zh" ? workflow[activeStep].titleZh : workflow[activeStep].titleEn}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: C.body }}>
                  {lang === "zh" ? workflow[activeStep].descZh : workflow[activeStep].descEn}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Specs Table ── */}
      <section className="py-14 px-8 lg:px-16" style={{ background: C.pageBg }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-7 rounded-full" style={{ background: `linear-gradient(to bottom, ${C.cyan}, ${accentColor})` }} />
            <h2 className="text-xl font-bold" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
              {lang === "zh" ? "技术规格" : "Technical Specifications"}
            </h2>
          </div>
          <div className="rounded-xl overflow-hidden shadow-sm max-w-2xl" style={{ border: `1px solid ${C.cardBorder}` }}>
            <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
              style={{ background: C.blueLight, color: accentColor }}>
              {lang === "zh" ? "规格参数" : "Specifications"}
            </div>
            <table className="w-full text-sm">
              <tbody>
                {specs.map((s, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? C.cardBg : C.blueLight }}>
                    <td className="px-4 py-3 font-semibold w-1/2" style={{ color: accentColor }}>
                      {lang === "zh" ? s.labelZh : s.labelEn}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: C.heading }}>{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ (optional) ── */}
      {faqZh && faqEn && (
        <section className="py-14 px-8 lg:px-16" style={{ background: C.sectionAlt }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 rounded-full" style={{ background: `linear-gradient(to bottom, ${C.cyan}, ${accentColor})` }} />
              <h2 className="text-xl font-bold" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
                {lang === "zh" ? "常见问题" : "FAQ"}
              </h2>
            </div>
            <div className="space-y-4 max-w-3xl">
              {(lang === "zh" ? faqZh : faqEn).map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="p-5 rounded-xl"
                  style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
                  <h4 className="font-semibold text-sm mb-2" style={{ color: accentColor }}>Q: {item.q}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: C.body }}>A: {item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-14 px-8 lg:px-16" style={{ background: C.sidebarBgDark }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Orbitron', monospace" }}>
            {lang === "zh" ? `开始您的${titleZh}项目` : `Start Your ${titleEn} Project`}
          </h2>
          <p className="text-white/60 mb-7 text-sm">
            {lang === "zh"
              ? "上传设计文件，我们的工程师将在 24 小时内回复。"
              : "Upload your design files and our engineers will respond within 24 hours."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => navigate("/quote")}
              className="flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-white text-sm shadow-lg transition-all active:scale-95"
              style={{ background: accentColor }}>
              {lang === "zh" ? "上传文件获取报价" : "Upload Files & Get Quote"} <ArrowRight size={14} />
            </button>
            <a href="mailto:sales@pcbforth.com"
              className="flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#FFFFFF", background: "rgba(255,255,255,0.08)" }}>
              <Mail size={13} /> sales@pcbforth.com
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-5 px-8 lg:px-16" style={{ background: "#0D1E3A", borderTop: `1px solid ${C.sidebarBorder}` }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PcbLogo size={22} />
            <span className="text-xs font-bold tracking-widest text-white" style={{ fontFamily: "'Orbitron', monospace" }}>PCBforth</span>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: "#4A7AB5" }}>
            <a href="tel:+8675588888888" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone size={10} /> +86 755-8888-8888
            </a>
            <a href="mailto:info@pcbforth.com" className="flex items-center gap-1 hover:text-white transition-colors">
              <Mail size={10} /> info@pcbforth.com
            </a>
          </div>
          <div className="text-xs" style={{ color: "#4A7AB5" }}>© 2025 PCBforth Technology.</div>
        </div>
      </footer>
    </div>
  );
}
