// PCBforth — Blue-White Design
// White content area + Deep blue sidebar + Blue accent colors
// Fonts: Orbitron (tech titles) + Noto Sans SC (Chinese body)

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import PcbBackground from "@/components/PcbBackground";
import {
  Cpu, Layers, Package, Activity, Factory, Zap,
  Users, Award, Clock, CheckCircle, Phone, Mail, MapPin,
  ChevronRight, Menu, Globe, ArrowRight, Star, Shield, Wrench,
} from "lucide-react";

const HERO_IMG       = "https://d2xsxph8kpxj0f.cloudfront.net/310519663428091085/aYQJJtJvoY6MGcnCaXC5PY/hero-office-bQUscTaip2eHBcvkK4mirZ.webp";
const PCB_BOARD_BG   = "/manus-storage/pcb-board-clean_3b15713b.jpg";
const PCB_DESIGN_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663428091085/aYQJJtJvoY6MGcnCaXC5PY/pcb-design-work-bu97oMgGBiG2X2G5qGs3rS.webp";
const SMT_IMG        = "https://d2xsxph8kpxj0f.cloudfront.net/310519663428091085/aYQJJtJvoY6MGcnCaXC5PY/smt-factory-3eJXyeWZ5KdrtTWt6mUtaD.webp";
const PCB_CLOSEUP_IMG= "https://d2xsxph8kpxj0f.cloudfront.net/310519663428091085/aYQJJtJvoY6MGcnCaXC5PY/pcb-closeup-Cy9ukiz8EQ8effcUqLcBqY.webp";
const LOGO_IMG       = "https://d2xsxph8kpxj0f.cloudfront.net/310519663428091085/aYQJJtJvoY6MGcnCaXC5PY/pcbforth-logo-Z9kJow3e2Q7dj7GQKxa9kd.webp";

// ── Design tokens (Blue-White theme) ──
const C = {
  // Sidebar
  sidebarBg:      "#1A3A6B",        // deep navy blue
  sidebarBgDark:  "#122A52",        // darker navy for header/footer
  sidebarBorder:  "rgba(255,255,255,0.12)",
  sidebarText:    "#B8D4F8",
  sidebarActive:  "rgba(255,255,255,0.15)",
  sidebarActiveTxt:"#FFFFFF",
  // Content area
  pageBg:         "#F0F6FF",        // very light blue-white
  cardBg:         "#FFFFFF",
  cardBorder:     "#D0E4FF",
  sectionAlt:     "#EBF3FF",        // alternating section bg
  // Typography
  heading:        "#0D2A5E",        // deep navy
  body:           "#2C4A7A",        // medium navy
  muted:          "#6B8CB8",        // muted blue-grey
  // Accent
  blue:           "#1565E8",        // vivid blue
  blueDark:       "#0D4DC4",
  blueLight:      "#EBF3FF",
  cyan:           "#0EA5E9",
  // Divider
  divider:        "#C8DEFF",
};

type SectionId = "home"|"about"|"schematic"|"layout"|"bom"|"simulation"|"fabrication"|"smt"|"cases"|"contact";

interface NavItem {
  id: SectionId;
  icon: React.ReactNode;
  labelZh: string;
  labelEn: string;
  group?: string;
}

const navItems: NavItem[] = [
  { id: "home",        icon: <Zap size={15} />,      labelZh: "首页",       labelEn: "Home" },
  { id: "about",       icon: <Users size={15} />,    labelZh: "关于我们",   labelEn: "About Us" },
  { id: "schematic",   icon: <Activity size={15} />, labelZh: "PCB原理图",  labelEn: "Schematic",    group: "services" },
  { id: "layout",      icon: <Layers size={15} />,   labelZh: "PCB Layout", labelEn: "PCB Layout",   group: "services" },
  { id: "bom",         icon: <Package size={15} />,  labelZh: "元器件选型", labelEn: "BOM & Parts",  group: "services" },
  { id: "simulation",  icon: <Cpu size={15} />,      labelZh: "仿真分析",   labelEn: "Simulation",   group: "services" },
  { id: "fabrication", icon: <Wrench size={15} />,   labelZh: "制板工艺",   labelEn: "Fabrication",  group: "services" },
  { id: "smt",         icon: <Factory size={15} />,  labelZh: "SMT一站式",  labelEn: "SMT One-Stop", group: "services" },
  { id: "cases",       icon: <Award size={15} />,    labelZh: "合作案例",   labelEn: "Cases" },
  { id: "contact",     icon: <Phone size={15} />,    labelZh: "联系我们",   labelEn: "Contact" },
];

// ── Count-up animation hook ──
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ── Sub-components ──
function StatCard({ num, label, suffix = "+" }: { num: number; label: string; suffix?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(num, 1800, visible);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="text-center px-3">
      <div className="text-3xl font-bold font-mono tracking-tight" style={{ color: C.blue }}>{count}{suffix}</div>
      <div className="text-xs mt-1 tracking-wide" style={{ color: C.muted }}>{label}</div>
    </div>
  );
}

function CapabilityItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 py-2 px-3 rounded-lg border transition-all duration-200 hover:shadow-sm"
      style={{ background: C.blueLight, borderColor: C.cardBorder }}>
      <CheckCircle size={13} style={{ color: C.blue }} className="shrink-0" />
      <span className="text-sm" style={{ color: C.body }}>{text}</span>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-2">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-1 h-7 rounded-full" style={{ background: `linear-gradient(to bottom, ${C.cyan}, ${C.blue})` }} />
        <h2 className="text-2xl lg:text-3xl font-bold tracking-wide" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
          {title}
        </h2>
      </div>
      {subtitle && <p className="text-sm leading-relaxed pl-4 max-w-2xl" style={{ color: C.muted }}>{subtitle}</p>}
    </div>
  );
}

// ── PCB product types for fabrication gallery ──
const FAB_PRODUCTS = [
  {
    titleZh: "光模块产品",
    titleEn: "Optical Module PCB",
    descZh: "专为400G/800G光模块设计的高密度互联PCB，采用低损耗高频材料，支持超高速差分信号传输，广泛应用于数据中心、5G前传和骨干网光通信系统。",
    descEn: "High-density interconnect PCB designed for 400G/800G optical modules. Uses low-loss high-frequency materials supporting ultra-high-speed differential signal transmission for data centers, 5G fronthaul, and backbone optical networks.",
    img: "/manus-storage/pcb-optical-module_6bad39d1.png",
  },
  {
    titleZh: "5G TRX 板",
    titleEn: "5G TRX Board",
    descZh: "面向5G基站收发信机（TRX）的高频高速PCB，支持Sub-6GHz和毫米波频段，具备优异的信号完整性和热管理能力，满足5G大规模MIMO天线阵列需求。",
    descEn: "High-frequency, high-speed PCB for 5G base station transceivers (TRX). Supports Sub-6GHz and mmWave bands with excellent signal integrity and thermal management for massive MIMO antenna arrays.",
    img: "/manus-storage/pcb-5g-trx_2a3a780a.png",
  },
  {
    titleZh: "微波阶梯槽板",
    titleEn: "Microwave Stepped-Slot PCB",
    descZh: "微波阶梯槽板采用PTFE/Rogers等低损耗微波基材，通过精密铣槽工艺实现阶梯结构，广泛用于相控阵雷达、卫星通信和毫米波测试系统，具备极低插入损耗和优异的高频一致性。",
    descEn: "Microwave stepped-slot boards use PTFE/Rogers low-loss substrates with precision milled stepped structures. Widely used in phased-array radar, satellite communications, and mmWave test systems with ultra-low insertion loss.",
    img: "/manus-storage/pcb-microwave-stepped_47d74f97.png",
  },
  {
    titleZh: "医疗设备板",
    titleEn: "Medical Device PCB",
    descZh: "满足IEC 60601医疗电气安全标准，具备高可靠性、高精度、超低功耗特性，支持FDA 510(k)、CE医疗认证要求，广泛应用于监护仪、手术机器人、体外诊断等高端医疗设备。",
    descEn: "Meets IEC 60601 medical electrical safety standards with high reliability, precision, and ultra-low power. Supports FDA 510(k) and CE certification for patient monitors, surgical robots, and IVD equipment.",
    img: "/manus-storage/pcb-medical-device_3c0a0390.png",
  },
  {
    titleZh: "数模转换产品",
    titleEn: "DAC/ADC Converter PCB",
    descZh: "高速数模转换（DAC/ADC）PCB对信号完整性要求极高，PCBforth采用精密阻抗控制、低噪声电源分割和差分对等长布线，确保ADC/DAC在GHz采样率下的高精度转换性能。",
    descEn: "High-speed DAC/ADC PCBs demand extreme signal integrity. PCBforth uses precision impedance control, low-noise power partitioning, and matched differential routing to ensure high-accuracy conversion at GHz sampling rates.",
    img: "/manus-storage/pcb-dac-converter_60ed09dc.png",
  },
  {
    titleZh: "服务器主板",
    titleEn: "Server Motherboard PCB",
    descZh: "服务器主板对高密度布线、电源完整性和散热管理要求极高，PCBforth支持16层以上HDI设计，具备DDR5/PCIe 5.0高速信号布线能力，满足云计算、AI推理服务器的严苛需求。",
    descEn: "Server motherboards demand high-density routing, power integrity, and thermal management. PCBforth supports 16+ layer HDI with DDR5/PCIe 5.0 high-speed routing for cloud computing and AI inference servers.",
    img: "/manus-storage/pcb-server-board_6b36de6a.png",
  },
];



