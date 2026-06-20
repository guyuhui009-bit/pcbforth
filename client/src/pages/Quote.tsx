/**
 * Quote.tsx — PCBforth 报价请求页面
 * 支持拖拽/点击上传 Gerber、BOM 等文件，填写 PCB 规格，提交报价请求。
 */
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Upload, X, FileText, CheckCircle2, Loader2,
  ChevronLeft, Globe, Phone, Mail,
  Layers, Package, Cpu, Wrench, Factory, Activity,
} from "lucide-react";

// ── Design tokens (same as Home) ──────────────────────────────────────────
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

// ── Inline SVG logo ────────────────────────────────────────────────────────
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

// ── Types ──────────────────────────────────────────────────────────────────
interface UploadedFile {
  id: string;
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  key?: string;
  url?: string;
  error?: string;
}

const PCB_TYPES = [
  { value: "pcb",       labelZh: "PCB",           labelEn: "PCB",             icon: <Layers size={14}/> },
  { value: "fpc",       labelZh: "FPC 挠性板",    labelEn: "FPC",             icon: <Activity size={14}/> },
  { value: "rigid_flex",labelZh: "刚挠结合板",    labelEn: "Rigid-Flex",      icon: <Cpu size={14}/> },
  { value: "semi_test", labelZh: "半导体测试板",  labelEn: "Semi Test Board", icon: <Package size={14}/> },
  { value: "other",     labelZh: "其他",           labelEn: "Other",           icon: <Wrench size={14}/> },
];

const SERVICE_OPTIONS = [
  { value: "schematic",   labelZh: "原理图设计",   labelEn: "Schematic Design" },
  { value: "layout",      labelZh: "PCB Layout",   labelEn: "PCB Layout" },
  { value: "bom",         labelZh: "元器件选型",   labelEn: "BOM & Parts" },
  { value: "simulation",  labelZh: "仿真分析",     labelEn: "Simulation" },
  { value: "fabrication", labelZh: "PCB 制板",     labelEn: "PCB Fabrication" },
  { value: "smt",         labelZh: "SMT 贴片",     labelEn: "SMT Assembly" },
];

const SURFACE_FINISHES = ["ENIG", "HASL", "OSP", "ENEPIG", "Hard Gold", "ImAg", "ImSn"];
const MATERIALS = ["FR4", "Rogers 4350B", "Rogers 5880", "Megtron 6", "PTFE", "High-Tg FR4", "Polyimide"];
const COPPER_WEIGHTS = ["0.5oz", "1oz", "2oz", "3oz", "4oz"];

