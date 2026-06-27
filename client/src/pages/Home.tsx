// PCBforth — Blue-White Design
// White content area + Deep blue sidebar + Blue accent colors
// Fonts: Orbitron (tech titles) + Noto Sans SC (Chinese body)

import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import PcbBackground from "@/components/PcbBackground";
import { useLocation } from "wouter";
import {
  Cpu, Layers, Package, Activity, Factory, Zap,
  Users, Award, Clock, CheckCircle, Phone, Mail, MapPin,
  ChevronRight, ChevronDown, Menu, Globe, ArrowRight, Star, Shield, Wrench, Pencil,
  ClipboardCheck, Upload,
} from "lucide-react";

const HERO_IMG       = "/manus-storage/hero-office_047863ed.webp";
const PCB_BOARD_BG   = "/manus-storage/pcb-board-clean_d0418efd.webp";
// Service section images - each uniquely matched to its service
const SCHEMATIC_IMG  = "/manus-storage/schematic-design_7a529f76.webp";  // Engineer at Altium Designer dual-screen
const PCB_LAYOUT_IMG = "/manus-storage/pcb-layout-new_a89a07bb.jpg";    // PCB layout design image (manus-storage)
const BOM_IMG        = "/manus-storage/bom-components_84ef3017.webp"; // TI/NXP/Infineon components tray
const FAB_IMG        = "/manus-storage/pcb-factory_f5af8ff9.webp";   // Chinese PCB factory ISO9001 clean room
const SMT_IMG        = "/manus-storage/smt-assembly_6cba567b.webp";  // ASM SIPLACE SMT line
// Keep for backward compat / cases section
const PCB_DESIGN_IMG = SCHEMATIC_IMG;
const PCB_CLOSEUP_IMG= PCB_LAYOUT_IMG;