function FabricationGallery({ lang }: { lang: string }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <section className="relative py-14 px-8 lg:px-16" style={{ background: C.pageBg }}>
      <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.divider}, transparent)` }} />
      <div className="max-w-5xl">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: C.blue }}>
            {lang === "zh" ? "产品类型" : "Product Types"}
          </div>
          <h2 className="text-xl font-bold" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
            {lang === "zh" ? "PCB制板工艺 · 典型产品案例" : "PCB Fabrication · Product Showcase"}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
          {FAB_PRODUCTS.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45, delay: (i % 4) * 0.08 }}
              className="flex gap-0 rounded-xl overflow-hidden transition-shadow duration-300 group"
              style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`,
                boxShadow: "0 2px 10px rgba(21,101,232,0.06)" }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 24px rgba(21,101,232,0.14)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 10px rgba(21,101,232,0.06)")}>
              {/* Left: dark navy image box */}
              <div className="w-36 sm:w-40 shrink-0 relative overflow-hidden" style={{ background: "#0A1A3E", minHeight: "160px" }}>
                <img src={p.img} alt={lang === "zh" ? p.titleZh : p.titleEn}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  style={{ mixBlendMode: "luminosity" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,26,62,0.55) 0%, rgba(10,26,62,0.15) 100%)" }} />
              </div>
              {/* Right: text content */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base mb-2 leading-snug" style={{ color: C.blue, fontFamily: "'Orbitron', monospace" }}>
                    {lang === "zh" ? p.titleZh : p.titleEn}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: C.muted,
                    display: "-webkit-box", WebkitLineClamp: expanded === i ? 99 : 3,
                    WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
                    {lang === "zh" ? p.descZh : p.descEn}
                  </p>
                </div>
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="mt-3 self-start px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                  style={{
                    background: expanded === i ? C.blue : "#E8F0FE",
                    color: expanded === i ? "#fff" : C.muted,
                    border: `1px solid ${expanded === i ? C.blue : C.cardBorder}`,
                  }}
                  onMouseEnter={(e) => { if (expanded !== i) { e.currentTarget.style.background = C.blueLight; e.currentTarget.style.color = C.blue; } }}
                  onMouseLeave={(e) => { if (expanded !== i) { e.currentTarget.style.background = "#E8F0FE"; e.currentTarget.style.color = C.muted; } }}>
                  {expanded === i
                    ? (lang === "zh" ? "收起" : "Show less")
                    : (lang === "zh" ? "了解更多" : "Learn more")}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceSection({ id, title, desc, img, caps, imgLeft, specs }: {
  id: string; title: string; desc: string; img: string;
  caps: string[]; imgLeft: boolean;
  specs?: { label: string; value: string }[];
}) {
  const isAlt = ["layout", "simulation", "smt"].includes(id);
  return (
    <section id={`section-${id}`} className="relative py-16 px-8 lg:px-16"
      style={{ background: isAlt ? C.sectionAlt : C.pageBg }}>
      <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.divider}, transparent)` }} />
      <div className="max-w-5xl">
        <SectionHeader title={title} />
        <div className="grid lg:grid-cols-2 gap-10 mt-8">
          {imgLeft && (
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden h-64 lg:h-auto min-h-[260px] shadow-lg">
              <img src={img} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ border: `1px solid ${C.cardBorder}` }} />
            </motion.div>
          )}
          <motion.div initial={{ opacity: 0, x: imgLeft ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <p className="leading-relaxed mb-5 text-sm" style={{ color: C.body }}>{desc}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
              {caps.map((c) => <CapabilityItem key={c} text={c} />)}
            </div>
            {specs && (
              <div className="mt-4 rounded-xl overflow-hidden shadow-sm" style={{ border: `1px solid ${C.cardBorder}` }}>
                <table className="w-full text-xs">
                  <tbody>
                    {specs.map((s, i) => (
                      <tr key={s.label} style={{ background: i % 2 === 0 ? C.blueLight : C.cardBg }}>
                        <td className="px-3 py-2.5 font-semibold w-1/2" style={{ color: C.blue }}>{s.label}</td>
                        <td className="px-3 py-2.5 font-mono" style={{ color: C.heading }}>{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
          {!imgLeft && (
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden h-64 lg:h-auto min-h-[260px] shadow-lg">
              <img src={img} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ border: `1px solid ${C.cardBorder}` }} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function CaseCard({ title, desc, tags, img }: { title: string; desc: string; tags: string[]; img: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}
      className="rounded-xl overflow-hidden transition-all duration-300 group hover:-translate-y-1"
      style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, boxShadow: "0 2px 12px rgba(21,101,232,0.07)" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(21,101,232,0.15)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(21,101,232,0.07)")}>
      <div className="relative h-44 overflow-hidden">
        <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
              style={{ background: "rgba(21,101,232,0.75)", backdropFilter: "blur(4px)" }}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2 text-sm leading-snug" style={{ color: C.heading }}>{title}</h3>
        <p className="text-xs leading-relaxed line-clamp-3" style={{ color: C.muted }}>{desc}</p>
      </div>
    </motion.div>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl" style={{ background: C.blueLight, border: `1px solid ${C.cardBorder}` }}>
      <span style={{ color: C.blue }} className="mt-0.5">{icon}</span>
      <div>
        <div className="text-xs mb-0.5 font-medium" style={{ color: C.muted }}>{label}</div>
        <div className="text-sm font-medium" style={{ color: C.heading }}>{value}</div>
      </div>
    </div>
  );
}

function ContactForm({ lang, t }: { lang: string; t: (k: string) => string }) {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };
  const inputCls = "w-full px-4 py-3 rounded-lg text-sm focus:outline-none transition-all duration-200";
  const inputStyle = { background: C.cardBg, border: `1px solid ${C.cardBorder}`, color: C.heading };
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input type="text" placeholder={t("contact.form.name")} className={inputCls} style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = C.blue)} onBlur={(e) => (e.target.style.borderColor = C.cardBorder)} />
        <input type="text" placeholder={t("contact.form.company")} className={inputCls} style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = C.blue)} onBlur={(e) => (e.target.style.borderColor = C.cardBorder)} />
      </div>
      <input type="text" placeholder={t("contact.form.phone")} className={inputCls} style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = C.blue)} onBlur={(e) => (e.target.style.borderColor = C.cardBorder)} />
      <textarea rows={4} placeholder={t("contact.form.message")} className={`${inputCls} resize-none`} style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = C.blue)} onBlur={(e) => (e.target.style.borderColor = C.cardBorder)} />
      <button type="submit" className="w-full py-3.5 rounded-lg font-semibold text-white transition-all duration-200 active:scale-95"
        style={{ background: C.blue }}
        onMouseEnter={(e) => (e.currentTarget.style.background = C.blueDark)}
        onMouseLeave={(e) => (e.currentTarget.style.background = C.blue)}>
        {submitted
          ? (lang === "zh" ? "✓ 已提交，我们将尽快联系您" : "✓ Submitted! We'll contact you soon")
          : t("contact.form.submit")}
      </button>
    </form>
  );
}

function FlowStep({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-mono border-2 text-white"
        style={{ borderColor: C.blue, background: C.blue }}>
        {num}
      </div>
      <span className="text-xs text-center leading-tight max-w-[60px]" style={{ color: C.body }}>{label}</span>
    </div>
  );
}

function NavButton({ item, active, lang, onClick }: {
  item: NavItem; active: boolean; lang: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all duration-200"
      style={{
        background: active ? C.sidebarActive : "transparent",
        color: active ? C.sidebarActiveTxt : C.sidebarText,
        border: active ? `1px solid rgba(255,255,255,0.2)` : "1px solid transparent",
      }}>
      <span className="shrink-0" style={{ color: active ? "#FFFFFF" : "#7EB3F5" }}>{item.icon}</span>
      <span className="truncate">{lang === "zh" ? item.labelZh : item.labelEn}</span>
      {active && <ChevronRight size={11} className="ml-auto shrink-0 text-white" />}
    </button>
  );
}

// ── Main Page ──
export default function Home() {
  const { lang, setLang, t } = useLang();
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id);
    setMobileNavOpen(false);
    const el = document.getElementById(`section-${id}`);
    if (el && contentRef.current) {
      contentRef.current.scrollTo({ top: el.offsetTop - 24, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const handleScroll = () => {
      const sections = navItems.map((n) => document.getElementById(`section-${n.id}`));
      let current: SectionId = "home";
      sections.forEach((el) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          if (rect.top - containerRect.top < 200) current = el.id.replace("section-", "") as SectionId;
        }
      });
      setActiveSection(current);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const serviceGroups = navItems.filter((n) => n.group === "services");

  return (
    <div className="flex h-screen overflow-hidden relative font-sans" style={{ background: C.pageBg }}>

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 flex flex-col w-64
        transition-transform duration-300
        ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:flex shrink-0
      `} style={{ background: C.sidebarBg, borderRight: `1px solid ${C.sidebarBorder}` }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: `1px solid ${C.sidebarBorder}`, background: C.sidebarBgDark }}>
          <img src={LOGO_IMG} alt="PCBforth" className="w-9 h-9 object-contain" />
          <div>
            <div className="font-bold text-base tracking-widest text-white" style={{ fontFamily: "'Orbitron', monospace" }}>PCBforth</div>
            <div className="text-[10px] tracking-wider" style={{ color: "#7EB3F5" }}>PCB SOLUTIONS</div>
          </div>
        </div>

        {/* Language toggle — EN first for export site */}
        <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: `1px solid ${C.sidebarBorder}` }}>
          <Globe size={13} style={{ color: "#7EB3F5" }} />
          <button onClick={() => setLang("en")}
            className="text-xs px-2.5 py-1 rounded-full transition-all font-medium"
            style={{ background: lang === "en" ? "#FFFFFF" : "transparent", color: lang === "en" ? C.blue : C.sidebarText }}>
            EN
          </button>
          <button onClick={() => setLang("zh")}
            className="text-xs px-2.5 py-1 rounded-full transition-all font-medium"
            style={{ background: lang === "zh" ? "#FFFFFF" : "transparent", color: lang === "zh" ? C.blue : C.sidebarText }}>
            中文
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.filter((n) => !n.group).slice(0, 2).map((item) => (
            <NavButton key={item.id} item={item} active={activeSection === item.id} lang={lang} onClick={() => scrollToSection(item.id)} />
          ))}
          <div className="mt-4 mb-1">
            <div className="text-[10px] uppercase tracking-widest px-3 mb-2 font-semibold" style={{ color: "#5A8AC8" }}>
              {lang === "zh" ? "核心业务" : "Core Services"}
            </div>
            {serviceGroups.map((item) => (
              <NavButton key={item.id} item={item} active={activeSection === item.id} lang={lang} onClick={() => scrollToSection(item.id)} />
            ))}
          </div>
          <div className="mt-4">
            {navItems.filter((n) => !n.group).slice(2).map((item) => (
              <NavButton key={item.id} item={item} active={activeSection === item.id} lang={lang} onClick={() => scrollToSection(item.id)} />
            ))}
          </div>
        </nav>

        {/* Bottom contact */}
        <div className="px-5 py-4 space-y-1.5" style={{ borderTop: `1px solid ${C.sidebarBorder}`, background: C.sidebarBgDark }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: "#7EB3F5" }}>
            <Phone size={11} /> +86 400-888-8888
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "#7EB3F5" }}>
            <Mail size={11} /> info@pcbforth.com
          </div>
        </div>
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileNavOpen(false)} />
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 shrink-0 shadow-sm"
          style={{ background: C.sidebarBg, borderBottom: `1px solid ${C.sidebarBorder}` }}>
          <button onClick={() => setMobileNavOpen(true)} className="p-1" style={{ color: C.sidebarText }}>
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <img src={LOGO_IMG} alt="PCBforth" className="w-7 h-7" />
            <span className="font-bold tracking-widest text-sm text-white" style={{ fontFamily: "'Orbitron', monospace" }}>PCBforth</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setLang("en")} className="text-xs px-2 py-1 rounded font-medium"
              style={{ background: lang === "en" ? "#FFFFFF" : "transparent", color: lang === "en" ? C.blue : C.sidebarText }}>EN</button>
            <button onClick={() => setLang("zh")} className="text-xs px-2 py-1 rounded font-medium"
              style={{ background: lang === "zh" ? "#FFFFFF" : "transparent", color: lang === "zh" ? C.blue : C.sidebarText }}>中</button>
          </div>
        </header>

        <div ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth">

          {/* ── HERO ── */}
          <section id="section-home" className="relative min-h-screen flex flex-col justify-center overflow-hidden"
            style={{ background: C.sidebarBgDark }}>
            {/* Real PCB board photo background */}
            <div className="absolute inset-0">
              <img src={PCB_BOARD_BG} alt="PCB background" className="w-full h-full object-cover" style={{ objectPosition: "center center" }} />
              {/* Deep blue overlay — matches reference: dark navy tint over PCB board */}
              <div className="absolute inset-0" style={{ background: "rgba(8, 18, 50, 0.68)" }} />
              {/* Left gradient for text legibility */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(5,15,45,0.75) 0%, rgba(5,15,45,0.45) 55%, rgba(5,15,45,0.10) 100%)" }} />
            </div>

            <div className="relative z-10 px-8 lg:px-16 py-20 max-w-4xl">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-white/60" />
                  <span className="text-xs tracking-[0.3em] uppercase font-mono text-white/70">PCBforth Technology</span>
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
                <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-4"
                  style={{ fontFamily: "'Orbitron', monospace" }}>
                  {t("hero.title")}
                </h1>
                <p className="text-xl text-white/80 mb-10 leading-relaxed max-w-xl">{t("hero.subtitle")}</p>
                <div className="flex flex-wrap gap-4 mb-14">
                  <button onClick={() => scrollToSection("contact")}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-white transition-all duration-200 active:scale-95 text-sm shadow-lg"
                    style={{ background: C.blue }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = C.blueDark)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = C.blue)}>
                    {t("hero.cta1")} <ArrowRight size={15} />
                  </button>
                  <button onClick={() => scrollToSection("cases")}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold transition-all duration-200 active:scale-95 text-sm"
                    style={{ border: "1px solid rgba(255,255,255,0.4)", color: "#FFFFFF", background: "rgba(255,255,255,0.08)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}>
                    {t("hero.cta2")}
                  </button>
                </div>
                {/* Stats */}
                <div className="flex flex-wrap gap-8">
                  <StatCard num={500}  label={t("hero.stat1.label")} />
                  <div className="w-px bg-white/20" />
                  <StatCard num={15}   label={t("hero.stat2.label")} />
                  <div className="w-px bg-white/20" />
                  <StatCard num={50}   label={t("hero.stat3.label")} />
                  <div className="w-px bg-white/20" />
                  <StatCard num={1000} label={t("hero.stat4.label")} />
                </div>
              </motion.div>
            </div>

            {/* Service quick-access */}
            <div className="relative z-10 px-8 lg:px-16 pb-14">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 max-w-3xl">
                {serviceGroups.map((s, i) => (
                  <motion.button key={s.id}
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.4 }}
                    onClick={() => scrollToSection(s.id)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 group"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}>
                    <span className="text-white/70 group-hover:text-white transition-colors">{s.icon}</span>
                    <span className="text-[10px] text-white/60 group-hover:text-white transition-colors text-center leading-tight">
                      {lang === "zh" ? s.labelZh : s.labelEn}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Wave transition to white */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ display: "block" }}>
                <path d="M0,40 C360,0 1080,80 1440,20 L1440,60 L0,60 Z" fill={C.pageBg} />
              </svg>
            </div>
          </section>

          {/* ── ABOUT ── */}
          <section id="section-about" className="relative py-16 px-8 lg:px-16" style={{ background: C.pageBg }}>
            <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.divider}, transparent)` }} />
            <div className="max-w-5xl">
              <SectionHeader title={t("about.title")} />
              <div className="grid lg:grid-cols-2 gap-10 mt-8">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <p className="leading-relaxed mb-4 text-sm" style={{ color: C.body }}>{t("about.desc1")}</p>
                  <p className="leading-relaxed text-sm" style={{ color: C.body }}>{t("about.desc2")}</p>
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    {[
                      { icon: <Shield size={18} />, label: t("about.feature1") },
                      { icon: <Clock size={18} />,  label: t("about.feature2") },
                      { icon: <Star size={18} />,   label: t("about.feature3") },
                      { icon: <Users size={18} />,  label: t("about.feature4") },
                    ].map((f) => (
                      <div key={f.label} className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-sm"
                        style={{ background: C.blueLight, border: `1px solid ${C.cardBorder}` }}>
                        <span style={{ color: C.blue }}>{f.icon}</span>
                        <span className="text-sm font-medium" style={{ color: C.heading }}>{f.label}</span>
                      </div>
                    ))}
                  </div>
                  {/* Flow */}
                  <div className="mt-6 p-4 rounded-xl" style={{ background: C.blueLight, border: `1px solid ${C.cardBorder}` }}>
                    <div className="text-xs mb-3 tracking-wider uppercase font-semibold" style={{ color: C.blue }}>
                      {lang === "zh" ? "一站式服务流程" : "One-Stop Process"}
                    </div>
                    <div className="flex items-center gap-1 overflow-x-auto pb-1">
                      {(lang === "zh"
                        ? ["需求","原理图","Layout","仿真","制板","SMT","交付"]
                        : ["Req.","Sch.","Layout","Sim.","Fab.","SMT","Deliver"]
                      ).map((step, i, arr) => (
                        <div key={step} className="flex items-center gap-1 shrink-0">
                          <FlowStep num={String(i + 1)} label={step} />
                          {i < arr.length - 1 && <div className="w-4 h-px shrink-0" style={{ background: C.divider }} />}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className="relative rounded-2xl overflow-hidden h-72 lg:h-auto min-h-[280px] shadow-lg">
                  <img src={PCB_DESIGN_IMG} alt="PCB Design" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ border: `1px solid ${C.cardBorder}` }} />
                </motion.div>
              </div>
            </div>
          </section>

          {/* ── SERVICE SECTIONS ── */}
          <ServiceSection id="schematic" title={t("schematic.title")} desc={t("schematic.desc")}
            img={PCB_DESIGN_IMG} imgLeft={false}
            caps={[t("schematic.cap1"),t("schematic.cap2"),t("schematic.cap3"),t("schematic.cap4"),t("schematic.cap5"),t("schematic.cap6")]}
            specs={lang==="zh"
              ? [{label:"支持EDA工具",value:"Altium / Cadence / KiCad"},{label:"原理图规模",value:"最大10,000+网络"},{label:"交付周期",value:"3~10工作日"},{label:"设计审查",value:"DRC + EMC规则检查"}]
              : [{label:"EDA Tools",value:"Altium / Cadence / KiCad"},{label:"Schematic Scale",value:"Up to 10,000+ nets"},{label:"Lead Time",value:"3~10 business days"},{label:"Design Review",value:"DRC + EMC rule check"}]} />

          <ServiceSection id="layout" title={t("layout.title")} desc={t("layout.desc")}
            img={PCB_CLOSEUP_IMG} imgLeft={true}
            caps={[t("layout.cap1"),t("layout.cap2"),t("layout.cap3"),t("layout.cap4"),t("layout.cap5"),t("layout.cap6")]}
            specs={lang==="zh"
              ? [{label:"最大层数",value:"40层"},{label:"最小线宽/间距",value:"2mil / 2mil"},{label:"最小孔径",value:"0.1mm"},{label:"板厚范围",value:"0.4mm ~ 6.0mm"}]
              : [{label:"Max Layers",value:"40 layers"},{label:"Min Trace/Space",value:"2mil / 2mil"},{label:"Min Via Drill",value:"0.1mm"},{label:"Board Thickness",value:"0.4mm ~ 6.0mm"}]} />

          <ServiceSection id="bom" title={t("bom.title")} desc={t("bom.desc")}
            img="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" imgLeft={false}
            caps={[t("bom.cap1"),t("bom.cap2"),t("bom.cap3"),t("bom.cap4"),t("bom.cap5"),t("bom.cap6")]}
            specs={lang==="zh"
              ? [{label:"合作供应商",value:"TI / NXP / ST / Infineon等"},{label:"备货品类",value:"50,000+ SKU"},{label:"替代料响应",value:"24小时内"},{label:"价格优势",value:"较市场价低10~30%"}]
              : [{label:"Key Suppliers",value:"TI / NXP / ST / Infineon"},{label:"Stock SKUs",value:"50,000+"},{label:"Alt. Response",value:"Within 24 hours"},{label:"Price Advantage",value:"10~30% below market"}]} />

          <ServiceSection id="simulation" title={t("simulation.title")} desc={t("simulation.desc")}
            img="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80" imgLeft={true}
            caps={[t("simulation.cap1"),t("simulation.cap2"),t("simulation.cap3"),t("simulation.cap4"),t("simulation.cap5"),t("simulation.cap6")]}
            specs={lang==="zh"
              ? [{label:"仿真工具",value:"Ansys SIwave / HyperLynx / CST"},{label:"信号速率",value:"支持56Gbps PAM4"},{label:"频率范围",value:"DC ~ 100GHz"},{label:"报告交付",value:"含整改建议"}]
              : [{label:"Sim. Tools",value:"Ansys SIwave / HyperLynx / CST"},{label:"Signal Rate",value:"Up to 56Gbps PAM4"},{label:"Freq. Range",value:"DC ~ 100GHz"},{label:"Report",value:"With fix recommendations"}]} />

          <ServiceSection id="fabrication" title={t("fabrication.title")} desc={t("fabrication.desc")}
            img={PCB_CLOSEUP_IMG} imgLeft={false}
            caps={[t("fabrication.cap1"),t("fabrication.cap2"),t("fabrication.cap3"),t("fabrication.cap4"),t("fabrication.cap5"),t("fabrication.cap6")]}
            specs={lang==="zh"
              ? [{label:"板材类型",value:"FR4 / Rogers / 铝基 / 软硬结合"},{label:"最小线宽/间距",value:"2mil / 2mil"},{label:"表面处理",value:"ENIG / OSP / HASL / 沉銀"},{label:"阻抗控制",value:"±10%"}]
              : [{label:"Materials",value:"FR4 / Rogers / Al / Flex-Rigid"},{label:"Min Trace/Space",value:"2mil / 2mil"},{label:"Surface Finish",value:"ENIG / OSP / HASL / ImAg"},{label:"Impedance",value:"±10%"}]} />

          {/* ── FABRICATION PRODUCT GALLERY ── */}
          <FabricationGallery lang={lang} />

          <ServiceSection id="smt" title={t("smt.title")} desc={t("smt.desc")}
            img={SMT_IMG} imgLeft={true}
            caps={[t("smt.cap1"),t("smt.cap2"),t("smt.cap3"),t("smt.cap4"),t("smt.cap5"),t("smt.cap6")]}
            specs={lang==="zh"
              ? [{label:"最小封装",value:"0201 (0.6×0.3mm)"},{label:"贴片精度",value:"±25μm"},{label:"产线数量",value:"6条SMT产线"},{label:"日产能",value:"100万点/天"}]
              : [{label:"Min Package",value:"0201 (0.6×0.3mm)"},{label:"Placement Acc.",value:"±25μm"},{label:"SMT Lines",value:"6 production lines"},{label:"Daily Capacity",value:"1M placements/day"}]} />

          {/* ── CASES ── */}
          <section id="section-cases" className="relative py-16 px-8 lg:px-16" style={{ background: C.pageBg }}>
            <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.divider}, transparent)` }} />
            <div className="max-w-5xl">
              <SectionHeader title={t("cases.title")} subtitle={t("cases.subtitle")} />
              <div className="grid sm:grid-cols-2 gap-5 mt-8">
                <CaseCard title={t("cases.case1.title")} desc={t("cases.case1.desc")} img={PCB_DESIGN_IMG}
                  tags={[t("cases.case1.tag1"),t("cases.case1.tag2"),t("cases.case1.tag3")]} />
                <CaseCard title={t("cases.case2.title")} desc={t("cases.case2.desc")} img={PCB_CLOSEUP_IMG}
                  tags={[t("cases.case2.tag1"),t("cases.case2.tag2"),t("cases.case2.tag3")]} />
                <CaseCard title={t("cases.case3.title")} desc={t("cases.case3.desc")} img={SMT_IMG}
                  tags={[t("cases.case3.tag1"),t("cases.case3.tag2"),t("cases.case3.tag3")]} />
                <CaseCard title={t("cases.case4.title")} desc={t("cases.case4.desc")} img={HERO_IMG}
                  tags={[t("cases.case4.tag1"),t("cases.case4.tag2"),t("cases.case4.tag3")]} />
              </div>

              {/* Industries */}
              <div className="mt-10">
                <div className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: C.blue }}>
                  {lang === "zh" ? "应用领域" : "Industries Served"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(lang==="zh"
                    ? ["5G通信","消费电子","工业控制","医疗设备","汽车电子","航空航天","新能源","智能家居"]
                    : ["5G Telecom","Consumer Electronics","Industrial Control","Medical Devices","Automotive","Aerospace","New Energy","Smart Home"]
                  ).map((ind) => (
                    <span key={ind} className="px-3 py-1.5 text-xs rounded-full font-medium transition-all cursor-default"
                      style={{ background: C.blueLight, border: `1px solid ${C.cardBorder}`, color: C.blue }}>
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Partners */}
              <div className="mt-8">
                <div className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: C.blue }}>
                  {lang === "zh" ? "合作伙伴" : "Partners"}
                </div>
                <div className="flex flex-wrap gap-3">
                  {["Huawei","Lenovo","Foxconn","BYD","DJI","Hikvision","OPPO","Xiaomi"].map((p) => (
                    <div key={p} className="px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all"
                      style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, color: C.heading,
                        boxShadow: "0 1px 4px rgba(21,101,232,0.06)" }}>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── CONTACT ── */}
          <section id="section-contact" className="relative py-16 px-8 lg:px-16" style={{ background: C.sectionAlt }}>
            <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.divider}, transparent)` }} />
            <div className="max-w-5xl">
              <SectionHeader title={t("contact.title")} />
              <div className="grid lg:grid-cols-2 gap-10 mt-8">
                <div className="space-y-4">
                  <ContactItem icon={<Phone size={16} />} label={t("contact.phone")} value="+86 755-8888-8888  |  +86 400-888-8888" />
                  {/* Enterprise email addresses */}
                  <div className="rounded-xl overflow-hidden shadow-sm" style={{ border: `1px solid ${C.cardBorder}` }}>
                    <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider" style={{ background: C.blueLight, color: C.blue }}>
                      {lang === "zh" ? "企业邮箱" : "Enterprise Email"}
                    </div>
                    {[
                      { role: lang === "zh" ? "销售咨询" : "Sales",   addr: "sales@pcbforth.com" },
                      { role: lang === "zh" ? "技术支持" : "Support", addr: "support@pcbforth.com" },
                      { role: lang === "zh" ? "快速报价" : "Quote",   addr: "quote@pcbforth.com" },
                      { role: lang === "zh" ? "综合业务" : "General", addr: "info@pcbforth.com" },
                    ].map((e) => (
                      <a key={e.addr} href={`mailto:${e.addr}`}
                        className="flex items-center justify-between px-4 py-2.5 transition-colors group"
                        style={{ background: C.cardBg, borderTop: `1px solid ${C.cardBorder}` }}
                        onMouseEnter={(el) => (el.currentTarget.style.background = C.blueLight)}
                        onMouseLeave={(el) => (el.currentTarget.style.background = C.cardBg)}>
                        <span className="text-xs font-medium" style={{ color: C.muted }}>{e.role}</span>
                        <span className="text-xs font-mono font-semibold" style={{ color: C.blue }}>{e.addr}</span>
                      </a>
                    ))}
                  </div>
                  <ContactItem icon={<MapPin size={16} />} label={t("contact.address")} value={t("contact.address.val")} />
                  <div className="p-4 rounded-xl" style={{ background: C.cardBg, border: `1px solid ${C.blue}33` }}>
                    <div className="text-xs mb-1 font-semibold" style={{ color: C.blue }}>
                      {lang === "zh" ? "工作时间" : "Business Hours"}
                    </div>
                    <div className="text-sm font-semibold" style={{ color: C.heading }}>
                      {lang === "zh" ? "周一至周五 09:00 – 18:00" : "Mon – Fri  09:00 – 18:00 (UTC+8)"}
                    </div>
                    <div className="text-xs mt-1" style={{ color: C.muted }}>
                      {lang === "zh" ? "紧急项目可7×24小时联系" : "Urgent projects: 7×24 available"}
                    </div>
                  </div>

                </div>
                <div className="p-6 rounded-2xl shadow-sm" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
                  <ContactForm lang={lang} t={t} />
                </div>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="relative py-8 px-8 lg:px-16" style={{ background: C.sidebarBgDark, borderTop: `1px solid ${C.sidebarBorder}` }}>
            <div className="max-w-5xl">
              {/* Top row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <img src={LOGO_IMG} alt="PCBforth" className="w-8 h-8" />
                  <div>
                    <div className="font-bold text-sm tracking-widest text-white" style={{ fontFamily: "'Orbitron', monospace" }}>PCBforth</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "#7EB3F5" }}>{t("footer.slogan")}</div>
                  </div>
                </div>
                {/* Social icons row */}
                <div className="flex items-center gap-2">
                  {[
                    { name: "LinkedIn",  href: "https://linkedin.com/company/pcbforth", color: "#0A66C2", icon: "in" },
                    { name: "Twitter",   href: "https://twitter.com/pcbforth",          color: "#1DA1F2", icon: "𝕏" },
                    { name: "YouTube",   href: "https://youtube.com/@pcbforth",          color: "#FF0000", icon: "▶" },
                    { name: "Facebook",  href: "https://facebook.com/pcbforth",          color: "#1877F2", icon: "f" },
                    { name: "WhatsApp",  href: "https://wa.me/8675588888888",            color: "#25D366", icon: "W" },
                  ].map((s) => (
                    <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                      title={s.name}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold transition-transform hover:scale-110"
                      style={{ background: s.color }}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
              {/* Email quick links */}
              <div className="flex flex-wrap gap-4 mb-5 pb-5" style={{ borderBottom: `1px solid ${C.sidebarBorder}` }}>
                {[
                  { label: lang === "zh" ? "销售" : "Sales",   addr: "sales@pcbforth.com" },
                  { label: lang === "zh" ? "技术" : "Support", addr: "support@pcbforth.com" },
                  { label: lang === "zh" ? "报价" : "Quote",   addr: "quote@pcbforth.com" },
                  { label: lang === "zh" ? "综合" : "General", addr: "info@pcbforth.com" },
                ].map((e) => (
                  <a key={e.addr} href={`mailto:${e.addr}`}
                    className="flex items-center gap-1.5 text-xs transition-colors hover:text-white"
                    style={{ color: "#7EB3F5" }}>
                    <Mail size={11} />
                    <span className="font-medium" style={{ color: "#5A8AC8" }}>{e.label}:</span>
                    {e.addr}
                  </a>
                ))}
              </div>
              {/* Bottom row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-xs" style={{ color: "#4A7AB5" }}>{t("footer.rights")}</div>
                <div className="flex gap-4 text-xs" style={{ color: "#4A7AB5" }}>
                  <a href="#" className="hover:text-white transition-colors">{lang === "zh" ? "隐私政策" : "Privacy Policy"}</a>
                  <a href="#" className="hover:text-white transition-colors">{lang === "zh" ? "服务条款" : "Terms of Service"}</a>
                  <a href="#" className="hover:text-white transition-colors">{lang === "zh" ? "网站地图" : "Sitemap"}</a>
                </div>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}