// ── File size formatter ────────────────────────────────────────────────────
function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// ── Main component ─────────────────────────────────────────────────────────
export default function Quote() {
  const { lang, setLang, t } = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<number | null>(null);

  // Form state
  const [form, setForm] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    company: "",
    pcbType: "pcb" as "pcb" | "fpc" | "rigid_flex" | "semi_test" | "other",
    layers: "",
    quantity: "",
    boardWidth: "",
    boardHeight: "",
    boardThickness: "",
    surfaceFinish: "",
    material: "",
    copperWeight: "",
    notes: "",
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // tRPC mutations
  const uploadFileMutation = trpc.quote.uploadFile.useMutation();
  const submitMutation = trpc.quote.submit.useMutation();

  // ── File handling ────────────────────────────────────────────────────────
  const processFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files);
    const MAX_SIZE = 16 * 1024 * 1024; // 16 MB per file

    const newEntries: UploadedFile[] = arr.map(f => ({
      id: crypto.randomUUID(),
      file: f,
      status: "pending",
    }));

    setUploadedFiles(prev => [...prev, ...newEntries]);

    for (const entry of newEntries) {
      if (entry.file.size > MAX_SIZE) {
        setUploadedFiles(prev =>
          prev.map(f => f.id === entry.id
            ? { ...f, status: "error", error: lang === "zh" ? "文件超过 16MB 限制" : "File exceeds 16MB limit" }
            : f
          )
        );
        continue;
      }

      setUploadedFiles(prev =>
        prev.map(f => f.id === entry.id ? { ...f, status: "uploading" } : f)
      );

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Strip data URL prefix
            resolve(result.split(",")[1] ?? result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(entry.file);
        });

        const result = await uploadFileMutation.mutateAsync({
          fileName: entry.file.name,
          mimeType: entry.file.type || "application/octet-stream",
          base64,
          fileSize: entry.file.size,
        });

        setUploadedFiles(prev =>
          prev.map(f => f.id === entry.id
            ? { ...f, status: "done", key: result.key, url: result.url }
            : f
          )
        );
      } catch (err: any) {
        setUploadedFiles(prev =>
          prev.map(f => f.id === entry.id
            ? { ...f, status: "error", error: err?.message ?? "Upload failed" }
            : f
          )
        );
      }
    }
  }, [lang, uploadFileMutation]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  // ── Form submission ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.contactName || !form.contactEmail) {
      toast.error(lang === "zh" ? "请填写姓名和邮箱" : "Please fill in name and email");
      return;
    }

    const doneFiles = uploadedFiles.filter(f => f.status === "done");
    const pendingUploads = uploadedFiles.filter(f => f.status === "uploading" || f.status === "pending");
    if (pendingUploads.length > 0) {
      toast.error(lang === "zh" ? "请等待文件上传完成" : "Please wait for files to finish uploading");
      return;
    }

    try {
      const result = await submitMutation.mutateAsync({
        contactName: form.contactName,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone || undefined,
        company: form.company || undefined,
        pcbType: form.pcbType,
        layers: form.layers ? parseInt(form.layers) : undefined,
        quantity: form.quantity ? parseInt(form.quantity) : undefined,
        boardWidth: form.boardWidth ? parseFloat(form.boardWidth) : undefined,
        boardHeight: form.boardHeight ? parseFloat(form.boardHeight) : undefined,
        boardThickness: form.boardThickness ? parseFloat(form.boardThickness) : undefined,
        surfaceFinish: form.surfaceFinish || undefined,
        material: form.material || undefined,
        copperWeight: form.copperWeight || undefined,
        services: selectedServices.length > 0 ? selectedServices : undefined,
        notes: form.notes || undefined,
        fileKeys: doneFiles.map(f => ({
          key: f.key!,
          url: f.url!,
          originalName: f.file.name,
          mimeType: f.file.type || undefined,
          fileSize: f.file.size,
        })),
      });

      setSubmitted(true);
      setSubmittedId(result.quoteId);
    } catch (err: any) {
      toast.error(err?.message ?? (lang === "zh" ? "提交失败，请重试" : "Submission failed, please try again"));
    }
  };

  // ── Input helper ─────────────────────────────────────────────────────────
  const inputCls = "w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-all duration-200";
  const inputStyle = { background: C.cardBg, border: `1px solid ${C.cardBorder}`, color: C.heading };
  const focusStyle = { borderColor: C.blue };

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: C.pageBg }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-10 rounded-2xl shadow-xl max-w-md mx-4"
          style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "#D1FAE5" }}>
            <CheckCircle2 size={32} style={{ color: "#059669" }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
            {lang === "zh" ? "提交成功！" : "Submitted!"}
          </h2>
          <p className="text-sm mb-1" style={{ color: C.muted }}>
            {lang === "zh" ? `报价编号：#${submittedId}` : `Quote ID: #${submittedId}`}
          </p>
          <p className="text-sm leading-relaxed mb-6" style={{ color: C.body }}>
            {lang === "zh"
              ? "我们已收到您的报价请求，工程师将在 1 个工作日内通过邮件与您联系。"
              : "We have received your quote request. Our engineers will contact you by email within 1 business day."}
          </p>
          <a href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 active:scale-95"
            style={{ background: C.blue }}>
            <ChevronLeft size={15} />
            {lang === "zh" ? "返回首页" : "Back to Home"}
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.pageBg }}>

      {/* ── Top nav bar ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 shadow-sm"
        style={{ background: C.sidebarBgDark, borderBottom: `1px solid ${C.sidebarBorder}` }}>
        <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <PcbLogo size={30} />
          <span className="font-bold tracking-widest text-sm text-white" style={{ fontFamily: "'Orbitron', monospace" }}>
            PCBforth
          </span>
        </a>
        <div className="flex items-center gap-3">
          <Globe size={13} style={{ color: "#7EB3F5" }} />
          {["EN", "中文"].map((l) => (
            <button key={l} onClick={() => setLang(l === "EN" ? "en" : "zh")}
              className="text-xs px-2.5 py-1 rounded-full transition-all font-medium"
              style={{
                background: (l === "EN" ? lang === "en" : lang === "zh") ? "#FFFFFF" : "transparent",
                color: (l === "EN" ? lang === "en" : lang === "zh") ? C.blue : C.sidebarText,
              }}>
              {l}
            </button>
          ))}
          <a href="/" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ color: C.sidebarText, border: `1px solid ${C.sidebarBorder}` }}>
            <ChevronLeft size={13} />
            {lang === "zh" ? "返回首页" : "Home"}
          </a>
        </div>
      </header>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="px-6 lg:px-16 py-10" style={{ background: C.sidebarBg }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-white/50" />
            <span className="text-xs tracking-[0.3em] uppercase font-mono text-white/60">PCBforth</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-3"
            style={{ fontFamily: "'Orbitron', monospace" }}>
            {lang === "zh" ? "在线报价" : "Request a Quote"}
          </h1>
          <p className="text-sm text-white/70 max-w-xl leading-relaxed">
            {lang === "zh"
              ? "上传您的 Gerber 文件、BOM 表或设计文件，填写 PCB 规格，我们的工程师将在 1 个工作日内提供专业报价。"
              : "Upload your Gerber files, BOM, or design documents, fill in PCB specifications, and our engineers will provide a professional quote within 1 business day."}
          </p>
        </div>
      </div>

      {/* ── Main form ────────────────────────────────────────────────────── */}
      <div className="flex-1 px-6 lg:px-16 py-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── Section 1: File upload ──────────────────────────────────── */}
            <div className="rounded-2xl overflow-hidden shadow-sm"
              style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              <div className="px-6 py-4 flex items-center gap-3"
                style={{ background: C.blueLight, borderBottom: `1px solid ${C.cardBorder}` }}>
                <Upload size={16} style={{ color: C.blue }} />
                <h2 className="font-bold text-sm" style={{ color: C.heading }}>
                  {lang === "zh" ? "上传设计文件" : "Upload Design Files"}
                </h2>
                <span className="text-xs ml-auto" style={{ color: C.muted }}>
                  {lang === "zh" ? "支持 Gerber、BOM、PDF、ZIP 等格式，单文件 ≤ 16MB" : "Gerber, BOM, PDF, ZIP, etc. — max 16MB each"}
                </span>
              </div>
              <div className="p-6">
                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-12 cursor-pointer transition-all duration-200"
                  style={{
                    borderColor: isDragging ? C.blue : C.cardBorder,
                    background: isDragging ? C.blueLight : "transparent",
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept=".zip,.rar,.7z,.gerber,.gbr,.drl,.pdf,.xlsx,.xls,.csv,.bom,.txt,.dxf,.step,.stp"
                    onChange={(e) => e.target.files && processFiles(e.target.files)}
                  />
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{ background: C.blueLight }}>
                    <Upload size={24} style={{ color: C.blue }} />
                  </div>
                  <p className="font-semibold text-sm mb-1" style={{ color: C.heading }}>
                    {lang === "zh" ? "拖拽文件到此处，或点击选择文件" : "Drag & drop files here, or click to browse"}
                  </p>
                  <p className="text-xs" style={{ color: C.muted }}>
                    {lang === "zh" ? "支持多文件同时上传" : "Multiple files supported"}
                  </p>
                </div>

                {/* File list */}
                <AnimatePresence>
                  {uploadedFiles.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-2"
                    >
                      {uploadedFiles.map((f) => (
                        <motion.div
                          key={f.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg"
                          style={{
                            background: f.status === "error" ? "#FEF2F2" : C.blueLight,
                            border: `1px solid ${f.status === "error" ? "#FECACA" : C.cardBorder}`,
                          }}
                        >
                          <FileText size={16} style={{ color: f.status === "error" ? "#DC2626" : C.blue, flexShrink: 0 }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate" style={{ color: C.heading }}>{f.file.name}</p>
                            <p className="text-[10px]" style={{ color: f.status === "error" ? "#DC2626" : C.muted }}>
                              {f.status === "uploading" && (lang === "zh" ? "上传中..." : "Uploading...")}
                              {f.status === "done" && fmtSize(f.file.size)}
                              {f.status === "pending" && fmtSize(f.file.size)}
                              {f.status === "error" && (f.error ?? "Error")}
                            </p>
                          </div>
                          {f.status === "uploading" && <Loader2 size={14} className="animate-spin shrink-0" style={{ color: C.blue }} />}
                          {f.status === "done" && <CheckCircle2 size={14} style={{ color: "#059669", flexShrink: 0 }} />}
                          <button type="button" onClick={() => removeFile(f.id)}
                            className="shrink-0 p-1 rounded hover:bg-black/10 transition-colors">
                            <X size={12} style={{ color: C.muted }} />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Section 2: Contact info ─────────────────────────────────── */}
            <div className="rounded-2xl overflow-hidden shadow-sm"
              style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              <div className="px-6 py-4 flex items-center gap-3"
                style={{ background: C.blueLight, borderBottom: `1px solid ${C.cardBorder}` }}>
                <Phone size={16} style={{ color: C.blue }} />
                <h2 className="font-bold text-sm" style={{ color: C.heading }}>
                  {lang === "zh" ? "联系信息" : "Contact Information"}
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: C.body }}>
                    {lang === "zh" ? "姓名 *" : "Name *"}
                  </label>
                  <input type="text" required value={form.contactName}
                    onChange={e => setForm(p => ({ ...p, contactName: e.target.value }))}
                    placeholder={lang === "zh" ? "您的姓名" : "Your name"}
                    className={inputCls} style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => Object.assign(e.target.style, { borderColor: C.cardBorder })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: C.body }}>
                    {lang === "zh" ? "邮箱 *" : "Email *"}
                  </label>
                  <input type="email" required value={form.contactEmail}
                    onChange={e => setForm(p => ({ ...p, contactEmail: e.target.value }))}
                    placeholder={lang === "zh" ? "用于接收报价" : "For receiving quote"}
                    className={inputCls} style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => Object.assign(e.target.style, { borderColor: C.cardBorder })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: C.body }}>
                    {lang === "zh" ? "电话" : "Phone"}
                  </label>
                  <input type="tel" value={form.contactPhone}
                    onChange={e => setForm(p => ({ ...p, contactPhone: e.target.value }))}
                    placeholder={lang === "zh" ? "+86 或 国际号码" : "+86 or international"}
                    className={inputCls} style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => Object.assign(e.target.style, { borderColor: C.cardBorder })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: C.body }}>
                    {lang === "zh" ? "公司名称" : "Company"}
                  </label>
                  <input type="text" value={form.company}
                    onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                    placeholder={lang === "zh" ? "您所在的公司" : "Your company"}
                    className={inputCls} style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => Object.assign(e.target.style, { borderColor: C.cardBorder })} />
                </div>
              </div>
            </div>

            {/* ── Section 3: PCB specs ────────────────────────────────────── */}
            <div className="rounded-2xl overflow-hidden shadow-sm"
              style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              <div className="px-6 py-4 flex items-center gap-3"
                style={{ background: C.blueLight, borderBottom: `1px solid ${C.cardBorder}` }}>
                <Layers size={16} style={{ color: C.blue }} />
                <h2 className="font-bold text-sm" style={{ color: C.heading }}>
                  {lang === "zh" ? "PCB 规格参数" : "PCB Specifications"}
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {/* PCB Type */}
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: C.body }}>
                    {lang === "zh" ? "板型" : "Board Type"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PCB_TYPES.map(pt => (
                      <button key={pt.value} type="button"
                        onClick={() => setForm(p => ({ ...p, pcbType: pt.value as any }))}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                        style={{
                          background: form.pcbType === pt.value ? C.blue : C.blueLight,
                          color: form.pcbType === pt.value ? "#FFFFFF" : C.body,
                          border: `1px solid ${form.pcbType === pt.value ? C.blue : C.cardBorder}`,
                        }}>
                        {pt.icon}
                        {lang === "zh" ? pt.labelZh : pt.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimensions & quantity */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { key: "layers",    labelZh: "层数",       labelEn: "Layers",      placeholder: "e.g. 4", type: "number" },
                    { key: "quantity",  labelZh: "数量 (pcs)", labelEn: "Qty (pcs)",   placeholder: "e.g. 100", type: "number" },
                    { key: "boardWidth",  labelZh: "板宽 (mm)", labelEn: "Width (mm)",  placeholder: "e.g. 100", type: "number" },
                    { key: "boardHeight", labelZh: "板高 (mm)", labelEn: "Height (mm)", placeholder: "e.g. 80",  type: "number" },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: C.body }}>
                        {lang === "zh" ? field.labelZh : field.labelEn}
                      </label>
                      <input type={field.type} min="0"
                        value={(form as any)[field.key]}
                        onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className={inputCls} style={inputStyle}
                        onFocus={e => Object.assign(e.target.style, focusStyle)}
                        onBlur={e => Object.assign(e.target.style, { borderColor: C.cardBorder })} />
                    </div>
                  ))}
                </div>

                {/* Surface finish, material, copper weight */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { key: "surfaceFinish", labelZh: "表面处理", labelEn: "Surface Finish", options: SURFACE_FINISHES },
                    { key: "material",      labelZh: "板材",     labelEn: "Material",        options: MATERIALS },
                    { key: "copperWeight",  labelZh: "铜厚",     labelEn: "Copper Weight",   options: COPPER_WEIGHTS },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: C.body }}>
                        {lang === "zh" ? field.labelZh : field.labelEn}
                      </label>
                      <select
                        value={(form as any)[field.key]}
                        onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                        className={inputCls} style={{ ...inputStyle, appearance: "auto" }}
                        onFocus={e => Object.assign(e.target.style, focusStyle)}
                        onBlur={e => Object.assign(e.target.style, { borderColor: C.cardBorder })}>
                        <option value="">{lang === "zh" ? "请选择" : "Select..."}</option>
                        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Section 4: Services needed ──────────────────────────────── */}
            <div className="rounded-2xl overflow-hidden shadow-sm"
              style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              <div className="px-6 py-4 flex items-center gap-3"
                style={{ background: C.blueLight, borderBottom: `1px solid ${C.cardBorder}` }}>
                <Factory size={16} style={{ color: C.blue }} />
                <h2 className="font-bold text-sm" style={{ color: C.heading }}>
                  {lang === "zh" ? "所需服务（可多选）" : "Services Required (multi-select)"}
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {SERVICE_OPTIONS.map(s => {
                    const active = selectedServices.includes(s.value);
                    return (
                      <button key={s.value} type="button"
                        onClick={() => setSelectedServices(prev =>
                          active ? prev.filter(x => x !== s.value) : [...prev, s.value]
                        )}
                        className="px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                        style={{
                          background: active ? C.blue : C.blueLight,
                          color: active ? "#FFFFFF" : C.body,
                          border: `1px solid ${active ? C.blue : C.cardBorder}`,
                        }}>
                        {lang === "zh" ? s.labelZh : s.labelEn}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Section 5: Notes ────────────────────────────────────────── */}
            <div className="rounded-2xl overflow-hidden shadow-sm"
              style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              <div className="px-6 py-4 flex items-center gap-3"
                style={{ background: C.blueLight, borderBottom: `1px solid ${C.cardBorder}` }}>
                <Mail size={16} style={{ color: C.blue }} />
                <h2 className="font-bold text-sm" style={{ color: C.heading }}>
                  {lang === "zh" ? "补充说明" : "Additional Notes"}
                </h2>
              </div>
              <div className="p-6">
                <textarea rows={4} value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder={lang === "zh"
                    ? "请描述您的特殊要求、阻抗控制需求、交期要求等..."
                    : "Describe any special requirements, impedance control, delivery timeline, etc..."}
                  className={`${inputCls} resize-none`} style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => Object.assign(e.target.style, { borderColor: C.cardBorder })} />
              </div>
            </div>

            {/* ── Submit button ────────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-4 pb-8">
              <p className="text-xs" style={{ color: C.muted }}>
                {lang === "zh"
                  ? "* 提交后工程师将在 1 个工作日内通过邮件回复报价"
                  : "* Engineers will reply with a quote by email within 1 business day"}
              </p>
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-200 active:scale-95 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: C.blue, minWidth: "160px", justifyContent: "center" }}
                onMouseEnter={e => !submitMutation.isPending && (e.currentTarget.style.background = C.blueDark)}
                onMouseLeave={e => (e.currentTarget.style.background = C.blue)}
              >
                {submitMutation.isPending
                  ? <><Loader2 size={15} className="animate-spin" /> {lang === "zh" ? "提交中..." : "Submitting..."}</>
                  : <>{lang === "zh" ? "提交报价请求" : "Submit Quote Request"}</>
                }
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="py-6 px-6 lg:px-16 text-center text-xs"
        style={{ background: C.sidebarBgDark, color: "#4A7AB5", borderTop: `1px solid ${C.sidebarBorder}` }}>
        © 2025 PCBforth Technology. All rights reserved.
      </footer>
    </div>
  );
}