// Inline SVG logo — zero network request
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
  { id: "home",        icon: <Zap size={15} />,      labelZh: "首页",             labelEn: "Home" },
  { id: "about",       icon: <Users size={15} />,    labelZh: "关于我们",       labelEn: "About Us" },
  { id: "schematic",   icon: <Activity size={15} />, labelZh: "原理图设计",     labelEn: "Schematic Design",    group: "services" },
  { id: "layout",      icon: <Layers size={15} />,   labelZh: "PCB Layout",     labelEn: "PCB Layout",          group: "services" },
  { id: "bom",         icon: <Package size={15} />,  labelZh: "元器件工程",     labelEn: "Component Engineering", group: "services" },
  { id: "simulation",  icon: <Cpu size={15} />,      labelZh: "仿真验证",       labelEn: "Simulation & Verification", group: "services" },
  { id: "fabrication", icon: <Wrench size={15} />,   labelZh: "PCB制造",       labelEn: "PCB Fabrication",     group: "services" },
  { id: "smt",         icon: <Factory size={15} />,  labelZh: "SMT组装",       labelEn: "SMT Assembly",        group: "services" },
  { id: "cases",       icon: <Award size={15} />,    labelZh: "合作案例",       labelEn: "Cases" },
  { id: "contact",     icon: <Phone size={15} />,    labelZh: "联系我们",       labelEn: "Contact" },
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
function StatCard({ num, label, suffix = "+", dark = false }: { num: number; label: string; suffix?: string; dark?: boolean }) {
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
      <div className="text-3xl font-bold font-mono tracking-tight" style={{ color: dark ? "#60A5FA" : C.blue }}>{count}{suffix}</div>
      <div className="text-xs mt-1 tracking-wide" style={{ color: dark ? "rgba(255,255,255,0.55)" : C.muted }}>{label}</div>
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

// ── Community Preview (for Home page) ──
function CommunityPreview({ lang }: { lang: string }) {
  const { data, isLoading } = trpc.community.list.useQuery({ limit: 3, offset: 0 });
  const projects = data?.projects ?? [];

  return (
    <div>
      {isLoading ? (
        <div className="grid sm:grid-cols-3 gap-6 mt-8">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              <div className="h-44" style={{ background: C.blueLight }} />
              <div className="p-4 space-y-2">
                <div className="h-4 rounded" style={{ background: C.blueLight }} />
                <div className="h-3 w-2/3 rounded" style={{ background: C.blueLight }} />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-8 rounded-2xl py-14 text-center" style={{ background: C.blueLight, border: `2px dashed ${C.cardBorder}` }}>
          <div className="text-4xl mb-3">📷</div>
          <div className="font-bold text-sm mb-1" style={{ color: C.heading }}>
            {lang === "zh" ? "社区尚无作品" : "No designs yet"}
          </div>
          <div className="text-xs mb-4" style={{ color: C.muted }}>
            {lang === "zh" ? "登录后分享您的第一个PCB设计作品" : "Sign in and share your first PCB design"}
          </div>
          <a href="/community" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-white text-sm"
            style={{ background: C.blue }}>
            {lang === "zh" ? "进入社区" : "Go to Community"}
          </a>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-6 mt-8">
            {projects.map((proj) => {
              const tags: string[] = proj.tags ? JSON.parse(proj.tags) : [];
              return (
                <motion.a key={proj.id} href="/community"
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 block"
                  style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
                  <div className="relative overflow-hidden" style={{ height: 176, background: "#0a1628" }}>
                    <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                    {proj.category && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold"
                        style={{ background: "rgba(21,101,232,0.85)", color: "#fff" }}>
                        {proj.category}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1 line-clamp-1" style={{ color: C.heading }}>{proj.title}</h3>
                    <div className="text-xs mb-2" style={{ color: C.muted }}>{proj.userName ?? "Anonymous"}</div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {tags.slice(0, 3).map((tag, j) => (
                          <span key={j} className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: C.blueLight, color: C.blue, border: `1px solid ${C.cardBorder}` }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 pt-2" style={{ borderTop: `1px solid ${C.divider}` }}>
                      <span className="flex items-center gap-1 text-xs" style={{ color: C.muted }}>
                        <Heart size={12} /> {proj.likesCount}
                      </span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: C.muted }}>
                        <MessageCircle size={12} /> {proj.commentsCount}
                      </span>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <a href="/community"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200"
              style={{ background: C.blueLight, color: C.blue, border: `1px solid ${C.cardBorder}` }}>
              {lang === "zh" ? "查看全部作品" : "View All Designs"} <ChevronRight size={15} />
            </a>
          </div>
        </>
      )}
    </div>
  );
}

// ── PCB product types for fabrication gallery ──
const FAB_PRODUCTS = [
  {
    titleZh: "光模块产品",
    titleEn: "Optical Module PCB",
    descZh: "专为400G/800G光模块设计的高密度互联PCB，采用低损耗高频材料，支持超高速差分信号传输，广泛应用于数据中心、5G前传和骨干网光通信系统。",
    descEn: "High-density interconnect PCB for 400G/800G optical modules. Low-loss high-frequency materials, ultra-high-speed differential signal transmission for data centers and 5G fronthaul.",
    img: "/manus-storage/pcb-optical-module_53700548.webp",
    featuresZh: ["超低插入损耗设计", "差分对等长布线", "精密阻抗控制±5%", "支持400G/800G速率", "低Dk/Df高频材料"],
    featuresEn: ["Ultra-low insertion loss", "Matched differential routing", "Impedance control ±5%", "400G/800G data rate", "Low Dk/Df materials"],
    specsZh: [{k:"层数",v:"8~16层"},{k:"最小线宽/间距",v:"2mil/2mil"},{k:"基材",v:"Rogers / Megtron"},{k:"表面处理",v:"ENIG / ENEPIG"},{k:"阻抗精度",v:"±5%"},{k:"板厚",v:"0.8~2.4mm"}],
    specsEn: [{k:"Layers",v:"8~16L"},{k:"Min Trace/Space",v:"2mil/2mil"},{k:"Material",v:"Rogers / Megtron"},{k:"Surface",v:"ENIG / ENEPIG"},{k:"Impedance",v:"±5%"},{k:"Thickness",v:"0.8~2.4mm"}],
  },
  {
    titleZh: "5G TRX 板",
    titleEn: "5G TRX Board",
    descZh: "面向5G基站收发信机（TRX）的高频高速PCB，支持Sub-6GHz和毫米波频段，具备优异的信号完整性和热管理能力，满足5G大规模MIMO天线阵列需求。",
    descEn: "High-frequency PCB for 5G base station TRX. Supports Sub-6GHz and mmWave with excellent signal integrity and thermal management for massive MIMO arrays.",
    img: "/manus-storage/pcb-5g-trx_95516967.webp",
    featuresZh: ["Sub-6GHz及毫米波支持", "大规模MIMO兼容", "低热阻散热设计", "高密度盲埋孔HDI", "严格EMC管控"],
    featuresEn: ["Sub-6GHz & mmWave", "Massive MIMO compatible", "Low thermal resistance", "HDI blind/buried via", "Strict EMC control"],
    specsZh: [{k:"层数",v:"12~20层"},{k:"最小线宽/间距",v:"2.5mil/2.5mil"},{k:"基材",v:"Rogers 4350B / FR4"},{k:"表面处理",v:"ENIG"},{k:"阻抗精度",v:"±8%"},{k:"最小钻孔",v:"0.1mm激光孔"}],
    specsEn: [{k:"Layers",v:"12~20L"},{k:"Min Trace/Space",v:"2.5mil/2.5mil"},{k:"Material",v:"Rogers 4350B / FR4"},{k:"Surface",v:"ENIG"},{k:"Impedance",v:"±8%"},{k:"Min Drill",v:"0.1mm laser"}],
  },
  {
    titleZh: "微波阶梯槽板",
    titleEn: "Microwave Stepped-Slot PCB",
    descZh: "采用PTFE/Rogers等低损耗微波基材，通过精密铣槽工艺实现阶梯结构，广泛用于相控阵雷达、卫星通信和毫米波测试系统，具备极低插入损耗和优异的高频一致性。",
    descEn: "PTFE/Rogers low-loss substrates with precision milled stepped structures. Used in phased-array radar, satellite comms, and mmWave test systems.",
    img: "/manus-storage/pcb-microwave-stepped_dfbb47f2.webp",
    featuresZh: ["精密CNC铣槽工艺", "PTFE/Rogers基材", "极低插入损耗", "优异高频一致性", "支持DC~100GHz"],
    featuresEn: ["Precision CNC milling", "PTFE/Rogers substrate", "Ultra-low insertion loss", "Excellent HF consistency", "DC~100GHz support"],
    specsZh: [{k:"层数",v:"2~8层"},{k:"基材",v:"PTFE / Rogers 5880"},{k:"最小线宽/间距",v:"3mil/3mil"},{k:"阶梯槽精度",v:"±0.05mm"},{k:"表面处理",v:"ENIG / 镀金"},{k:"板厚",v:"0.5~3.2mm"}],
    specsEn: [{k:"Layers",v:"2~8L"},{k:"Material",v:"PTFE / Rogers 5880"},{k:"Min Trace/Space",v:"3mil/3mil"},{k:"Slot Tolerance",v:"±0.05mm"},{k:"Surface",v:"ENIG / Hard Gold"},{k:"Thickness",v:"0.5~3.2mm"}],
  },
  {
    titleZh: "医疗设备板",
    titleEn: "Medical Device PCB",
    descZh: "满足IEC 60601医疗电气安全标准，具备高可靠性、高精度、超低功耗特性，支持FDA 510(k)、CE医疗认证要求，广泛应用于监护仪、手术机器人、体外诊断等高端医疗设备。",
    descEn: "Meets IEC 60601 standards with high reliability and ultra-low power. Supports FDA 510(k) and CE certification for patient monitors, surgical robots, and IVD equipment.",
    img: "/manus-storage/pcb-medical-device_b9bb6a04.webp",
    featuresZh: ["IEC 60601医疗认证", "超低功耗设计", "高可靠性材料", "FDA 510(k)支持", "严格清洁度管控"],
    featuresEn: ["IEC 60601 certified", "Ultra-low power design", "High-reliability materials", "FDA 510(k) support", "Strict cleanliness control"],
    specsZh: [{k:"层数",v:"4~16层"},{k:"最小线宽/间距",v:"3mil/3mil"},{k:"基材",v:"高Tg FR4 / Rogers"},{k:"表面处理",v:"ENIG / OSP"},{k:"阻抗精度",v:"±8%"},{k:"板厚",v:"0.8~3.2mm"}],
    specsEn: [{k:"Layers",v:"4~16L"},{k:"Min Trace/Space",v:"3mil/3mil"},{k:"Material",v:"High-Tg FR4 / Rogers"},{k:"Surface",v:"ENIG / OSP"},{k:"Impedance",v:"±8%"},{k:"Thickness",v:"0.8~3.2mm"}],
  },
  {
    titleZh: "数模转换产品",
    titleEn: "DAC/ADC Converter PCB",
    descZh: "高速数模转换（DAC/ADC）PCB对信号完整性要求极高，PCBforth采用精密阻抗控制、低噪声电源分割和差分对等长布线，确保ADC/DAC在GHz采样率下的高精度转换性能。",
    descEn: "High-speed DAC/ADC PCBs with precision impedance control, low-noise power partitioning, and matched differential routing for GHz sampling rates.",
    img: "/manus-storage/pcb-dac-converter_f1d17eda.webp",
    featuresZh: ["精密阻抗控制±5%", "低噪声电源分割", "差分对等长布线", "模拟/数字地分离", "支持GHz采样率"],
    featuresEn: ["Impedance control ±5%", "Low-noise power split", "Matched diff. routing", "Analog/digital GND split", "GHz sampling rate"],
    specsZh: [{k:"层数",v:"6~12层"},{k:"最小线宽/间距",v:"2.5mil/2.5mil"},{k:"基材",v:"高Tg FR4 / Megtron"},{k:"表面处理",v:"ENIG"},{k:"阻抗精度",v:"±5%"},{k:"板厚",v:"1.0~2.4mm"}],
    specsEn: [{k:"Layers",v:"6~12L"},{k:"Min Trace/Space",v:"2.5mil/2.5mil"},{k:"Material",v:"High-Tg FR4 / Megtron"},{k:"Surface",v:"ENIG"},{k:"Impedance",v:"±5%"},{k:"Thickness",v:"1.0~2.4mm"}],
  },
  {
    titleZh: "服务器主板",
    titleEn: "Server Motherboard PCB",
    descZh: "服务器主板对高密度布线、电源完整性和散热管理要求极高，PCBforth支持16层以上HDI设计，具备DDR5/PCIe 5.0高速信号布线能力，满足云计算、AI推理服务器的严苛需求。",
    descEn: "High-density server motherboard PCB supporting 16+ layer HDI with DDR5/PCIe 5.0 routing for cloud computing and AI inference servers.",
    img: "/manus-storage/pcb-server-board_4290055b.webp",
    featuresZh: ["16层以上HDI设计", "DDR5/PCIe 5.0布线", "优异电源完整性", "高效散热管理", "背钻工艺支持"],
    featuresEn: ["16+ layer HDI", "DDR5/PCIe 5.0 routing", "Excellent power integrity", "Efficient thermal mgmt", "Back-drill support"],
    specsZh: [{k:"层数",v:"16~40层"},{k:"最小线宽/间距",v:"2mil/2mil"},{k:"基材",v:"Megtron 6 / 高Tg FR4"},{k:"表面处理",v:"ENIG / OSP"},{k:"阻抗精度",v:"±8%"},{k:"最小钻孔",v:"0.1mm激光孔"}],
    specsEn: [{k:"Layers",v:"16~40L"},{k:"Min Trace/Space",v:"2mil/2mil"},{k:"Material",v:"Megtron 6 / High-Tg FR4"},{k:"Surface",v:"ENIG / OSP"},{k:"Impedance",v:"±8%"},{k:"Min Drill",v:"0.1mm laser"}],
    category: "pcb",
  },
];

const SEMI_PRODUCTS = [
  {
    titleZh: "Load Board",
    titleEn: "Load Board",
    descZh: "测试负载板是一种连接测试设备与被测器件的机械及电路接口，主要应用在半导体封装测试领域，承载DUT（被测器件）并实现信号传输与电源供给。",
    descEn: "A load board connects test equipment to the device under test (DUT), providing mechanical and electrical interfaces for semiconductor package testing, signal routing, and power delivery.",
    img: "/manus-storage/semi-load-board_482bb926.webp",
    featuresZh: ["高密度BGA封装支持", "精密阻抗控制", "低损耗高频材料", "严格尺寸公差±0.05mm", "支持高温老化测试"],
    featuresEn: ["High-density BGA support", "Precision impedance control", "Low-loss HF materials", "Tight tolerance ±0.05mm", "High-temp burn-in support"],
    specsZh: [{k:"层数",v:"8~20层"},{k:"最小线宽/间距",v:"2mil/2mil"},{k:"基材",v:"Rogers / 高Tg FR4"},{k:"表面处理",v:"ENIG / 硬金"},{k:"阻抗精度",v:"±5%"},{k:"板厚",v:"1.6~4.0mm"}],
    specsEn: [{k:"Layers",v:"8~20L"},{k:"Min Trace/Space",v:"2mil/2mil"},{k:"Material",v:"Rogers / High-Tg FR4"},{k:"Surface",v:"ENIG / Hard Gold"},{k:"Impedance",v:"±5%"},{k:"Thickness",v:"1.6~4.0mm"}],
  },
  {
    titleZh: "Probe Card",
    titleEn: "Probe Card",
    descZh: "探针卡在CP测试中用于连接测试机和Die上的Pad，通常作为Load Board的物理接口，要求极高的平整度、精密孔位和优异的高频传输特性。",
    descEn: "Probe cards connect test machines to die pads in CP testing, serving as the physical interface for load boards. Requires extreme flatness, precision hole placement, and excellent HF transmission.",
    img: "/manus-storage/semi-probe-card_6eab6e57.webp",
    featuresZh: ["超高平整度控制", "精密孔位±0.025mm", "低介电损耗基材", "支持晶圆级测试", "高可靠性镀层"],
    featuresEn: ["Ultra-flat surface control", "Precision hole ±0.025mm", "Low dielectric loss", "Wafer-level test support", "High-reliability plating"],
    specsZh: [{k:"层数",v:"2~42层"},{k:"平整度",v:"≤0.05mm"},{k:"基材",v:"Rogers / PTFE"},{k:"最小孔径",v:"0.1mm"},{k:"表面处理",v:"ENIG / 硬金"},{k:"板厚",v:"1.6~6.5mm"}],
    specsEn: [{k:"Layers",v:"2~42L"},{k:"Flatness",v:"≤0.05mm"},{k:"Material",v:"Rogers / PTFE"},{k:"Min Hole",v:"0.1mm"},{k:"Surface",v:"ENIG / Hard Gold"},{k:"Thickness",v:"1.6~6.5mm"}],
  },
  {
    titleZh: "BIB（老化测试板）",
    titleEn: "BIB (Burn-In Board)",
    descZh: "BIB（Burn In Board，老化测试板），完成封装测试的IC在特定工况和时间内进行老化测试，筛选早期失效器件，提升产品可靠性，广泛用于存储器、CPU等高可靠性器件测试。",
    descEn: "Burn-In Boards subject packaged ICs to elevated temperature and voltage stress to screen early failures, improving product reliability for memory, CPU, and other high-reliability devices.",
    img: "/manus-storage/semi-bib_dd3b2ef8.webp",
    featuresZh: ["耐高温材料（≥200°C）", "高压绝缘设计", "大电流承载能力", "支持并行多芯片测试", "长寿命可靠性设计"],
    featuresEn: ["High-temp material ≥200°C", "High-voltage insulation", "High current capacity", "Parallel multi-chip test", "Long-life reliability design"],
    specsZh: [{k:"层数",v:"4~8层"},{k:"基材",v:"高Tg FR4 / 聚酰亚胺"},{k:"最高工作温度",v:"200°C"},{k:"表面处理",v:"ENIG / OSP"},{k:"最小线宽/间距",v:"3mil/3mil"},{k:"板厚",v:"1.6~3.2mm"}],
    specsEn: [{k:"Layers",v:"4~8L"},{k:"Material",v:"High-Tg FR4 / Polyimide"},{k:"Max Temp",v:"200°C"},{k:"Surface",v:"ENIG / OSP"},{k:"Min Trace/Space",v:"3mil/3mil"},{k:"Thickness",v:"1.6~3.2mm"}],
  },
  {
    titleZh: "Interposer（中介层）",
    titleEn: "Interposer",
    descZh: "Probe Card的信号通过Interposer中介层的转换，让Probe Head（探针头）的探针可以接收到信号，是探针卡系统中的关键信号转接器件，要求极高的信号完整性和精密加工精度。",
    descEn: "Interposers convert signals between probe cards and probe heads, serving as critical signal routing components in probe card systems with extreme signal integrity and precision machining requirements.",
    img: "/manus-storage/semi-interposer_6ca9b98e.webp",
    featuresZh: ["超精密加工±0.01mm", "高信号完整性设计", "低串扰布线结构", "支持高频GHz信号", "微孔HDI工艺"],
    featuresEn: ["Ultra-precision ±0.01mm", "High signal integrity", "Low crosstalk routing", "GHz signal support", "Micro-via HDI process"],
    specsZh: [{k:"层数",v:"4~10层"},{k:"最小线宽/间距",v:"1.5mil/1.5mil"},{k:"基材",v:"Rogers / PTFE"},{k:"最小孔径",v:"0.075mm激光孔"},{k:"表面处理",v:"ENIG"},{k:"板厚",v:"0.4~1.6mm"}],
    specsEn: [{k:"Layers",v:"4~10L"},{k:"Min Trace/Space",v:"1.5mil/1.5mil"},{k:"Material",v:"Rogers / PTFE"},{k:"Min Hole",v:"0.075mm laser"},{k:"Surface",v:"ENIG"},{k:"Thickness",v:"0.4~1.6mm"}],
  },
];

const FPC_PRODUCTS = [
  {
    titleZh: "刚挠结合板",
    titleEn: "Rigid-Flex PCB",
    descZh: "刚挠结合板融合刚性板与挠性板优势，可实现模块化设计和三维安装，减少整个产品的重量，布线高密度化，广泛应用于航空航天、医疗设备、折叠屏手机等高端产品。",
    descEn: "Rigid-flex PCBs combine rigid and flexible board advantages, enabling modular design and 3D assembly, reducing weight and enabling high-density routing for aerospace, medical, and foldable devices.",
    img: "/manus-storage/fpc-rigid-flex_65aa4365.webp",
    featuresZh: ["刚柔一体三维安装", "减重30%~50%", "高密度HDI布线", "支持2~20层设计", "耐弯折100万次"],
    featuresEn: ["3D rigid-flex assembly", "30%~50% weight reduction", "High-density HDI routing", "2~20 layer support", "1M+ flex cycle life"],
    specsZh: [{k:"层数",v:"2~20层"},{k:"最小柔性区宽度",v:"3mm"},{k:"最小线宽/间距",v:"3/3.5mil"},{k:"最小钻孔",v:"0.1mm激光孔"},{k:"表面处理",v:"ENIG / ENEPIG"},{k:"板厚孔径比",v:"16:1（通孔）"}],
    specsEn: [{k:"Layers",v:"2~20L"},{k:"Min Flex Width",v:"3mm"},{k:"Min Trace/Space",v:"3/3.5mil"},{k:"Min Drill",v:"0.1mm laser"},{k:"Surface",v:"ENIG / ENEPIG"},{k:"Aspect Ratio",v:"16:1 (PTH)"}],
  },
  {
    titleZh: "挠性板（FPC）",
    titleEn: "Flexible PCB (FPC)",
    descZh: "挠性板轻薄柔软，可自由弯曲卷绕，缩小电子产品体积和重量，布线高密度化，广泛应用于智能穿戴、消费电子、汽车电子、医疗器械等需要空间紧凑设计的产品。",
    descEn: "Flexible PCBs are thin, lightweight, and bendable, enabling compact designs for wearables, consumer electronics, automotive, and medical devices requiring space-efficient flexible interconnects.",
    img: "/manus-storage/fpc-flex_57f88286.webp",
    featuresZh: ["超薄0.05mm基材", "自由弯曲卷绕设计", "高密度细线路", "支持动态弯折应用", "轻量化减重设计"],
    featuresEn: ["Ultra-thin 0.05mm substrate", "Free-bend/roll design", "High-density fine traces", "Dynamic flex application", "Lightweight design"],
    specsZh: [{k:"层数",v:"1~8层"},{k:"基材厚度",v:"0.05~0.2mm"},{k:"最小线宽/间距",v:"2mil/2mil"},{k:"最小钻孔",v:"0.1mm激光孔"},{k:"表面处理",v:"ENIG / OSP / 镀金"},{k:"弯折半径",v:"≥0.5mm"}],
    specsEn: [{k:"Layers",v:"1~8L"},{k:"Base Thickness",v:"0.05~0.2mm"},{k:"Min Trace/Space",v:"2mil/2mil"},{k:"Min Drill",v:"0.1mm laser"},{k:"Surface",v:"ENIG / OSP / Gold"},{k:"Bend Radius",v:"≥0.5mm"}],
  },
];



function ProductCard({ p, i, hovered, setHovered, lang }: { p: typeof FAB_PRODUCTS[0], i: number, hovered: number | null, setHovered: (v: number | null) => void, lang: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.45, delay: (i % 4) * 0.08 }}
      className="flex gap-0 rounded-xl overflow-hidden transition-shadow duration-300 group relative"
      style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`,
        boxShadow: hovered === i ? "0 8px 32px rgba(21,101,232,0.18)" : "0 2px 10px rgba(21,101,232,0.06)" }}
      onMouseEnter={() => setHovered(i)}
      onMouseLeave={() => setHovered(null)}>
      <div className="w-36 sm:w-44 shrink-0 relative overflow-hidden" style={{ background: "#0d1b2e", minHeight: "180px" }}>
        <img src={p.img} alt={lang === "zh" ? p.titleZh : p.titleEn}
          loading="lazy" decoding="async"
          className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base mb-2 leading-snug" style={{ color: C.blue, fontFamily: "'Orbitron', monospace" }}>
            {lang === "zh" ? p.titleZh : p.titleEn}
          </h3>
          <p className="text-xs leading-relaxed line-clamp-3" style={{ color: C.muted }}>
            {lang === "zh" ? p.descZh : p.descEn}
          </p>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-xs" style={{ color: C.blue }}>&#9432;</span>
          <span className="text-xs" style={{ color: C.muted }}>
            {lang === "zh" ? "悬停查看工艺规格" : "Hover for specs"}
          </span>
        </div>
      </div>
      {hovered === i && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 rounded-xl flex flex-col p-4 overflow-auto z-20"
          style={{ background: "rgba(10,20,50,0.97)", backdropFilter: "blur(4px)", border: `1.5px solid ${C.blue}` }}>
          <div className="font-bold text-sm mb-2" style={{ color: "#60a5fa", fontFamily: "'Orbitron', monospace" }}>
            {lang === "zh" ? p.titleZh : p.titleEn}
          </div>
          <div className="mb-3">
            <div className="text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#93c5fd" }}>
              {lang === "zh" ? "产品特点" : "Key Features"}
            </div>
            <ul className="space-y-1">
              {(lang === "zh" ? p.featuresZh : p.featuresEn).map((f, fi) => (
                <li key={fi} className="flex items-start gap-1.5 text-xs" style={{ color: "#cbd5e1" }}>
                  <span style={{ color: "#34d399", marginTop: "1px" }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#93c5fd" }}>
              {lang === "zh" ? "技术规格" : "Specifications"}
            </div>
            <table className="w-full text-xs">
              <tbody>
                {(lang === "zh" ? p.specsZh : p.specsEn).map((s, si) => (
                  <tr key={si} style={{ borderBottom: "1px solid rgba(96,165,250,0.15)" }}>
                    <td className="py-1 pr-2 font-medium" style={{ color: "#93c5fd", whiteSpace: "nowrap" }}>{s.k}</td>
                    <td className="py-1" style={{ color: "#e2e8f0" }}>{s.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

const INITIAL_SHOW = 2;

function ProductGroup({ titleZh, titleEn, products, lang }: { titleZh: string, titleEn: string, products: typeof FAB_PRODUCTS, lang: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const hasMore = products.length > INITIAL_SHOW;
  const visible = expanded ? products : products.slice(0, INITIAL_SHOW);
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 rounded-full" style={{ background: C.blue }} />
        <h3 className="text-base font-bold" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
          {lang === "zh" ? titleZh : titleEn}
        </h3>
        {hasMore && (
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(21,101,232,0.12)", color: C.blue }}>
            {products.length} {lang === "zh" ? "项" : "items"}
          </span>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
        {visible.map((p, i) => (
          <ProductCard key={i} p={p} i={i} hovered={hovered} setHovered={setHovered} lang={lang} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
            style={{
              background: expanded ? "transparent" : C.blue,
              color: expanded ? C.blue : "#fff",
              border: `1.5px solid ${C.blue}`,
              boxShadow: expanded ? "none" : "0 4px 16px rgba(21,101,232,0.25)",
            }}>
            {expanded ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 9L7 4L12 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {lang === "zh" ? "收起" : "Show Less"}
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 5L7 10L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {lang === "zh" ? `查看更多 (${products.length - INITIAL_SHOW})` : `Show More (${products.length - INITIAL_SHOW})`}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function FabricationGallery({ lang }: { lang: string }) {
  return (
    <section className="relative py-14 px-8 lg:px-16" style={{ background: C.pageBg }}>
      <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.divider}, transparent)` }} />
      <div className="max-w-5xl">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: C.blue }}>
            {lang === "zh" ? "产品类型" : "Product Types"}
          </div>
          <h2 className="text-xl font-bold" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
            {lang === "zh" ? "PCB制板工艺 · 典型产品案例" : "PCB Fabrication · Product Showcase"}
          </h2>
        </div>
        {/* PCB Category */}
        <ProductGroup
          titleZh="PCB"
          titleEn="PCB"
          products={FAB_PRODUCTS}
          lang={lang}
        />
        {/* Semiconductor Test Board Category */}
        <ProductGroup
          titleZh="半导体测试板"
          titleEn="Semiconductor Test Board"
          products={SEMI_PRODUCTS}
          lang={lang}
        />
        {/* FPC Category */}
        <ProductGroup
          titleZh="FPC"
          titleEn="FPC"
          products={FPC_PRODUCTS}
          lang={lang}
        />

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
              <img src={img} alt={title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
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
              <img src={img} alt={title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ border: `1px solid ${C.cardBorder}` }} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Linkytech-style Cases Section with 3 tabs ──
// Local cases images (all converted to WebP)
const LOCAL_CASES = "/manus-storage";

const CASES_DATA = {
  pcb: [
    { img: "/manus-storage/highspeed-adc-board_274bb725.webp", title: "高速数据采集板", titleEn: "High-Speed Data Acquisition Board", desc: "高速模拟信号采集，速度高达5G。", descEn: "High-speed analog signal acquisition, up to 5G sampling rate." },
    { img: "/manus-storage/purley-server_fca61a7b.webp", title: "Purley服务器板", titleEn: "Purley Server Board", desc: "采用Intel Purley 处理器，涉及Intel高速设计要求。", descEn: "Intel Purley processor, meeting Intel high-speed design requirements." },
    { img: "/manus-storage/fpga-board_6b0dca4c.webp", title: "FPGA开发板", titleEn: "FPGA Development Board", desc: "多层高密度FPGA布线，支持SerDes高速接口设计。", descEn: "Multi-layer high-density FPGA routing with SerDes high-speed interface design." },
    { img: "/manus-storage/industrial-board_345365b4.jpg", title: "工业控制板", titleEn: "Industrial Control Board", desc: "高可靠性工业控制PCB，通过CE/UL认证，广泛应用于自动化产线。", descEn: "High-reliability industrial control PCB, CE/UL certified, widely used in automation lines." },
    { img: "/manus-storage/medical-board_6514e803.webp", title: "医疗设备主板", titleEn: "Medical Device Mainboard", desc: "便携式患者监护仪主板，满足IEC 60601医疗电气安全标准，通过FDA 510(k)认证。", descEn: "Portable patient monitor mainboard meeting IEC 60601 and FDA 510(k) certification." },
    { img: "/manus-storage/desktop-pc-1_4b8e0740.jpg", hoverImg: "/manus-storage/desktop-pc-2_12658cac.webp", title: "超薄笔记本主板", titleEn: "Ultra-Thin Laptop Mainboard", desc: "极致小型化布局，板厚0.8mm，支持USB4、Thunderbolt 4高速接口。", descEn: "Extreme miniaturization, 0.8mm board thickness, USB4 and Thunderbolt 4 support." },
  ],
  si: [
    { img: `${LOCAL_CASES}_9ad12033.webp`, title: "DDR3/4 时序与信号完整性仿真", titleEn: "DDR3/4 Timing & SI Simulation", desc: "评估DDR信号质量，优化信号拓扑结构，确保接收端信号质量与时序符合SPEC。", descEn: "Evaluate DDR signal quality, optimize topology, ensure receiver signal quality meets SPEC." },
    { img: `${LOCAL_CASES}_e8060851.webp`, title: "DDR 源端驱动和ODT选择仿真", titleEn: "DDR Driver & ODT Simulation", desc: "扫描仿真源端驱动和接收端ODT种类，验证信号抖动、过冲、回冲大小是否符合JEDEC规范。", descEn: "Scan driver and ODT types, verify signal ringing, overshoot, undershoot against JEDEC spec." },
    { img: `${LOCAL_CASES}_548f8676.webp`, title: "DDR 时序分析", titleEn: "DDR Timing Analysis", desc: "验证各组时序关系，量测信号时延，建立/保持时间大小。", descEn: "Verify timing relationships, measure signal delays, establish/hold time margins." },
    { img: `${LOCAL_CASES}_39a474e8.webp`, title: "SerDes 高速信号仿真", titleEn: "SerDes High-Speed Signal Simulation", desc: "针对PCIe/USB3/SATA等SerDes接口进行信号完整性仿真，确保符合协议规范。", descEn: "SI simulation for PCIe/USB3/SATA SerDes interfaces to ensure protocol compliance." },
    { img: `${LOCAL_CASES}_e83bd921.webp`, title: "PDN 电源分配网络仿真", titleEn: "PDN Power Distribution Simulation", desc: "分析电源分配网络阻抗，优化去耦电容布局，确保电源完整性。", descEn: "Analyze PDN impedance, optimize decoupling capacitor placement, ensure power integrity." },
    { img: `${LOCAL_CASES}_6790af4a.webp`, title: "EMC 辐射仿真分析", titleEn: "EMC Radiation Simulation", desc: "通过仿真预测辐射发射热点，指导布局优化，降低EMC认证风险。", descEn: "Predict radiation hotspots via simulation, guide layout optimization, reduce EMC certification risk." },
    { img: `${LOCAL_CASES}_a7db4327.webp`, title: "热仿真与散热分析", titleEn: "Thermal Simulation & Analysis", desc: "对功耗器件进行热仿真，优化散热布局，确保关键器件在安全温度内工作。", descEn: "Thermal simulation for power components, optimize heat dissipation layout, ensure safe operating temperature." },
  ],
  pcba: [
    { img: `${LOCAL_CASES}_e93b44f8.webp`, title: "显卡PCBA", titleEn: "Graphics Card PCBA", desc: "高密度显卡贴装，支持小封装0201器件，精密回流焊接工艺。", descEn: "High-density graphics card assembly, supporting 0201 components, precision reflow soldering." },
    { img: `${LOCAL_CASES}_f329c076.webp`, title: "路由器最小封装0201", titleEn: "Router Min Package 0201", desc: "路由器主板贴装，最小封装0201，高密度BGA返修能力。", descEn: "Router mainboard assembly with minimum 0201 package and high-density BGA rework capability." },
    { img: `${LOCAL_CASES}_5f89ff5d.webp`, title: "数据处理板多个BGA", titleEn: "Data Processing Board Multi-BGA", desc: "多个BGA器件贴装，优化各组内等长匹配条件，确保时序要求。", descEn: "Multi-BGA assembly with optimized matched length routing to ensure timing requirements." },
    { img: `${LOCAL_CASES}_7da74963.webp`, title: "ATCA多个BGA大板", titleEn: "ATCA Multi-BGA Large Board", desc: "ATCA大板贴装，支持大尺寸多个BGA器件，精密烊接和全面X-Ray检测。", descEn: "ATCA large board assembly supporting multiple BGA components with precision soldering and full X-Ray inspection." },
  ],
};

// ── Lightbox component ──
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="relative max-w-5xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl" />
        <button onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-200 hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)' }}>&#x2715;</button>
        <p className="text-center text-white/60 text-xs mt-3">{alt}</p>
      </div>
    </div>
  );
}

