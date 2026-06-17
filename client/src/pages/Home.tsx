// PCBforth — Blueprint Tech Design
// Deep navy blue + PCB trace background + Left sidebar nav + Right content area
// Fonts: Orbitron (tech titles) + Noto Sans SC (Chinese body)

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import PcbBackground from "@/components/PcbBackground";
import {
  Cpu, Layers, Package, Activity, Factory, Zap,
  Users, Award, Clock, CheckCircle, Phone, Mail, MapPin,
  ChevronRight, Menu, Globe, ArrowRight, Star, Shield, Wrench,
  TrendingUp, BarChart2, Microscope, Settings
} from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663428091085/aYQJJtJvoY6MGcnCaXC5PY/hero-office-bQUscTaip2eHBcvkK4mirZ.webp";
const PCB_DESIGN_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663428091085/aYQJJtJvoY6MGcnCaXC5PY/pcb-design-work-bu97oMgGBiG2X2G5qGs3rS.webp";
const SMT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663428091085/aYQJJtJvoY6MGcnCaXC5PY/smt-factory-3eJXyeWZ5KdrtTWt6mUtaD.webp";
const PCB_CLOSEUP_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663428091085/aYQJJtJvoY6MGcnCaXC5PY/pcb-closeup-Cy9ukiz8EQ8effcUqLcBqY.webp";
const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663428091085/aYQJJtJvoY6MGcnCaXC5PY/pcbforth-logo-Z9kJow3e2Q7dj7GQKxa9kd.webp";

type SectionId = "home" | "about" | "schematic" | "layout" | "bom" | "simulation" | "fabrication" | "smt" | "cases" | "contact";

interface NavItem {
  id: SectionId;
  icon: React.ReactNode;
  labelZh: string;
  labelEn: string;
  group?: string;
}

const navItems: NavItem[] = [
  { id: "home", icon: <Zap size={15} />, labelZh: "首页", labelEn: "Home" },
  { id: "about", icon: <Users size={15} />, labelZh: "关于我们", labelEn: "About Us" },
  { id: "schematic", icon: <Activity size={15} />, labelZh: "PCB原理图", labelEn: "Schematic", group: "services" },
  { id: "layout", icon: <Layers size={15} />, labelZh: "PCB Layout", labelEn: "PCB Layout", group: "services" },
  { id: "bom", icon: <Package size={15} />, labelZh: "元器件选型", labelEn: "BOM & Parts", group: "services" },
  { id: "simulation", icon: <Cpu size={15} />, labelZh: "仿真分析", labelEn: "Simulation", group: "services" },
  { id: "fabrication", icon: <Wrench size={15} />, labelZh: "制板工艺", labelEn: "Fabrication", group: "services" },
  { id: "smt", icon: <Factory size={15} />, labelZh: "SMT一站式", labelEn: "SMT One-Stop", group: "services" },
  { id: "cases", icon: <Award size={15} />, labelZh: "合作案例", labelEn: "Cases" },
  { id: "contact", icon: <Phone size={15} />, labelZh: "联系我们", labelEn: "Contact" },
];

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
    <div ref={ref} className="text-center px-2">
      <div className="text-3xl font-bold text-[#00D4FF] font-mono tracking-tight">{count}{suffix}</div>
      <div className="text-xs text-blue-400 mt-1 tracking-wide">{label}</div>
    </div>
  );
}

function CapabilityItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-white/5 border border-blue-500/20 hover:border-blue-400/50 hover:bg-blue-500/10 transition-all duration-200">
      <CheckCircle size={13} className="text-[#00D4FF] shrink-0" />
      <span className="text-sm text-blue-100">{text}</span>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-2">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-1 h-7 bg-gradient-to-b from-[#00D4FF] to-[#1E90FF] rounded-full" />
        <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-wide" style={{ fontFamily: "'Orbitron', monospace" }}>
          {title}
        </h2>
      </div>
      {subtitle && <p className="text-blue-300/80 text-sm leading-relaxed pl-4 max-w-2xl">{subtitle}</p>}
    </div>
  );
}

