/**
 * FreeSample.tsx — PCBforth 免费打样申请页面
 * 2-4层 PCB · 5pcs 免费打样 · 只需支付物流费
 * 默认工艺：制板（PCB制造）、无铅HASL、FR4、1.6mm板厚
 * 层数仅可选 2层 或 4层
 */
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Upload, X, FileText, CheckCircle2, Loader2,
  ChevronLeft, Globe, Gift,
} from "lucide-react";

// ── Design tokens ──────────────────────────────────────────────────────────
const C = {
  sidebarBg:     "#1A3A6B",
  sidebarBgDark: "#122A52",
  sidebarBorder: "rgba(255,255,255,0.12)",
  sidebarText:   "#B8D4F8",
  pageBg:        "#F0F6FF",
  cardBg:        "#FFFFFF",
  cardBorder:    "#D0E4FF",
  blueLight:     "#EBF3FF",
  heading:       "#0D2A5E",
  body:          "#2C4A7A",
  muted:         "#6B8CB8",
  blue:          "#1565E8",
  blueDark:      "#0D4DC4",
  green:         "#059669",
  greenBg:       "#D1FAE5",
  greenDark:     "#047857",
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

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// ── Main component ─────────────────────────────────────────────────────────
export default function FreeSample() {
  const { lang, setLang } = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<number | null>(null);

  // Form state — defaults locked for free sample
  const layers = "2"; // 免费打样仅支持 2 层
  const [form, setForm] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    company: "",
    boardWidth: "",
    boardHeight: "",
    notes: "",
  });

  // Fixed defaults (not editable)
  const FIXED = {
    pcbType:       "pcb" as const,
    quantity:      5,
    surfaceFinish: "HASL (Lead-free)",
    material:      "FR4",
    boardThickness: 1.6,
    copperWeight:  "1oz",
  };

  // tRPC mutations
  const uploadFileMutation = trpc.quote.uploadFile.useMutation();
  const submitMutation = trpc.crm.submitRfq.useMutation();

  // ── File handling ────────────────────────────────────────────────────────
  const processFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files);
    const MAX_SIZE = 16 * 1024 * 1024;

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

    const pendingUploads = uploadedFiles.filter(f => f.status === "uploading" || f.status === "pending");
    if (pendingUploads.length > 0) {
      toast.error(lang === "zh" ? "请等待文件上传完成" : "Please wait for files to finish uploading");
      return;
    }

    const doneFiles = uploadedFiles.filter(f => f.status === "done");

    try {
      const result = await submitMutation.mutateAsync({
        contactName: form.contactName,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone || undefined,
        company: form.company || undefined,
        rfqType: "free_sample",
        pcbType: FIXED.pcbType,
        layers: parseInt(layers),
        quantity: FIXED.quantity,
        boardWidth: form.boardWidth ? parseFloat(form.boardWidth) : undefined,
        boardHeight: form.boardHeight ? parseFloat(form.boardHeight) : undefined,
        boardThickness: FIXED.boardThickness,
        surfaceFinish: FIXED.surfaceFinish,
        material: FIXED.material,
        copperWeight: FIXED.copperWeight,
        services: ["fabrication"],
        notes: `[免费打样申请 / Free Sample Request]\n层数: ${layers}层\n${form.notes || ""}`,
        fileKeys: doneFiles.map(f => ({
          key: f.key!,
          url: f.url!,
          originalName: f.file.name,
          mimeType: f.file.type || undefined,
          fileSize: f.file.size,
        })),
      });

      setSubmitted(true);
      setSubmittedId(result.rfqId);
    } catch (err: any) {
      toast.error(err?.message ?? (lang === "zh" ? "提交失败，请重试" : "Submission failed, please try again"));
    }
  };

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
            style={{ background: C.greenBg }}>
            <Gift size={32} style={{ color: C.green }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: C.heading, fontFamily: "'Orbitron', monospace" }}>
            {lang === "zh" ? "申请成功！" : "Application Received!"}
          </h2>
          <p className="text-sm mb-1" style={{ color: C.muted }}>
            {lang === "zh" ? `申请编号：#${submittedId}` : `Application ID: #${submittedId}`}
          </p>
          <p className="text-sm leading-relaxed mb-6" style={{ color: C.body }}>
            {lang === "zh"
              ? "我们已收到您的免费打样申请，工程师将在 1 个工作日内通过邮件与您确认打样细节及物流费用。"
              : "We have received your free prototype application. Our engineers will contact you by email within 1 business day to confirm details and shipping cost."}
          </p>
          <a href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 active:scale-95"
            style={{ background: C.green }}>
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
      <div className="px-6 lg:px-16 py-10" style={{ background: "linear-gradient(135deg, #0D4DC4 0%, #059669 100%)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-white/50" />
            <span className="text-xs tracking-[0.3em] uppercase font-mono text-white/60">PCBforth · Limited Offer</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: "rgba(255,255,255,0.2)", color: "#FCD34D" }}>
              {lang === "zh" ? "限时免费" : "FREE"}
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-3"
            style={{ fontFamily: "'Orbitron', monospace" }}>
            {lang === "zh" ? "免费打样申请" : "Free Prototype Application"}
          </h1>
          <p className="text-sm text-white/80 max-w-xl leading-relaxed mb-4">
            {lang === "zh"
              ? "2–4层 PCB · 5pcs 免费打样，只需支付物流费。上传 Gerber 文件，填写板尺寸，工程师将在 1 个工作日内确认打样细节。"
              : "2–4 Layer PCB · 5pcs free prototype, pay shipping only. Upload your Gerber files, fill in board dimensions, and our engineers will confirm details within 1 business day."}
          </p>
          {/* Fixed spec badges */}
          <div className="flex flex-wrap gap-2">
            {[
              { zh: "PCB制板", en: "PCB Fabrication" },
              { zh: "无铅HASL", en: "Lead-free HASL" },
              { zh: "FR4板材", en: "FR4 Material" },
              { zh: "板厚 1.6mm", en: "1.6mm Thickness" },
              { zh: "铜厚 1oz", en: "1oz Copper" },
              { zh: "数量 5pcs", en: "Qty: 5pcs" },
            ].map(b => (
              <span key={b.zh}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: "rgba(255,255,255,0.15)", color: "#FFFFFF" }}>
                ✓ {lang === "zh" ? b.zh : b.en}
              </span>
            ))}
          </div>
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
                  {lang === "zh" ? "支持 Gerber、ZIP 等格式，单文件 ≤ 16MB" : "Gerber, ZIP, etc. — max 16MB each"}
                </span>
              </div>
              <div className="p-6">
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

            {/* ── Section 2: PCB specs (simplified) ──────────────────────── */}
            <div className="rounded-2xl overflow-hidden shadow-sm"
              style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              <div className="px-6 py-4 flex items-center gap-3"
                style={{ background: C.blueLight, borderBottom: `1px solid ${C.cardBorder}` }}>
                <Gift size={16} style={{ color: C.green }} />
                <h2 className="font-bold text-sm" style={{ color: C.heading }}>
                  {lang === "zh" ? "打样规格" : "Prototype Specifications"}
                </h2>
                <span className="text-xs ml-auto px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: C.greenBg, color: C.green }}>
                  {lang === "zh" ? "部分参数已固定" : "Some specs are fixed"}
                </span>
              </div>
              <div className="p-6 space-y-6">

                {/* Layer — fixed to 2 only */}
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: C.body }}>
                    {lang === "zh" ? "层数" : "Layers"}
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-24 h-12 rounded-xl font-bold text-base"
                      style={{ background: C.blue, color: "#FFFFFF", border: `2px solid ${C.blue}`, boxShadow: `0 4px 12px ${C.blue}40` }}>
                      2{lang === "zh" ? "层" : "L"}
                    </div>
                    <span className="text-xs" style={{ color: C.muted }}>
                      {lang === "zh" ? "免费打样仅支持 2 层板" : "Free prototype is limited to 2-layer boards"}
                    </span>
                  </div>
                </div>

                {/* Board dimensions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.body }}>
                      {lang === "zh" ? "板宽 (mm)" : "Width (mm)"}
                    </label>
                    <input type="number" min="0"
                      value={form.boardWidth}
                      onChange={e => setForm(p => ({ ...p, boardWidth: e.target.value }))}
                      placeholder="e.g. 100"
                      className={inputCls} style={inputStyle}
                      onFocus={e => Object.assign(e.target.style, focusStyle)}
                      onBlur={e => Object.assign(e.target.style, { borderColor: C.cardBorder })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.body }}>
                      {lang === "zh" ? "板高 (mm)" : "Height (mm)"}
                    </label>
                    <input type="number" min="0"
                      value={form.boardHeight}
                      onChange={e => setForm(p => ({ ...p, boardHeight: e.target.value }))}
                      placeholder="e.g. 80"
                      className={inputCls} style={inputStyle}
                      onFocus={e => Object.assign(e.target.style, focusStyle)}
                      onBlur={e => Object.assign(e.target.style, { borderColor: C.cardBorder })} />
                  </div>
                </div>

                {/* Fixed specs display */}
                <div className="rounded-xl p-4" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: C.green }}>
                    {lang === "zh" ? "以下规格已固定（免费打样标准工艺）" : "Fixed specifications (standard free prototype process)"}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { zh: "工艺", en: "Process",       val: lang === "zh" ? "PCB制板" : "PCB Fabrication" },
                      { zh: "数量", en: "Quantity",      val: "5 pcs" },
                      { zh: "表面处理", en: "Surface",   val: "HASL (Lead-free)" },
                      { zh: "板材", en: "Material",      val: "FR4" },
                      { zh: "板厚", en: "Thickness",     val: "1.6 mm" },
                      { zh: "铜厚", en: "Copper",        val: "1 oz" },
                    ].map(s => (
                      <div key={s.zh} className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.green }}>
                          {lang === "zh" ? s.zh : s.en}
                        </span>
                        <span className="text-xs font-bold" style={{ color: C.heading }}>{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 3: Notes ────────────────────────────────────────── */}
            <div className="rounded-2xl overflow-hidden shadow-sm"
              style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              <div className="px-6 py-4 flex items-center gap-3"
                style={{ background: C.blueLight, borderBottom: `1px solid ${C.cardBorder}` }}>
                <FileText size={16} style={{ color: C.blue }} />
                <h2 className="font-bold text-sm" style={{ color: C.heading }}>
                  {lang === "zh" ? "补充说明" : "Additional Notes"}
                </h2>
              </div>
              <div className="p-6">
                <textarea rows={4} value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder={lang === "zh"
                    ? "如有特殊要求（阻抗控制、颜色、特殊工艺等）请在此说明..."
                    : "Any special requirements (impedance control, color, special process, etc.)..."}
                  className={`${inputCls} resize-none`} style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => Object.assign(e.target.style, { borderColor: C.cardBorder })} />
              </div>
            </div>

            {/* ── Section 4: Contact info ─────────────────────────────────── */}
            <div className="rounded-2xl overflow-hidden shadow-sm"
              style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              <div className="px-6 py-4 flex items-center gap-3"
                style={{ background: C.blueLight, borderBottom: `1px solid ${C.cardBorder}` }}>
                <Globe size={16} style={{ color: C.blue }} />
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
                    placeholder={lang === "zh" ? "用于接收确认邮件" : "For receiving confirmation"}
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

            {/* ── Submit button ────────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-4 pb-8">
              <p className="text-xs" style={{ color: C.muted }}>
                {lang === "zh"
                  ? "* 提交后工程师将在 1 个工作日内通过邮件确认打样细节及物流费用"
                  : "* Engineers will confirm prototype details and shipping cost by email within 1 business day"}
              </p>
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-200 active:scale-95 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: C.green, minWidth: "180px", justifyContent: "center" }}
                onMouseEnter={e => !submitMutation.isPending && (e.currentTarget.style.background = C.greenDark)}
                onMouseLeave={e => (e.currentTarget.style.background = C.green)}
              >
                {submitMutation.isPending
                  ? <><Loader2 size={15} className="animate-spin" /> {lang === "zh" ? "提交中..." : "Submitting..."}</>
                  : <><Gift size={15} /> {lang === "zh" ? "提交免费打样申请" : "Submit Free Sample Request"}</>
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