// ── Case Card with hover-image + lightbox ──
function CaseCard({ c, lang, C, tabKey, idx }: {
  c: { img: string; hoverImg?: string; title: string; titleEn: string; desc: string; descEn: string };
  lang: string; C: Record<string, string>; tabKey: string; idx: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const displayImg = (c.hoverImg && hovered) ? c.hoverImg : c.img;
  const altText = lang === 'zh' ? c.title : c.titleEn;
  return (
    <>
      {lightboxSrc && <Lightbox src={lightboxSrc} alt={altText} onClose={() => setLightboxSrc(null)} />}
      <motion.div key={`${tabKey}-${idx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: idx * 0.05 }}
        className="rounded-xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, boxShadow: '0 2px 12px rgba(21,101,232,0.07)' }}
        onMouseEnter={(e) => { setHovered(true); (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(21,101,232,0.15)'; }}
        onMouseLeave={(e) => { setHovered(false); (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(21,101,232,0.07)'; }}
        onClick={() => setLightboxSrc(displayImg)}>
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <img src={displayImg} alt={altText} loading="lazy" decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
          {/* Magnify hint overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'rgba(21,101,232,0.18)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.85)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1565E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
          </div>
          {/* Dual-image indicator */}
          {c.hoverImg && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs font-medium"
              style={{ background: 'rgba(21,101,232,0.75)', color: '#fff', backdropFilter: 'blur(4px)' }}>
              {lang === 'zh' ? '悬停切图' : 'Hover to switch'}
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-sm" style={{ background: C.blue }} />
            <h3 className="font-semibold text-sm" style={{ color: C.heading }}>{altText}</h3>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{lang === 'zh' ? c.desc : c.descEn}</p>
        </div>
      </motion.div>
    </>
  );
}

function CasesSection({ lang, C }: { lang: string; C: typeof import('./Home').default extends never ? never : Record<string, string> }) {
  const [activeTab, setActiveTab] = useState<'pcb'|'si'|'pcba'>('pcb');
  const tabs = [
    { key: 'pcb' as const,  labelZh: 'PCB设计案例',  labelEn: 'PCB Design Cases' },
    { key: 'si'  as const,  labelZh: 'SI仿真案例',  labelEn: 'SI Simulation Cases' },
    { key: 'pcba' as const, labelZh: 'PCBA案例',      labelEn: 'PCBA Cases' },
  ];
  const cases = CASES_DATA[activeTab];
  return (
    <section id="section-cases" className="relative py-16 px-8 lg:px-16" style={{ background: C.pageBg }}>
      <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.divider}, transparent)` }} />
      <div className="max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-7 rounded-full" style={{ background: `linear-gradient(to bottom, #0EA5E9, #1565E8)` }} />
          <h2 className="text-2xl lg:text-3xl font-bold tracking-wide" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
            {lang === 'zh' ? '经典案例' : 'Case Studies'}
          </h2>
        </div>
        <p className="text-sm mb-8 pl-4" style={{ color: C.muted }}>
          {lang === 'zh' ? '我们服务过众多知名企业，涵盖通信、消费电子、工业控制、医疗设备等领域' : 'We have served many well-known enterprises across telecom, consumer electronics, industrial control, and medical device sectors.'}
        </p>
        {/* Tabs */}
        <div className="flex gap-6 border-b mb-8" style={{ borderColor: C.divider }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="pb-3 text-sm font-semibold transition-all duration-200 relative"
              style={{ color: activeTab === tab.key ? C.blue : C.muted, borderBottom: activeTab === tab.key ? `2px solid ${C.blue}` : '2px solid transparent', marginBottom: '-1px' }}>
              {lang === 'zh' ? tab.labelZh : tab.labelEn}
            </button>
          ))}
        </div>
        {/* Case Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {cases.map((c, i) => (
            <CaseCard key={`${activeTab}-${i}`} c={c} lang={lang} C={C} tabKey={activeTab} idx={i} />
          ))}
        </div>
      </div>
    </section>
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

// ── Simulation Detail Section ──
const SIM_TABS = [
  {
    id: "highspeed",
    labelZh: "高速串行",
    labelEn: "High-Speed Serial",
    targetZh: "PCIE5、SATA、SAS、SFP28、10GBase-KR、100GBase-KR4、56G/112G/224G PAM4等高速串行信号",
    targetEn: "PCIE5, SATA, SAS, SFP28, 10GBase-KR, 100GBase-KR4, 56G/112G/224G PAM4 high-speed serial signals",
    painZh: "阻抗失配、损耗过大、ISI严重",
    painEn: "Impedance mismatch, excessive loss, severe ISI",
    stepsZh: ["层叠设计","板材选型","S参数无源通道评估","Hspice/AMI有源仿真"],
    stepsEn: ["Stackup Design","Material Selection","S-param Passive Channel","Hspice/AMI Active Sim"],
    stepDescZh: [
      "根据实际情况规划层叠，综合考虑半固化片/芯板型号、厚度、含胶量等，提供阻抗控制和布线层规划建议。",
      "根据系统信号种类及通道情况，合理选择板材（FR4/Rogers/Megtron），保证信号质量，降低生产成本。",
      "通过S参数判断通道是否符合协议标准，对插入损耗、回波损耗等细节进行分析，保证系统性能。",
      "加上特定速率码型进行眼图仿真，通过眼高眼宽标准衡量信号质量，提供整改建议。",
    ],
    stepDescEn: [
      "Plan the stackup based on actual requirements, considering prepreg/core type, thickness, resin content, and flow rate. Provide impedance control and routing layer recommendations.",
      "Select appropriate materials (FR4/Rogers/Megtron) based on signal type and channel conditions to ensure signal quality and reduce production cost.",
      "Evaluate channel compliance via S-parameters — analyze insertion loss, return loss, and other details to ensure system performance.",
      "Run eye diagram simulation with specific rate patterns; evaluate signal quality by eye height/width against protocol masks and provide fix recommendations.",
    ],
    specsZh: [{k:"仿真工具",v:"Ansys SIwave / HyperLynx"},{k:"最高速率",v:"224G PAM4"},{k:"频率范围",v:"DC ~ 100GHz"},{k:"报告交付",v:"含整改建议"}],
    specsEn: [{k:"Tools",v:"Ansys SIwave / HyperLynx"},{k:"Max Rate",v:"224G PAM4"},{k:"Freq. Range",v:"DC ~ 100GHz"},{k:"Report",v:"With fix recommendations"}],
    images: [
      { src: "/manus-storage/sim-highspeed-sparams_b7a1f213.webp", captionZh: "S参数插入损耗/回波损耗分析", captionEn: "S-parameter Insertion/Return Loss Analysis" },
      { src: "/manus-storage/sim-highspeed-eye_10ae1a89.webp", captionZh: "高速串行眼图仿真（PAM4）", captionEn: "High-Speed Eye Diagram Simulation (PAM4)" },
    ],
  },
  {
    id: "ddr",
    labelZh: "DDRx 仿真",
    labelEn: "DDRx Simulation",
    targetZh: "DDR3/DDR4/DDR5/LPDDR4/LPDDR5等内存接口信号",
    targetEn: "DDR3/DDR4/DDR5/LPDDR4/LPDDR5 memory interface signals",
    painZh: "拓扑不合理、时序裕量不足、串扰过大",
    painEn: "Improper topology, insufficient timing margin, excessive crosstalk",
    stepsZh: ["拓扑规划","时序预算","信号完整性仿真","串扰分析"],
    stepsEn: ["Topology Planning","Timing Budget","SI Simulation","Crosstalk Analysis"],
    stepDescZh: [
      "根据DDR规格和板卡设计，规划T型/菊花链/Fly-by等拓扑，确保信号完整性。",
      "基于时钟频率和信号速率，计算建立时间/保持时间裕量，指导布线长度和等长设计。",
      "使用IBIS/SPICE模型进行眼图仿真，验证信号质量满足JEDEC规范要求。",
      "分析数据总线、地址/命令线之间的串扰，提供间距和屏蔽层建议，降低误码率。",
    ],
    stepDescEn: [
      "Plan T-topology/daisy-chain/fly-by topology based on DDR spec and board design to ensure signal integrity.",
      "Calculate setup/hold timing margins based on clock frequency and signal rate; guide routing length and length-matching design.",
      "Use IBIS/SPICE models for eye diagram simulation to verify signal quality meets JEDEC specifications.",
      "Analyze crosstalk between data bus and address/command lines; provide spacing and shielding recommendations to reduce BER.",
    ],
    specsZh: [{k:"支持规格",v:"DDR3~DDR5 / LPDDR5"},{k:"最高速率",v:"DDR5-8400"},{k:"仿真工具",v:"HyperLynx / HSPICE"},{k:"报告",v:"时序裕量报告"}],
    specsEn: [{k:"Supported",v:"DDR3~DDR5 / LPDDR5"},{k:"Max Rate",v:"DDR5-8400"},{k:"Tools",v:"HyperLynx / HSPICE"},{k:"Report",v:"Timing margin report"}],
    images: [
      { src: "/manus-storage/sim-ddr-timing_9c550513.webp", captionZh: "DDR3时序仿真分析（建立/保持时间）", captionEn: "DDR3 Timing Simulation (Setup/Hold Time Analysis)" },
    ],
  },
  {
    id: "pi",
    labelZh: "PI 仿真",
    labelEn: "PI Simulation",
    targetZh: "电源完整性（PI）分析，适用于高速数字系统、服务器、通信设备等",
    targetEn: "Power Integrity (PI) analysis for high-speed digital systems, servers, and telecom equipment",
    painZh: "电源噪声过大、IR-drop超标、平面谐振",
    painEn: "Excessive power noise, IR-drop violation, plane resonance",
    stepsZh: ["IR-drop仿真","PDN阻抗分析","平面谐振分析","电热协同仿真"],
    stepsEn: ["IR-drop Sim","PDN Impedance","Plane Resonance","Electrothermal Co-sim"],
    stepDescZh: [
      "确定电源压降是否符合要求，仿真分析电流密度和载流能力，定位最佳反馈点位置。",
      "分析电源供电网络阻抗，评估电源噪声与纹波，优化去耦电容方案，提供电容设计指导。",
      "基于EMC要求进行平面谐振仿真分析，评估谐振风险，提供PCB设计优化建议。",
      "协同分析静态焦耳热、导体电导率及器件功耗，仿真单板温度分布，指导PCB散热设计。",
    ],
    stepDescEn: [
      "Verify power voltage drop compliance, analyze current density and current-carrying capacity, and locate optimal feedback point.",
      "Analyze PDN impedance, evaluate power noise and ripple, optimize decoupling capacitor placement, and provide capacitor design guidance.",
      "Perform plane resonance simulation based on EMC requirements, assess resonance risk, and provide PCB design optimization recommendations.",
      "Co-analyze static Joule heat, conductor conductivity, and device power dissipation; simulate board temperature distribution to guide thermal design.",
    ],
    specsZh: [{k:"仿真工具",v:"Ansys SIwave / PowerSI"},{k:"分析类型",v:"IR-drop / PDN / 热分析"},{k:"频率范围",v:"DC ~ 10GHz"},{k:"报告",v:"含优化方案"}],
    specsEn: [{k:"Tools",v:"Ansys SIwave / PowerSI"},{k:"Analysis",v:"IR-drop / PDN / Thermal"},{k:"Freq. Range",v:"DC ~ 10GHz"},{k:"Report",v:"With optimization plan"}],
    images: [
      { src: "/manus-storage/sim-pi-irdrop_5aada9a3.webp", captionZh: "DC IR-Drop直流压降热力图仿真", captionEn: "DC IR-Drop Voltage Distribution Heatmap" },
      { src: "/manus-storage/sim-pi-pdn_da8d0d7f.webp", captionZh: "PDN阻抗频率曲线分析", captionEn: "PDN Impedance vs. Frequency Curve" },
    ],
  },
  {
    id: "emc",
    labelZh: "EMC 仿真",
    labelEn: "EMC Simulation",
    targetZh: "电磁兼容（EMC）分析，包括辐射发射、传导干扰、ESD防护等",
    targetEn: "EMC analysis including radiated emission, conducted interference, and ESD protection",
    painZh: "辐射超标、传导干扰、ESD失效",
    painEn: "Radiated emission excess, conducted interference, ESD failure",
    stepsZh: ["辐射发射分析","传导干扰分析","ESD防护设计","整改验证"],
    stepsEn: ["Radiated Emission","Conducted Interference","ESD Protection","Fix Verification"],
    stepDescZh: [
      "仿真PCB的辐射发射特性，识别主要辐射源，提供布线和屏蔽优化建议，确保满足FCC/CE标准。",
      "分析电源线和信号线上的传导干扰，优化滤波器设计和PCB布局，降低传导噪声。",
      "评估ESD保护器件选型和布局，优化ESD放电路径，保护关键器件免受静电损伤。",
      "对整改后的设计进行仿真验证，确认EMC性能满足目标标准，出具整改报告。",
    ],
    stepDescEn: [
      "Simulate PCB radiated emission characteristics, identify major radiation sources, and provide routing and shielding recommendations to meet FCC/CE standards.",
      "Analyze conducted interference on power and signal lines, optimize filter design and PCB layout to reduce conducted noise.",
      "Evaluate ESD protection device selection and placement, optimize ESD discharge paths to protect critical components from electrostatic damage.",
      "Verify the revised design through simulation to confirm EMC performance meets target standards and issue a fix report.",
    ],
    specsZh: [{k:"仿真工具",v:"CST / ANSYS HFSS"},{k:"分析类型",v:"辐射/传导/ESD"},{k:"标准支持",v:"FCC / CE / CISPR"},{k:"报告",v:"含整改建议"}],
    specsEn: [{k:"Tools",v:"CST / ANSYS HFSS"},{k:"Analysis",v:"Radiated/Conducted/ESD"},{k:"Standards",v:"FCC / CE / CISPR"},{k:"Report",v:"With fix recommendations"}],
    images: [
      { src: "/manus-storage/sim-emc-cst_27299993.webp", captionZh: "PCB辐射发射仿真（CST工具）", captionEn: "PCB Radiated Emission Simulation (CST Tool)" },
    ],
  },
  {
    id: "thermal",
    labelZh: "热仿真",
    labelEn: "Thermal Simulation",
    targetZh: "PCB及系统级热分析，适用于高功率密度设计、散热优化",
    targetEn: "PCB and system-level thermal analysis for high power density designs and thermal optimization",
    painZh: "热点温度过高、散热路径不合理、器件寿命缩短",
    painEn: "Hot spot overtemperature, poor thermal path, reduced component lifetime",
    stepsZh: ["热源建模","散热路径分析","温度场仿真","散热优化"],
    stepsEn: ["Heat Source Modeling","Thermal Path Analysis","Temperature Field Sim","Thermal Optimization"],
    stepDescZh: [
      "建立器件功耗模型，包括静态功耗、动态功耗及结温-功耗特性，为热仿真提供准确输入。",
      "分析PCB铜层、过孔、散热焊盘等散热路径，评估热阻分布，识别散热瓶颈。",
      "使用CFD工具进行稳态/瞬态温度场仿真，输出温度云图和热流密度分布。",
      "基于仿真结果优化散热器选型、铜箔面积、过孔密度和热界面材料，确保器件在安全温度范围内工作。",
    ],
    stepDescEn: [
      "Build device power dissipation models including static/dynamic power and junction temperature characteristics for accurate thermal simulation input.",
      "Analyze thermal paths through PCB copper layers, vias, and thermal pads; evaluate thermal resistance distribution and identify thermal bottlenecks.",
      "Use CFD tools for steady-state/transient temperature field simulation; output temperature contour maps and heat flux density distribution.",
      "Optimize heatsink selection, copper area, via density, and thermal interface materials based on simulation results to ensure components operate within safe temperature ranges.",
    ],
    specsZh: [{k:"仿真工具",v:"Ansys Icepak / FloTHERM"},{k:"分析类型",v:"稳态/瞬态热分析"},{k:"最高功率密度",v:"支持>100W/cm²"},{k:"报告",v:"温度云图+优化方案"}],
    specsEn: [{k:"Tools",v:"Ansys Icepak / FloTHERM"},{k:"Analysis",v:"Steady/Transient Thermal"},{k:"Max Power Density",v:">100W/cm² supported"},{k:"Report",v:"Temp. map + optimization"}],
    images: [
      { src: "/manus-storage/sim-thermal-temp_27fe9115.webp", captionZh: "PCB温度场仿真（Icepak热力分布云图）", captionEn: "PCB Temperature Field Simulation (Icepak Thermal Map)" },
    ],
  },
];

function SimulationSection({ lang }: { lang: string }) {
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const tab = SIM_TABS[activeTab];
  return (
    <section id="section-simulation" className="relative py-16 px-8 lg:px-16" style={{ background: C.sectionAlt }}>
      <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.divider}, transparent)` }} />
      <div className="max-w-5xl">
        <SectionHeader
          title={lang === "zh" ? "仿真分析" : "Simulation Analysis"}
          subtitle={lang === "zh"
            ? "PCBforth提供全面的PCB仿真分析服务，覆盖信号完整性、电源完整性、电磁兼容和热分析，帮助您在制板前发现并解决设计问题。"
            : "PCBforth provides comprehensive PCB simulation services covering SI, PI, EMC, and thermal analysis — identify and resolve design issues before fabrication."}
        />

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-1 mt-8 mb-6 p-1 rounded-xl" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
          {SIM_TABS.map((t, i) => (
            <button key={t.id} onClick={() => { setActiveTab(i); setActiveStep(0); }}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                background: activeTab === i ? C.blue : "transparent",
                color: activeTab === i ? "#FFFFFF" : C.muted,
              }}>
              {lang === "zh" ? t.labelZh : t.labelEn}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Overview row */}
          <div className="grid lg:grid-cols-2 gap-5 mb-6">
            <div className="p-5 rounded-xl" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: C.blue }}>
                {lang === "zh" ? "仿真对象" : "Simulation Targets"}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: C.body }}>
                {lang === "zh" ? tab.targetZh : tab.targetEn}
              </p>
            </div>
            <div className="p-5 rounded-xl" style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#EA580C" }}>
                {lang === "zh" ? "仿真难点" : "Key Challenges"}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#9A3412" }}>
                {lang === "zh" ? tab.painZh : tab.painEn}
              </p>
            </div>
          </div>

          {/* Flow steps */}
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: C.blue }}>
              {lang === "zh" ? "仿真流程" : "Simulation Workflow"}
            </div>
            {/* Step tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(lang === "zh" ? tab.stepsZh : tab.stepsEn).map((step, i) => (
                <button key={i} onClick={() => setActiveStep(i)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                  style={{
                    background: activeStep === i ? C.blue : C.blueLight,
                    color: activeStep === i ? "#FFFFFF" : C.body,
                    border: `1px solid ${activeStep === i ? C.blue : C.cardBorder}`,
                  }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: activeStep === i ? "rgba(255,255,255,0.25)" : C.blue, color: activeStep === i ? "#fff" : "#fff" }}>
                    {i + 1}
                  </span>
                  {step}
                </button>
              ))}
            </div>
            {/* Step detail */}
            <motion.div key={`${activeTab}-${activeStep}`}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
              className="p-5 rounded-xl" style={{ background: C.cardBg, border: `1px solid ${C.blue}33` }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                  style={{ background: C.blue }}>
                  {activeStep + 1}
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1.5" style={{ color: C.heading }}>
                    {lang === "zh" ? tab.stepsZh[activeStep] : tab.stepsEn[activeStep]}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: C.body }}>
                    {lang === "zh" ? tab.stepDescZh[activeStep] : tab.stepDescEn[activeStep]}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Simulation screenshots gallery */}
          {tab.images && tab.images.length > 0 && (
            <div className="mt-6 mb-6">
              <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: C.blue }}>
                {lang === "zh" ? "仿真案例图示" : "Simulation Case Examples"}
              </div>
              <div className={`grid gap-4 ${tab.images.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                {tab.images.map((img, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="rounded-xl overflow-hidden"
                    style={{ border: `1px solid ${C.cardBorder}`, boxShadow: "0 2px 12px rgba(21,101,232,0.08)" }}>
                    <div className="relative bg-gray-950 flex items-center justify-center" style={{ minHeight: "200px" }}>
                      <img src={img.src} alt={lang === "zh" ? img.captionZh : img.captionEn}
                        loading="lazy" decoding="async"
                        className="w-full h-auto object-contain max-h-64" />
                    </div>
                    <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: C.blueLight }}>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: C.blue }} />
                      <span className="text-xs font-medium" style={{ color: C.heading }}>
                        {lang === "zh" ? img.captionZh : img.captionEn}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Specs table */}
          <div className="rounded-xl overflow-hidden shadow-sm" style={{ border: `1px solid ${C.cardBorder}` }}>
            <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider" style={{ background: C.blueLight, color: C.blue }}>
              {lang === "zh" ? "技术规格" : "Technical Specifications"}
            </div>
            <table className="w-full text-xs">
              <tbody>
                {(lang === "zh" ? tab.specsZh : tab.specsEn).map((s, i) => (
                  <tr key={s.k} style={{ background: i % 2 === 0 ? C.cardBg : C.blueLight }}>
                    <td className="px-4 py-2.5 font-semibold w-1/3" style={{ color: C.blue }}>{s.k}</td>
                    <td className="px-4 py-2.5 font-mono" style={{ color: C.heading }}>{s.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
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
  const [, navigate] = useLocation();
  const [designServicesOpen, setDesignServicesOpen] = useState(false);

  const designServiceItems = [
    { path: "/design-services/schematic",   iconEl: <Activity size={13} />, zh: "原理图设计",       en: "Schematic Design" },
    { path: "/design-services/pcb-layout",  iconEl: <Layers size={13} />,   zh: "PCB Layout",      en: "PCB Layout" },
    { path: "/design-services/si",          iconEl: <Zap size={13} />,      zh: "信号完整性分析",  en: "Signal Integrity" },
    { path: "/design-services/pi",          iconEl: <Cpu size={13} />,      zh: "电源完整性分析",  en: "Power Integrity" },
    { path: "/design-services/emc",         iconEl: <Shield size={13} />,   zh: "EMC 设计",        en: "EMC Design" },
    { path: "/design-services/dfm",         iconEl: <CheckCircle size={13} />, zh: "DFM 审查",     en: "DFM Review" },
    { path: "/design-services/components",  iconEl: <Package size={13} />,  zh: "元器件选型",      en: "Component Selection" },
  ];

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
          <PcbLogo size={36} />
          <div>
            <div className="font-bold text-base tracking-widest text-white" style={{ fontFamily: "'Orbitron', monospace" }}>PCBforth</div>
            <div className="text-[10px] tracking-wider" style={{ color: "#7EB3F5" }}>HARDWARE ENGINEERING</div>
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
          {/* ── Design Services collapsible menu ── */}
          <div className="mt-4 mb-1">
            <div className="text-[10px] uppercase tracking-widest px-3 mb-2 font-semibold" style={{ color: "#5A8AC8" }}>
              {lang === "zh" ? "设计服务" : "Design Services"}
            </div>
            {/* Parent button */}
            <button
              onClick={() => setDesignServicesOpen(!designServicesOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all duration-200"
              style={{
                background: designServicesOpen ? "rgba(21,101,232,0.25)" : "transparent",
                color: designServicesOpen ? "#FFFFFF" : C.sidebarText,
                border: designServicesOpen ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
              }}>
              <span style={{ color: designServicesOpen ? "#FFFFFF" : "#7EB3F5" }}><Pencil size={15} /></span>
              <span className="flex-1 text-left truncate">{lang === "zh" ? "PCB 设计服务" : "PCB Design Services"}</span>
              <span style={{ color: designServicesOpen ? "#FFFFFF" : "#7EB3F5", transition: "transform 0.2s", transform: designServicesOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                <ChevronDown size={13} />
              </span>
            </button>
            {/* Sub-items */}
            {designServicesOpen && (
              <div className="ml-3 pl-3 border-l" style={{ borderColor: "rgba(96,165,250,0.3)" }}>
                {designServiceItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg mb-0.5 text-xs transition-all duration-200 hover:bg-white/10"
                    style={{ color: C.sidebarText }}>
                    <span style={{ color: "#7EB3F5" }}>{item.iconEl}</span>
                    <span className="truncate">{lang === "zh" ? item.zh : item.en}</span>
                  </button>
                ))}
                <button
                  onClick={() => navigate("/design-services")}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-lg mb-0.5 text-xs transition-all duration-200 hover:bg-white/10"
                  style={{ color: "#60A5FA" }}>
                  <ArrowRight size={11} />
                  <span>{lang === "zh" ? "查看全部设计服务" : "View All Design Services"}</span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-2 mb-1">
            <div className="text-[10px] uppercase tracking-widest px-3 mb-2 font-semibold" style={{ color: "#5A8AC8" }}>
              {lang === "zh" ? "核心业务" : "Manufacturing"}
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

        {/* Community link */}
        <div className="px-3 pb-2">
          <a href="/community"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{ color: C.sidebarText, background: "rgba(255,255,255,0.06)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.sidebarActive)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}>
            <Users size={14} />
            {lang === "zh" ? "设计社区" : "Community"}
          </a>
        </div>

        {/* Bottom contact + Quote CTA */}
        <div className="px-5 py-4 space-y-2.5" style={{ borderTop: `1px solid ${C.sidebarBorder}`, background: C.sidebarBgDark }}>
          {/* Quote CTA button */}
          <a href="/quote"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-bold text-white transition-all duration-200 active:scale-95"
            style={{ background: C.blue }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.blueDark)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.blue)}>
            <ArrowRight size={12} />
            {lang === "zh" ? "立即获取报价" : "Get a Quote"}
          </a>
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
            <PcbLogo size={28} />
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
              <img src={PCB_BOARD_BG} alt="PCB background" fetchPriority="high" decoding="async" className="w-full h-full object-cover" style={{ objectPosition: "center center" }} />
              {/* Deep blue overlay — matches reference: dark navy tint over PCB board */}
              <div className="absolute inset-0" style={{ background: "rgba(8, 18, 50, 0.68)" }} />
              {/* Left gradient for text legibility */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(5,15,45,0.75) 0%, rgba(5,15,45,0.45) 55%, rgba(5,15,45,0.10) 100%)" }} />
            </div>

            <div className="relative z-10 px-8 lg:px-16 py-20 max-w-5xl">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                {/* Badge */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-white/60" />
                  <span className="text-xs tracking-[0.3em] uppercase font-mono text-white/70">PCBforth Technology</span>
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>

                {/* Main headline */}
                <h1 className="font-black text-white leading-[1.1] mb-3"
                  style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.4rem, 3.5vw, 2.6rem)" }}>
                  {lang === "zh" ? (
                    <>
                      <span>专业PCB设计与</span>
                      <br />
                      <span style={{ color: "#60A5FA" }}>硬件工程服务</span>
                    </>
                  ) : (
                    <>
                      <span>Professional PCB Design &</span>
                      <br />
                      <span style={{ color: "#60A5FA" }}>Hardware Engineering Services</span>
                    </>
                  )}
                </h1>

                {/* Sub-headline line 1 */}
                <p className="text-sm text-white/70 mb-1 leading-relaxed tracking-wide">
                  {t("hero.subtitle")}
                </p>
                {/* Sub-headline line 2 */}
                <p className="text-base font-semibold text-white/90 mb-7 leading-relaxed">
                  {t("hero.subtitle2")}
                </p>

                {/* Service tags */}
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  {["hero.tag1", "hero.tag2", "hero.tag3", "hero.tag4", "hero.tag5"].map((key, i) => (
                    <span key={i}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{
                        background: "rgba(21,101,232,0.55)",
                        border: "1px solid rgba(96,165,250,0.4)",
                        color: "#FFFFFF",
                        backdropFilter: "blur(4px)",
                      }}>
                      <CheckCircle size={11} />
                      {t(key)}
                    </span>
                  ))}
                </div>

                {/* Two CTA buttons */}
                <div className="flex flex-wrap gap-3 mb-14">
                  {/* Button 1: Free Prototype (green) */}
                  <a href="/free-sample"
                    className="flex items-center gap-2 px-8 py-3.5 rounded-lg font-bold text-white transition-all duration-200 active:scale-95 text-sm shadow-lg"
                    style={{ background: "#059669", boxShadow: "0 4px 20px rgba(5,150,105,0.45)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#047857")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#059669")}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    {t("hero.cta.free")}
                  </a>
                  {/* Button 2: PCB Quote (blue) */}
                  <a href="/quote"
                    className="flex items-center gap-2 px-8 py-3.5 rounded-lg font-bold text-white transition-all duration-200 active:scale-95 text-sm shadow-xl"
                    style={{ background: C.blue, boxShadow: "0 4px 24px rgba(21,101,232,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = C.blueDark)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = C.blue)}>
                    <ClipboardCheck size={15} /> {t("hero.cta.quote")} <ArrowRight size={15} />
                  </a>
                </div>

                {/* Stats — 4 key metrics */}
                <div className="flex flex-wrap gap-0">
                  {[
                    { numStr: "15+",   label: t("hero.stat1.label"), isNum: false, num: 0 },
                    { numStr: "5000+", label: t("hero.stat2.label"), isNum: false, num: 0 },
                    { numStr: "72H",   label: t("hero.stat3.label"), isNum: false, num: 0 },
                    { numStr: "98.7%", label: t("hero.stat4.label"), isNum: false, num: 0, noBreak: true },
                  ].map((s, i) => (
                    <div key={i} className="flex items-stretch">
                      {i > 0 && <div className="w-px mx-6 bg-white/20 self-stretch" />}
                      <div className="text-center">
                        {s.isNum
                          ? <StatCard num={s.num} label={s.label} suffix="+" dark />
                          : (
                            <div className="text-center px-3">
                              <div className="text-3xl font-bold whitespace-nowrap" style={{ color: "#60A5FA", fontFamily: "'Orbitron', monospace", letterSpacing: "0" }}>{s.numStr}</div>
                              <div className="text-xs mt-1 tracking-wide" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  ))}
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
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 max-w-3xl">
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
                      {lang === "zh" ? "全流程服务流程" : "Full-Cycle Engineering Process"}
                    </div>
                    <div className="flex items-center gap-1 overflow-x-auto pb-1">
                      {(lang === "zh"
                        ? ["需求","原理图","Layout","仿真验证","PCB制造","SMT组装","交付"]
                        : ["Req.","Schematic","Layout","Simulation","Fabrication","Assembly","Delivery"]
                      ).map((step, i, arr) => (
                        <div key={step} className="flex items-center gap-1 shrink-0">
                          <FlowStep num={String(i + 1)} label={step} />
                          {i < arr.length - 1 && <div className="w-4 h-px shrink-0" style={{ background: C.divider }} />}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
            </div>
          </section>

          {/* ── WHY PCBFORTH ── */}
          <section className="relative py-16 px-8 lg:px-16" style={{ background: C.sectionAlt }}>
            <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.divider}, transparent)` }} />
            <div className="max-w-5xl">
              <SectionHeader
                title={lang === "zh" ? "为什么选择 PCBforth" : "Why PCBFORTH"}
                subtitle={lang === "zh" ? "我们是工程设计团队，不是工厂——为您提供从概念到量产的全局工程支持" : "We are an engineering design team, not a factory \u2014 providing full-cycle engineering support from concept to production."}
              />
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
                {[
                  {
                    icon: <Users size={22} />,
                    titleZh: "经验丰富的工程团队",
                    titleEn: "Experienced Engineering Team",
                    descZh: "资深硬件工程师主导，深耕多层PCB设计、高速布局、电源电子、工业控制、IoT设备等领域。",
                    descEn: "Led by senior hardware engineers with deep expertise in multi-layer PCB, high-speed layout, power electronics, industrial control, and IoT devices.",
                    color: C.blue,
                  },
                  {
                    icon: <Factory size={22} />,
                    titleZh: "独立于制造商",
                    titleEn: "Manufacturing Independent",
                    descZh: "根据您的项目需求选择最佳制造和SMT合作伙伴，不被单一工厂绑定，确保最优性价比。",
                    descEn: "We select the best fabrication and assembly partners based on your project requirements \u2014 not tied to a single factory.",
                    color: "#0EA5E9",
                  },
                  {
                    icon: <Shield size={22} />,
                    titleZh: "降低成本与风险",
                    titleEn: "Cost Optimization",
                    descZh: "在量产前优化BOM成本和制造风险，通过DFM审查和器件替代方案显著降低物料成本。",
                    descEn: "Reduce BOM cost and manufacturing risks before production through DFM review and component alternative sourcing.",
                    color: "#10B981",
                  },
                  {
                    icon: <Clock size={22} />,
                    titleZh: "快速交付",
                    titleEn: "Fast Turnaround",
                    descZh: "数天内完成样板级PCB设计，不是数周。我们理解时间就是金錢，快速响应每一个项目需求。",
                    descEn: "Prototype-ready PCB design in days, not weeks. We understand time is money and respond quickly to every project need.",
                    color: "#F59E0B",
                  },
                ].map((card, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                    style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${card.color}18` }}>
                      <span style={{ color: card.color }}>{card.icon}</span>
                    </div>
                    <h3 className="font-bold text-base mb-2" style={{ color: C.heading }}>
                      {lang === "zh" ? card.titleZh : card.titleEn}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                      {lang === "zh" ? card.descZh : card.descEn}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Capability tags */}
              <div className="mt-8 p-5 rounded-2xl" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
                <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: C.blue }}>
                  {lang === "zh" ? "核心工程能力" : "Core Engineering Capabilities"}
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    lang === "zh" ? "多层PCB设计" : "Multi-layer PCB Design",
                    lang === "zh" ? "高速布局" : "High-Speed Layout",
                    lang === "zh" ? "电源电子" : "Power Electronics",
                    lang === "zh" ? "工业控制" : "Industrial Control",
                    lang === "zh" ? "IoT设备" : "IoT Devices",
                    lang === "zh" ? "RF/微波" : "RF / Microwave",
                    lang === "zh" ? "信号完整性分析" : "Signal Integrity Analysis",
                    lang === "zh" ? "电源完整性分析" : "Power Integrity Analysis",
                    lang === "zh" ? "EMC设计" : "EMC Design",
                    lang === "zh" ? "DFM审查" : "DFM Review",
                    lang === "zh" ? "器件选型" : "Component Selection",
                    lang === "zh" ? "HDI PCB" : "HDI PCB",
                  ].map((tag, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{ background: C.blueLight, color: C.blue, border: `1px solid ${C.cardBorder}` }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── SERVICE SECTIONS ── */}
          <ServiceSection id="schematic" title={t("schematic.title")} desc={t("schematic.desc")}
            img={SCHEMATIC_IMG} imgLeft={false}
            caps={[t("schematic.cap1"),t("schematic.cap2"),t("schematic.cap3"),t("schematic.cap4"),t("schematic.cap5"),t("schematic.cap6")]}
            specs={lang==="zh"
              ? [{label:"支持EDA工具",value:"Altium / Cadence / KiCad"},{label:"原理图规模",value:"最大10,000+网络"},{label:"交付周期",value:"3~10工作日"},{label:"设计审查",value:"DRC + EMC规则检查"}]
              : [{label:"EDA Tools",value:"Altium / Cadence / KiCad"},{label:"Schematic Scale",value:"Up to 10,000+ nets"},{label:"Lead Time",value:"3~10 business days"},{label:"Design Review",value:"DRC + EMC rule check"}]} />

          <ServiceSection id="layout" title={t("layout.title")} desc={t("layout.desc")}
            img={PCB_LAYOUT_IMG} imgLeft={true}
            caps={[t("layout.cap1"),t("layout.cap2"),t("layout.cap3"),t("layout.cap4"),t("layout.cap5"),t("layout.cap6")]}
            specs={lang==="zh"
              ? [{label:"最大层数",value:"40层"},{label:"最小线宽/间距",value:"2mil / 2mil"},{label:"最小孔径",value:"0.1mm"},{label:"板厚范围",value:"0.4mm ~ 6.0mm"}]
              : [{label:"Max Layers",value:"40 layers"},{label:"Min Trace/Space",value:"2mil / 2mil"},{label:"Min Via Drill",value:"0.1mm"},{label:"Board Thickness",value:"0.4mm ~ 6.0mm"}]} />

          <ServiceSection id="bom" title={t("bom.title")} desc={t("bom.desc")}
            img={BOM_IMG} imgLeft={false}
            caps={[t("bom.cap1"),t("bom.cap2"),t("bom.cap3"),t("bom.cap4"),t("bom.cap5"),t("bom.cap6")]}
            specs={lang==="zh"
              ? [{label:"合作供应商",value:"TI / NXP / ST / Infineon等"},{label:"备货品类",value:"50,000+ SKU"},{label:"替代料响应",value:"24小时内"},{label:"价格优势",value:"较市场价低10~30%"}]
              : [{label:"Key Suppliers",value:"TI / NXP / ST / Infineon"},{label:"Stock SKUs",value:"50,000+"},{label:"Alt. Response",value:"Within 24 hours"},{label:"Price Advantage",value:"10~30% below market"}]} />

          <SimulationSection lang={lang} />

          <ServiceSection id="fabrication" title={t("fabrication.title")} desc={t("fabrication.desc")}
            img={FAB_IMG} imgLeft={false}
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

          {/* ── HOW WE WORK ── */}
          <section className="relative py-16 px-8 lg:px-16" style={{ background: C.pageBg }}>
            <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.divider}, transparent)` }} />
            <div className="max-w-5xl">
              <SectionHeader
                title={lang === "zh" ? "我们的工作流程" : "How We Work"}
                subtitle={lang === "zh" ? "从需求分析到交付，每一步都有专业工程师把关" : "From requirements analysis to final delivery \u2014 every step managed by professional engineers."}
              />
              <div className="mt-10 grid sm:grid-cols-3 lg:grid-cols-9 gap-3">
                {[
                  { num: "01", zh: "需求分析", en: "Requirements Analysis" },
                  { num: "02", zh: "原理图设计", en: "Schematic Design" },
                  { num: "03", zh: "器件选型", en: "Component Selection" },
                  { num: "04", zh: "PCB Layout", en: "PCB Layout" },
                  { num: "05", zh: "仿真与审查", en: "Simulation & Review" },
                  { num: "06", zh: "DFM检查", en: "DFM Check" },
                  { num: "07", zh: "PCB制造支持", en: "Manufacturing Support" },
                  { num: "08", zh: "SMT组装支持", en: "SMT Assembly Support" },
                  { num: "09", zh: "交付包", en: "Delivery Package" },
                ].map((step, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="relative flex flex-col items-center text-center">
                    {/* Connector line */}
                    {i < 8 && (
                      <div className="hidden lg:block absolute top-5 left-[calc(50%+20px)] right-[-50%] h-px" style={{ background: C.divider }} />
                    )}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs font-mono z-10 mb-2"
                      style={{ background: i === 0 ? C.blue : C.blueLight, color: i === 0 ? "#fff" : C.blue, border: `2px solid ${i === 0 ? C.blue : C.cardBorder}` }}>
                      {step.num}
                    </div>
                    <div className="text-xs font-semibold leading-tight" style={{ color: C.heading }}>
                      {lang === "zh" ? step.zh : step.en}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── ENGINEERING CAPABILITIES ── */}
          <section className="relative py-16 px-8 lg:px-16" style={{ background: C.sectionAlt }}>
            <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.divider}, transparent)` }} />
            <div className="max-w-5xl">
              <SectionHeader
                title={lang === "zh" ? "工程能力" : "Engineering Capabilities"}
                subtitle={lang === "zh" ? "我们的工程团队具备广泛的硬件设计能力，涵盖各类项目需求" : "Our engineering team covers a broad range of hardware design capabilities for all project types."}
              />
              <div className="grid sm:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    titleZh: "PCB 设计",
                    titleEn: "PCB Design",
                    items: [
                      lang === "zh" ? "✓ 2–40层+ PCB" : "✓ 2–40+ Layer PCB",
                      lang === "zh" ? "✓ 高速设计" : "✓ High-Speed Design",
                      lang === "zh" ? "✓ RF PCB" : "✓ RF PCB",
                      lang === "zh" ? "✓ HDI PCB" : "✓ HDI PCB",
                      lang === "zh" ? "✓ 阻抗控制" : "✓ Impedance Control",
                    ],
                  },
                  {
                    titleZh: "仿真分析",
                    titleEn: "Simulation",
                    items: [
                      lang === "zh" ? "✓ 信号完整性" : "✓ Signal Integrity",
                      lang === "zh" ? "✓ 电源完整性" : "✓ Power Integrity",
                      lang === "zh" ? "✓ 热分析" : "✓ Thermal Analysis",
                      lang === "zh" ? "✓ EMC 仿真" : "✓ EMC Simulation",
                      lang === "zh" ? "✓ DDR 时序分析" : "✓ DDR Timing Analysis",
                    ],
                  },
                  {
                    titleZh: "硬件开发",
                    titleEn: "Hardware Development",
                    items: [
                      lang === "zh" ? "✓ 原理图设计" : "✓ Schematic Design",
                      lang === "zh" ? "✓ 器件选型" : "✓ Component Selection",
                      lang === "zh" ? "✓ 设计审查" : "✓ Design Review",
                      lang === "zh" ? "✓ DFM 优化" : "✓ DFM Optimization",
                      lang === "zh" ? "✓ BOM 成本优化" : "✓ BOM Cost Optimization",
                    ],
                  },
                ].map((col, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="rounded-2xl p-6" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
                    <h3 className="font-bold text-base mb-4" style={{ color: C.heading, fontFamily: "'Orbitron', monospace", fontSize: "0.85rem" }}>
                      {lang === "zh" ? col.titleZh : col.titleEn}
                    </h3>
                    <ul className="space-y-2">
                      {col.items.map((item, j) => (
                        <li key={j} className="text-sm" style={{ color: C.body }}>{item}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* Tools We Use */}
              <div className="mt-8 p-6 rounded-2xl" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
                <div className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: C.blue }}>
                  {lang === "zh" ? "我们使用的工具" : "Tools We Use"}
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: "Altium Designer", color: "#A8001E" },
                    { name: "KiCad",           color: "#314CB0" },
                    { name: "Cadence OrCAD",   color: "#FF6600" },
                    { name: "PADS",            color: "#005A9C" },
                    { name: "LTspice",         color: "#CC0000" },
                    { name: "HyperLynx",       color: "#0072C6" },
                    { name: "Ansys SIwave",    color: "#FFB800" },
                    { name: "CST Studio",      color: "#003087" },
                  ].map((tool, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg"
                      style={{ background: C.blueLight, border: `1px solid ${C.cardBorder}` }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: tool.color }} />
                      <span className="text-sm font-semibold" style={{ color: C.heading }}>{tool.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── CASES ── */}
          <CasesSection lang={lang} C={C} />

          {/* ── COMMUNITY SHOWCASE ENTRY ── */}
          <section className="relative py-16 px-8 lg:px-16" style={{ background: C.pageBg }}>
            <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.divider}, transparent)` }} />
            <div className="max-w-5xl">
              <SectionHeader
                title={lang === "zh" ? "产品展示区" : "Product Showcase"}
                subtitle={lang === "zh" ? "精选PCB产品与工程案例，展示我们的制造与设计实力" : "Featured PCB products and engineering cases showcasing our manufacturing & design capabilities."}
              />
              <CommunityPreview lang={lang} />
            </div>
          </section>

          {/* ── FREE PCB DESIGN REVIEW (LEAD MAGNET) ── */}
          <section className="relative py-16 px-8 lg:px-16" style={{ background: `linear-gradient(135deg, ${C.sidebarBg} 0%, ${C.sidebarBgDark} 100%)` }}>
            <div className="max-w-5xl">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="flex-1">
                  <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#60A5FA" }}>
                    {lang === "zh" ? "免费服务" : "FREE SERVICE"}
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-black text-white mb-4" style={{ fontFamily: "'Orbitron', monospace", lineHeight: 1.2 }}>
                    {lang === "zh" ? "免费 PCB 设计审查" : "Free PCB Design Review"}
                  </h2>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {lang === "zh"
                      ? "上传您的原理图或PCB布局文件，我们的工程师将在 24 小时内提供专业工程反馈，包括DFM建议、器件选型优化和EMC风险评估。"
                      : "Upload your schematic or PCB layout and receive professional engineering feedback within 24 hours \u2014 including DFM recommendations, component selection optimization, and EMC risk assessment."}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a href="/quote"
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white text-sm transition-all duration-200 active:scale-95"
                      style={{ background: C.blue, boxShadow: "0 4px 20px rgba(21,101,232,0.5)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = C.blueDark)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = C.blue)}>
                      {lang === "zh" ? "获取免费审查" : "Get Free Review"} <ArrowRight size={15} />
                    </a>
                    <a href="mailto:review@pcbforth.com"
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200"
                      style={{ border: "1.5px solid rgba(255,255,255,0.35)", color: "#FFFFFF", background: "rgba(255,255,255,0.08)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}>
                      <Mail size={15} /> review@pcbforth.com
                    </a>
                  </div>
                </div>
                <div className="flex-shrink-0 grid grid-cols-1 gap-3 w-full lg:w-64">
                  {[
                    { icon: <CheckCircle size={16} />, zh: "DFM 可制造性建议", en: "DFM Manufacturability Advice" },
                    { icon: <CheckCircle size={16} />, zh: "器件选型优化", en: "Component Selection Optimization" },
                    { icon: <CheckCircle size={16} />, zh: "EMC 风险评估", en: "EMC Risk Assessment" },
                    { icon: <CheckCircle size={16} />, zh: "24小时内回复", en: "Response within 24 hours" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                      <span style={{ color: "#60A5FA" }}>{item.icon}</span>
                      <span className="text-sm font-medium text-white">{lang === "zh" ? item.zh : item.en}</span>
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
                  <PcbLogo size={32} />
                  <div>
                    <div className="font-bold text-sm tracking-widest text-white" style={{ fontFamily: "'Orbitron', monospace" }}>PCBforth</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "#7EB3F5" }}>{lang === "zh" ? "硬件工程服务商" : "Hardware Engineering"}</div>
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

      {/* ── FIXED CONTACT FLOAT (P9) ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Response badge */}
        <div className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg"
          style={{ background: "#10B981", color: "#fff" }}>
          ✓ {lang === "zh" ? "12小时内回复" : "Response within 12 hours"}
        </div>
        {/* Contact buttons */}
        <div className="flex flex-col gap-2">
          <a href="https://wa.me/8675588888888" target="_blank" rel="noopener noreferrer"
            title="WhatsApp"
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xl transition-transform hover:scale-110 active:scale-95"
            style={{ background: "#25D366", boxShadow: "0 4px 16px rgba(37,211,102,0.4)" }}>
            W
          </a>
          <a href="mailto:info@pcbforth.com"
            title="Email"
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xl transition-transform hover:scale-110 active:scale-95"
            style={{ background: "#1565E8", boxShadow: "0 4px 16px rgba(21,101,232,0.4)" }}>
            <Mail size={18} />
          </a>
          <a href="/quote"
            title={lang === "zh" ? "快速报价" : "Quick Quote"}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xl transition-transform hover:scale-110 active:scale-95"
            style={{ background: "#0D4DC4", boxShadow: "0 4px 16px rgba(13,77,196,0.4)" }}>
            <ClipboardCheck size={18} />
          </a>
        </div>
      </div>

    </div>
  );
}