function ServiceSection({
  id, title, desc, img, caps, imgLeft, specs,
}: {
  id: string; title: string; desc: string; img: string; caps: string[]; imgLeft: boolean;
  specs?: { label: string; value: string }[];
}) {
  return (
    <section id={`section-${id}`} className="relative py-16 px-8 lg:px-16">
      {/* subtle separator */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="max-w-5xl">
        <SectionHeader title={title} />
        <div className={`grid lg:grid-cols-2 gap-10 mt-8`}>
          {imgLeft && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden h-64 lg:h-auto min-h-[260px]"
            >
              <img src={img} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/70 via-transparent to-transparent" />
              <div className="absolute inset-0 border border-blue-500/20 rounded-2xl pointer-events-none" />
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, x: imgLeft ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-blue-200/90 leading-relaxed mb-5 text-sm">{desc}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
              {caps.map((c) => <CapabilityItem key={c} text={c} />)}
            </div>
            {specs && (
              <div className="mt-4 rounded-xl overflow-hidden border border-blue-500/20">
                <table className="w-full text-xs">
                  <tbody>
                    {specs.map((s, i) => (
                      <tr key={s.label} className={i % 2 === 0 ? "bg-white/5" : "bg-transparent"}>
                        <td className="px-3 py-2 text-blue-400 font-medium w-1/2">{s.label}</td>
                        <td className="px-3 py-2 text-blue-100 font-mono">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
          {!imgLeft && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden h-64 lg:h-auto min-h-[260px]"
            >
              <img src={img} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/70 via-transparent to-transparent" />
              <div className="absolute inset-0 border border-blue-500/20 rounded-2xl pointer-events-none" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function CaseCard({ title, desc, tags, img }: { title: string; desc: string; tags: string[]; img: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-xl overflow-hidden border border-blue-500/20 bg-white/5 backdrop-blur-sm hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(30,144,255,0.12)] transition-all duration-300 group"
    >
      <div className="relative h-44 overflow-hidden">
        <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/90 via-[#0A1628]/30 to-transparent" />
        <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[#1E90FF]/30 border border-[#1E90FF]/50 text-blue-200">{tag}</span>
          ))}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 text-sm leading-snug">{title}</h3>
        <p className="text-xs text-blue-300/80 leading-relaxed line-clamp-3">{desc}</p>
      </div>
    </motion.div>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-blue-500/20">
      <span className="text-[#1E90FF] mt-0.5">{icon}</span>
      <div>
        <div className="text-xs text-blue-500 mb-0.5">{label}</div>
        <div className="text-blue-100 text-sm">{value}</div>
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
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input type="text" placeholder={t("contact.form.name")}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-500/20 text-white placeholder-blue-600 text-sm focus:outline-none focus:border-[#1E90FF] transition-colors" />
        <input type="text" placeholder={t("contact.form.company")}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-500/20 text-white placeholder-blue-600 text-sm focus:outline-none focus:border-[#1E90FF] transition-colors" />
      </div>
      <input type="text" placeholder={t("contact.form.phone")}
        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-500/20 text-white placeholder-blue-600 text-sm focus:outline-none focus:border-[#1E90FF] transition-colors" />
      <textarea rows={4} placeholder={t("contact.form.message")}
        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-500/20 text-white placeholder-blue-600 text-sm focus:outline-none focus:border-[#1E90FF] transition-colors resize-none" />
      <button type="submit"
        className="w-full py-3.5 bg-[#1E90FF] hover:bg-[#1a7fe0] text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-[0_0_20px_rgba(30,144,255,0.4)] active:scale-95">
        {submitted ? (lang === "zh" ? "✓ 已提交，我们将尽快联系您" : "✓ Submitted! We'll contact you soon") : t("contact.form.submit")}
      </button>
    </form>
  );
}

// Process flow step
function FlowStep({ num, label, active }: { num: string; label: string; active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${active ? "opacity-100" : "opacity-60"}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-mono border-2 ${active ? "border-[#1E90FF] bg-[#1E90FF]/20 text-[#00D4FF]" : "border-blue-700 bg-transparent text-blue-500"}`}>
        {num}
      </div>
      <span className="text-xs text-blue-300 text-center leading-tight max-w-[60px]">{label}</span>
    </div>
  );
}

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
          if (rect.top - containerRect.top < 200) {
            current = el.id.replace("section-", "") as SectionId;
          }
        }
      });
      setActiveSection(current);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const serviceGroups = navItems.filter((n) => n.group === "services");

  return (
    <div className="flex h-screen bg-[#0A1628] overflow-hidden relative font-sans">
      {/* Global PCB background */}
      <div className="absolute inset-0 z-0">
        <PcbBackground />
      </div>

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 flex flex-col
        w-64 bg-[#060E1A]/96 backdrop-blur-xl border-r border-blue-500/20
        transition-transform duration-300
        ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:flex shrink-0
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-blue-500/20">
          <img src={LOGO_IMG} alt="PCBforth" className="w-9 h-9 object-contain" />
          <div>
            <div className="text-white font-bold text-base tracking-widest" style={{ fontFamily: "'Orbitron', monospace" }}>PCBforth</div>
            <div className="text-blue-500 text-[10px] tracking-wider">PCB SOLUTIONS</div>
          </div>
        </div>

        {/* Language toggle */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-blue-500/10">
          <Globe size={13} className="text-blue-500" />
          <button onClick={() => setLang("zh")}
            className={`text-xs px-2.5 py-1 rounded-full transition-all font-medium ${lang === "zh" ? "bg-[#1E90FF] text-white shadow-[0_0_10px_rgba(30,144,255,0.4)]" : "text-blue-400 hover:text-white"}`}>
            中文
          </button>
          <button onClick={() => setLang("en")}
            className={`text-xs px-2.5 py-1 rounded-full transition-all font-medium ${lang === "en" ? "bg-[#1E90FF] text-white shadow-[0_0_10px_rgba(30,144,255,0.4)]" : "text-blue-400 hover:text-white"}`}>
            EN
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.filter((n) => !n.group).slice(0, 2).map((item) => (
            <NavButton key={item.id} item={item} active={activeSection === item.id} lang={lang} onClick={() => scrollToSection(item.id)} />
          ))}

          <div className="mt-4 mb-1">
            <div className="text-[10px] text-blue-700 uppercase tracking-widest px-3 mb-2 font-medium">
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

        {/* Bottom info */}
        <div className="px-5 py-4 border-t border-blue-500/20 space-y-1">
          <div className="flex items-center gap-2 text-xs text-blue-500">
            <Phone size={11} /> +86 400-888-8888
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-500">
            <Mail size={11} /> info@pcbforth.com
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileNavOpen(false)} />
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#060E1A]/90 backdrop-blur-xl border-b border-blue-500/20 shrink-0">
          <button onClick={() => setMobileNavOpen(true)} className="text-blue-300 hover:text-white p-1">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <img src={LOGO_IMG} alt="PCBforth" className="w-7 h-7" />
            <span className="text-white font-bold tracking-widest text-sm" style={{ fontFamily: "'Orbitron', monospace" }}>PCBforth</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setLang("zh")} className={`text-xs px-2 py-1 rounded ${lang === "zh" ? "bg-[#1E90FF] text-white" : "text-blue-400"}`}>中</button>
            <button onClick={() => setLang("en")} className={`text-xs px-2 py-1 rounded ${lang === "en" ? "bg-[#1E90FF] text-white" : "text-blue-400"}`}>EN</button>
          </div>
        </header>

        {/* Scrollable content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth">

          {/* ── HERO ── */}
          <section id="section-home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
            <div className="absolute inset-0">
              <img src={HERO_IMG} alt="hero" className="w-full h-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/98 via-[#0A1628]/75 to-[#0A1628]/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/80 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 px-8 lg:px-16 py-20 max-w-4xl">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-[#1E90FF]" />
                  <span className="text-[#1E90FF] text-xs tracking-[0.3em] uppercase font-mono">PCBforth Technology</span>
                  <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
                </div>
                <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-4" style={{ fontFamily: "'Orbitron', monospace" }}>
                  {t("hero.title")}
                </h1>
                <p className="text-xl text-blue-200/90 mb-10 leading-relaxed max-w-xl">
                  {t("hero.subtitle")}
                </p>
                <div className="flex flex-wrap gap-4 mb-14">
                  <button onClick={() => scrollToSection("contact")}
                    className="flex items-center gap-2 px-7 py-3.5 bg-[#1E90FF] hover:bg-[#1a7fe0] text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-[0_0_25px_rgba(30,144,255,0.5)] active:scale-95 text-sm">
                    {t("hero.cta1")} <ArrowRight size={15} />
                  </button>
                  <button onClick={() => scrollToSection("cases")}
                    className="flex items-center gap-2 px-7 py-3.5 border border-[#1E90FF]/50 text-blue-300 hover:text-white hover:border-[#1E90FF] rounded-lg font-semibold transition-all duration-200 active:scale-95 text-sm backdrop-blur-sm">
                    {t("hero.cta2")}
                  </button>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap gap-8">
                  <StatCard num={500} label={t("hero.stat1.label")} />
                  <div className="w-px bg-blue-800" />
                  <StatCard num={15} label={t("hero.stat2.label")} />
                  <div className="w-px bg-blue-800" />
                  <StatCard num={50} label={t("hero.stat3.label")} />
                  <div className="w-px bg-blue-800" />
                  <StatCard num={1000} label={t("hero.stat4.label")} />
                </div>
              </motion.div>
            </div>

            {/* Service quick-access grid */}
            <div className="relative z-10 px-8 lg:px-16 pb-14">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 max-w-3xl">
                {serviceGroups.map((s, i) => (
                  <motion.button
                    key={s.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.4 }}
                    onClick={() => scrollToSection(s.id)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 border border-blue-500/20 hover:bg-[#1E90FF]/15 hover:border-[#1E90FF]/50 transition-all duration-200 group"
                  >
                    <span className="text-blue-500 group-hover:text-[#00D4FF] transition-colors">{s.icon}</span>
                    <span className="text-[10px] text-blue-400 group-hover:text-white transition-colors text-center leading-tight">
                      {lang === "zh" ? s.labelZh : s.labelEn}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </section>

          {/* ── ABOUT ── */}
          <section id="section-about" className="relative py-16 px-8 lg:px-16">
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            <div className="max-w-5xl">
              <SectionHeader title={t("about.title")} />
              <div className="grid lg:grid-cols-2 gap-10 mt-8">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <p className="text-blue-200/90 leading-relaxed mb-4 text-sm">{t("about.desc1")}</p>
                  <p className="text-blue-200/90 leading-relaxed text-sm">{t("about.desc2")}</p>
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    {[
                      { icon: <Shield size={18} />, label: t("about.feature1") },
                      { icon: <Clock size={18} />, label: t("about.feature2") },
                      { icon: <Star size={18} />, label: t("about.feature3") },
                      { icon: <Users size={18} />, label: t("about.feature4") },
                    ].map((f) => (
                      <div key={f.label} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-blue-500/20 hover:border-blue-400/40 transition-colors">
                        <span className="text-[#1E90FF]">{f.icon}</span>
                        <span className="text-sm text-blue-100 font-medium">{f.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* One-stop process flow */}
                  <div className="mt-6 p-4 rounded-xl bg-white/5 border border-blue-500/20">
                    <div className="text-xs text-blue-500 mb-3 tracking-wider uppercase">
                      {lang === "zh" ? "一站式服务流程" : "One-Stop Process"}
                    </div>
                    <div className="flex items-center gap-1 overflow-x-auto pb-1">
                      {(lang === "zh"
                        ? ["需求", "原理图", "Layout", "仿真", "制板", "SMT", "交付"]
                        : ["Req.", "Sch.", "Layout", "Sim.", "Fab.", "SMT", "Deliver"]
                      ).map((step, i, arr) => (
                        <div key={step} className="flex items-center gap-1 shrink-0">
                          <FlowStep num={String(i + 1)} label={step} active />
                          {i < arr.length - 1 && <div className="w-4 h-px bg-[#1E90FF]/40 shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative rounded-2xl overflow-hidden h-72 lg:h-auto min-h-[280px]">
                  <img src={PCB_DESIGN_IMG} alt="PCB Design" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 to-transparent" />
                  <div className="absolute inset-0 border border-blue-500/20 rounded-2xl pointer-events-none" />
                </motion.div>
              </div>
            </div>
          </section>

          {/* ── SCHEMATIC ── */}
          <ServiceSection
            id="schematic"
            title={t("schematic.title")}
            desc={t("schematic.desc")}
            img={PCB_DESIGN_IMG}
            caps={[t("schematic.cap1"), t("schematic.cap2"), t("schematic.cap3"), t("schematic.cap4"), t("schematic.cap5"), t("schematic.cap6")]}
            imgLeft={false}
            specs={lang === "zh" ? [
              { label: "支持EDA工具", value: "Altium / Cadence / KiCad" },
              { label: "原理图规模", value: "最大10,000+网络" },
              { label: "交付周期", value: "3~10工作日" },
              { label: "设计审查", value: "DRC + EMC规则检查" },
            ] : [
              { label: "EDA Tools", value: "Altium / Cadence / KiCad" },
              { label: "Schematic Scale", value: "Up to 10,000+ nets" },
              { label: "Lead Time", value: "3~10 business days" },
              { label: "Design Review", value: "DRC + EMC rule check" },
            ]}
          />

          {/* ── LAYOUT ── */}
          <ServiceSection
            id="layout"
            title={t("layout.title")}
            desc={t("layout.desc")}
            img={PCB_CLOSEUP_IMG}
            caps={[t("layout.cap1"), t("layout.cap2"), t("layout.cap3"), t("layout.cap4"), t("layout.cap5"), t("layout.cap6")]}
            imgLeft={true}
            specs={lang === "zh" ? [
              { label: "最大层数", value: "40层" },
              { label: "最小线宽/间距", value: "2mil / 2mil" },
              { label: "最小孔径", value: "0.1mm" },
              { label: "板厚范围", value: "0.4mm ~ 6.0mm" },
            ] : [
              { label: "Max Layers", value: "40 layers" },
              { label: "Min Trace/Space", value: "2mil / 2mil" },
              { label: "Min Via Drill", value: "0.1mm" },
              { label: "Board Thickness", value: "0.4mm ~ 6.0mm" },
            ]}
          />

          {/* ── BOM ── */}
          <ServiceSection
            id="bom"
            title={t("bom.title")}
            desc={t("bom.desc")}
            img="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
            caps={[t("bom.cap1"), t("bom.cap2"), t("bom.cap3"), t("bom.cap4"), t("bom.cap5"), t("bom.cap6")]}
            imgLeft={false}
            specs={lang === "zh" ? [
              { label: "合作供应商", value: "TI / NXP / ST / Infineon等" },
              { label: "备货品类", value: "50,000+ SKU" },
              { label: "替代料响应", value: "24小时内" },
              { label: "价格优势", value: "较市场价低10~30%" },
            ] : [
              { label: "Key Suppliers", value: "TI / NXP / ST / Infineon" },
              { label: "Stock SKUs", value: "50,000+" },
              { label: "Alt. Response", value: "Within 24 hours" },
              { label: "Price Advantage", value: "10~30% below market" },
            ]}
          />

          {/* ── SIMULATION ── */}
          <ServiceSection
            id="simulation"
            title={t("simulation.title")}
            desc={t("simulation.desc")}
            img="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80"
            caps={[t("simulation.cap1"), t("simulation.cap2"), t("simulation.cap3"), t("simulation.cap4"), t("simulation.cap5"), t("simulation.cap6")]}
            imgLeft={true}
            specs={lang === "zh" ? [
              { label: "仿真工具", value: "Ansys SIwave / HyperLynx / CST" },
              { label: "信号速率", value: "支持56Gbps PAM4" },
              { label: "频率范围", value: "DC ~ 100GHz" },
              { label: "报告交付", value: "含整改建议" },
            ] : [
              { label: "Sim. Tools", value: "Ansys SIwave / HyperLynx / CST" },
              { label: "Signal Rate", value: "Up to 56Gbps PAM4" },
              { label: "Freq. Range", value: "DC ~ 100GHz" },
              { label: "Report", value: "With fix recommendations" },
            ]}
          />

          {/* ── FABRICATION ── */}
          <ServiceSection
            id="fabrication"
            title={t("fabrication.title")}
            desc={t("fabrication.desc")}
            img={PCB_CLOSEUP_IMG}
            caps={[t("fabrication.cap1"), t("fabrication.cap2"), t("fabrication.cap3"), t("fabrication.cap4"), t("fabrication.cap5"), t("fabrication.cap6")]}
            imgLeft={false}
            specs={lang === "zh" ? [
              { label: "板材类型", value: "FR4 / Rogers / 铝基 / 软硬结合" },
              { label: "最小线宽/间距", value: "2mil / 2mil" },
              { label: "表面处理", value: "ENIG / OSP / HASL / 沉银" },
              { label: "阻抗控制", value: "±10%" },
            ] : [
              { label: "Materials", value: "FR4 / Rogers / Al / Flex-Rigid" },
              { label: "Min Trace/Space", value: "2mil / 2mil" },
              { label: "Surface Finish", value: "ENIG / OSP / HASL / ImAg" },
              { label: "Impedance", value: "±10%" },
            ]}
          />

          {/* ── SMT ── */}
          <ServiceSection
            id="smt"
            title={t("smt.title")}
            desc={t("smt.desc")}
            img={SMT_IMG}
            caps={[t("smt.cap1"), t("smt.cap2"), t("smt.cap3"), t("smt.cap4"), t("smt.cap5"), t("smt.cap6")]}
            imgLeft={true}
            specs={lang === "zh" ? [
              { label: "最小封装", value: "0201 (0.6×0.3mm)" },
              { label: "贴片精度", value: "±25μm" },
              { label: "产线数量", value: "6条SMT产线" },
              { label: "日产能", value: "100万点/天" },
            ] : [
              { label: "Min Package", value: "0201 (0.6×0.3mm)" },
              { label: "Placement Acc.", value: "±25μm" },
              { label: "SMT Lines", value: "6 production lines" },
              { label: "Daily Capacity", value: "1M placements/day" },
            ]}
          />

          {/* ── CASES ── */}
          <section id="section-cases" className="relative py-16 px-8 lg:px-16">
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            <div className="max-w-5xl">
              <SectionHeader title={t("cases.title")} subtitle={t("cases.subtitle")} />

              <div className="grid sm:grid-cols-2 gap-5 mt-8">
                <CaseCard title={t("cases.case1.title")} desc={t("cases.case1.desc")}
                  tags={[t("cases.case1.tag1"), t("cases.case1.tag2"), t("cases.case1.tag3")]} img={PCB_DESIGN_IMG} />
                <CaseCard title={t("cases.case2.title")} desc={t("cases.case2.desc")}
                  tags={[t("cases.case2.tag1"), t("cases.case2.tag2"), t("cases.case2.tag3")]} img={PCB_CLOSEUP_IMG} />
                <CaseCard title={t("cases.case3.title")} desc={t("cases.case3.desc")}
                  tags={[t("cases.case3.tag1"), t("cases.case3.tag2"), t("cases.case3.tag3")]} img={SMT_IMG} />
                <CaseCard title={t("cases.case4.title")} desc={t("cases.case4.desc")}
                  tags={[t("cases.case4.tag1"), t("cases.case4.tag2"), t("cases.case4.tag3")]} img={HERO_IMG} />
              </div>

              {/* Industries served */}
              <div className="mt-10">
                <div className="text-xs text-blue-600 uppercase tracking-widest mb-4">
                  {lang === "zh" ? "应用领域" : "Industries Served"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(lang === "zh"
                    ? ["5G通信", "消费电子", "工业控制", "医疗设备", "汽车电子", "航空航天", "新能源", "智能家居"]
                    : ["5G Telecom", "Consumer Electronics", "Industrial Control", "Medical Devices", "Automotive", "Aerospace", "New Energy", "Smart Home"]
                  ).map((ind) => (
                    <span key={ind} className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-blue-500/20 text-blue-300 hover:border-blue-400/50 hover:text-white transition-all">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Partners */}
              <div className="mt-8">
                <div className="text-xs text-blue-600 uppercase tracking-widest mb-4">
                  {lang === "zh" ? "合作伙伴" : "Partners"}
                </div>
                <div className="flex flex-wrap gap-3">
                  {["Huawei", "Lenovo", "Foxconn", "BYD", "DJI", "Hikvision", "OPPO", "Xiaomi"].map((p) => (
                    <div key={p} className="px-4 py-2 rounded-lg bg-white/5 border border-blue-500/20 text-blue-300 text-xs font-mono hover:border-blue-400/50 hover:text-white transition-all">
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── CONTACT ── */}
          <section id="section-contact" className="relative py-16 px-8 lg:px-16">
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            <div className="max-w-5xl">
              <SectionHeader title={t("contact.title")} />
              <div className="grid lg:grid-cols-2 gap-10 mt-8">
                <div className="space-y-4">
                  <ContactItem icon={<Phone size={16} />} label={t("contact.phone")} value="+86 400-888-8888 / +86 755-8888-8888" />
                  <ContactItem icon={<Mail size={16} />} label={t("contact.email")} value="info@pcbforth.com" />
                  <ContactItem icon={<MapPin size={16} />} label={t("contact.address")} value={t("contact.address.val")} />
                  <div className="p-4 rounded-xl bg-[#1E90FF]/10 border border-[#1E90FF]/30">
                    <div className="text-xs text-blue-400 mb-1">{lang === "zh" ? "工作时间" : "Business Hours"}</div>
                    <div className="text-white text-sm font-medium">{lang === "zh" ? "周一至周五 09:00 – 18:00" : "Mon – Fri  09:00 – 18:00"}</div>
                    <div className="text-blue-400 text-xs mt-1">{lang === "zh" ? "紧急项目可7×24小时联系" : "Urgent projects: 7×24 available"}</div>
                  </div>
                </div>
                <ContactForm lang={lang} t={t} />
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="relative py-6 px-8 lg:px-16 border-t border-blue-500/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl">
              <div className="flex items-center gap-3">
                <img src={LOGO_IMG} alt="PCBforth" className="w-6 h-6" />
                <span className="text-blue-500 text-xs">{t("footer.slogan")}</span>
              </div>
              <div className="text-blue-700 text-xs">{t("footer.rights")}</div>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}

// ── NavButton sub-component ──
function NavButton({ item, active, lang, onClick }: {
  item: NavItem; active: boolean; lang: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all duration-200 ${
        active
          ? "bg-[#1E90FF]/20 text-[#00D4FF] border border-[#1E90FF]/40 shadow-[0_0_10px_rgba(30,144,255,0.1)]"
          : "text-blue-400 hover:bg-white/5 hover:text-blue-200 border border-transparent"
      }`}
    >
      <span className={`shrink-0 ${active ? "text-[#00D4FF]" : "text-blue-600"}`}>{item.icon}</span>
      <span className="truncate">{lang === "zh" ? item.labelZh : item.labelEn}</span>
      {active && <ChevronRight size={11} className="ml-auto text-[#00D4FF] shrink-0" />}
    </button>
  );
}
