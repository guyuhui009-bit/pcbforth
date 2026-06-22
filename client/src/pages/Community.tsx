/**
 * PCB Community Showcase
 * Users can browse, upload, like, and comment on PCB design projects.
 */
import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Heart, MessageCircle, Upload, X, ChevronLeft, ChevronRight,
  Layers, Cpu, Plus, Trash2, Send, LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// ── Design tokens (matches Home.tsx Blue-White theme) ──
const C = {
  pageBg: "#F0F6FF",
  cardBg: "#FFFFFF",
  cardBorder: "#D0E4FF",
  sectionAlt: "#EBF3FF",
  heading: "#0D2A5E",
  body: "#2C4A7A",
  muted: "#6B8CB8",
  blue: "#1565E8",
  blueDark: "#0D4DC4",
  blueLight: "#EBF3FF",
  divider: "#C8DEFF",
  sidebarBg: "#1A3A6B",
};

const CATEGORIES = ["All", "IoT", "Power", "Industrial", "RF", "Audio", "Automotive", "Medical", "Other"];
const SOFTWARES = ["Altium Designer", "KiCad", "Cadence OrCAD", "PADS", "Eagle", "Other"];

// ── Upload Modal ──
function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [layers, setLayers] = useState("");
  const [software, setSoftware] = useState("");
  const [category, setCategory] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<"image/jpeg" | "image/png" | "image/webp" | "image/gif">("image/jpeg");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const createMutation = trpc.community.create.useMutation({
    onSuccess: () => { onSuccess(); onClose(); },
    onError: (e) => setError(e.message),
  });

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5 MB"); return; }
    const mime = file.type as typeof imageMime;
    setImageMime(mime);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      setImageBase64(dataUrl.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  }, []);

  const handleSubmit = () => {
    if (!title.trim()) { setError("Title is required"); return; }
    if (!imageBase64) { setError("Please upload an image"); return; }
    setError("");
    createMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      layers: layers ? parseInt(layers) : undefined,
      software: software || undefined,
      category: category || undefined,
      imageBase64,
      imageMime,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,20,50,0.7)", backdropFilter: "blur(4px)" }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
        className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ background: C.sidebarBg, borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
          <h2 className="font-bold text-white text-lg" style={{ fontFamily: "'Orbitron', monospace" }}>
            Share Your PCB Design
          </h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {/* Image upload */}
          <div
            className="relative mb-5 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all"
            style={{ borderColor: preview ? C.blue : C.cardBorder, background: preview ? "transparent" : C.blueLight, minHeight: 180 }}
            onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
            onClick={() => !preview && fileRef.current?.click()}>
            {preview ? (
              <>
                <img src={preview} alt="preview" className="max-h-48 rounded-lg object-contain" />
                <button
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white"
                  style={{ background: "rgba(0,0,0,0.6)" }}
                  onClick={(e) => { e.stopPropagation(); setPreview(null); setImageBase64(null); }}>
                  <X size={14} />
                </button>
              </>
            ) : (
              <div className="text-center py-6">
                <Upload size={32} className="mx-auto mb-2" style={{ color: C.blue }} />
                <div className="text-sm font-semibold" style={{ color: C.blue }}>
                  Click or drag image here
                </div>
                <div className="text-xs mt-1" style={{ color: C.muted }}>PNG, JPG, WebP · Max 5 MB</div>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: C.muted }}>Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. STM32 Motor Controller"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
                style={{ border: `1.5px solid ${C.cardBorder}`, background: C.pageBg, color: C.heading }}
                onFocus={(e) => (e.target.style.borderColor = C.blue)}
                onBlur={(e) => (e.target.style.borderColor = C.cardBorder)} />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: C.muted }}>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your design, challenges, and solutions..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none transition-all"
                style={{ border: `1.5px solid ${C.cardBorder}`, background: C.pageBg, color: C.heading }}
                onFocus={(e) => (e.target.style.borderColor = C.blue)}
                onBlur={(e) => (e.target.style.borderColor = C.cardBorder)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: C.muted }}>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ border: `1.5px solid ${C.cardBorder}`, background: C.pageBg, color: C.heading }}>
                  <option value="">Select category</option>
                  {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: C.muted }}>Layers</label>
                <input value={layers} onChange={(e) => setLayers(e.target.value)} placeholder="e.g. 4" type="number" min={1} max={64}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ border: `1.5px solid ${C.cardBorder}`, background: C.pageBg, color: C.heading }} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: C.muted }}>EDA Software</label>
              <select value={software} onChange={(e) => setSoftware(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: `1.5px solid ${C.cardBorder}`, background: C.pageBg, color: C.heading }}>
                <option value="">Select software</option>
                {SOFTWARES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: C.muted }}>Tags (comma-separated)</label>
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. STM32, Motor Control, CAN Bus"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: `1.5px solid ${C.cardBorder}`, background: C.pageBg, color: C.heading }} />
            </div>
          </div>

          {error && (
            <div className="mt-4 px-4 py-2 rounded-lg text-sm" style={{ background: "#FEE2E2", color: "#B91C1C" }}>
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-white text-sm transition-all disabled:opacity-60"
              style={{ background: C.blue }}>
              {createMutation.isPending ? "Uploading..." : <><Upload size={15} /> Share Design</>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Project Detail Modal ──
function ProjectModal({ projectId, onClose, currentUserId }: {
  projectId: number; onClose: () => void; currentUserId?: number;
}) {
  const [comment, setComment] = useState("");
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.community.get.useQuery({ id: projectId });
  const likedQuery = trpc.community.isLiked.useQuery(
    { projectId },
    { enabled: !!currentUserId }
  );

  const toggleLike = trpc.community.toggleLike.useMutation({
    onSuccess: () => {
      utils.community.get.invalidate({ id: projectId });
      utils.community.isLiked.invalidate({ projectId });
    },
  });

  const addComment = trpc.community.addComment.useMutation({
    onSuccess: () => {
      setComment("");
      utils.community.get.invalidate({ id: projectId });
    },
  });

  const deleteComment = trpc.community.deleteComment.useMutation({
    onSuccess: () => utils.community.get.invalidate({ id: projectId }),
  });

  if (isLoading || !data) return null;
  const { project, comments } = data;
  const tags: string[] = project.tags ? JSON.parse(project.tags) : [];
  const isLiked = likedQuery.data?.liked ?? false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,20,50,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.2 }}
        className="w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ background: C.cardBg, maxHeight: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ background: C.sidebarBg }}>
          <div>
            <h2 className="font-bold text-white text-base">{project.title}</h2>
            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
              by {project.userName ?? "Anonymous"}
              {project.software && <> · {project.software}</>}
              {project.layers && <> · {project.layers}L</>}
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Image */}
          <div className="w-full bg-black flex items-center justify-center" style={{ maxHeight: 360 }}>
            <img src={project.imageUrl} alt={project.title} className="max-h-80 object-contain w-full" />
          </div>

          <div className="p-6">
            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: C.blueLight, color: C.blue, border: `1px solid ${C.cardBorder}` }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {project.description && (
              <p className="text-sm leading-relaxed mb-5" style={{ color: C.body }}>{project.description}</p>
            )}

            {/* Like button */}
            <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: `1px solid ${C.divider}` }}>
              <button
                onClick={() => currentUserId && toggleLike.mutate({ projectId })}
                disabled={!currentUserId || toggleLike.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
                style={{
                  background: isLiked ? "#FEE2E2" : C.blueLight,
                  color: isLiked ? "#DC2626" : C.blue,
                  border: `1px solid ${isLiked ? "#FECACA" : C.cardBorder}`,
                }}>
                <Heart size={15} fill={isLiked ? "#DC2626" : "none"} />
                {project.likesCount} {project.likesCount === 1 ? "Like" : "Likes"}
              </button>
              <div className="flex items-center gap-1.5 text-sm" style={{ color: C.muted }}>
                <MessageCircle size={15} />
                {project.commentsCount} {project.commentsCount === 1 ? "Comment" : "Comments"}
              </div>
            </div>

            {/* Comments */}
            <h3 className="font-bold text-sm mb-4" style={{ color: C.heading }}>Comments</h3>
            <div className="space-y-3 mb-5">
              {comments.length === 0 && (
                <div className="text-sm text-center py-4" style={{ color: C.muted }}>
                  No comments yet. Be the first!
                </div>
              )}
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: C.blue }}>
                    {(c.userName ?? "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 rounded-xl px-4 py-3" style={{ background: C.blueLight, border: `1px solid ${C.cardBorder}` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: C.heading }}>{c.userName ?? "Anonymous"}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px]" style={{ color: C.muted }}>
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                        {currentUserId === c.userId && (
                          <button onClick={() => deleteComment.mutate({ commentId: c.id })}
                            className="text-red-400 hover:text-red-600 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: C.body }}>{c.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add comment */}
            {currentUserId ? (
              <div className="flex gap-2">
                <input
                  value={comment} onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ border: `1.5px solid ${C.cardBorder}`, background: C.pageBg, color: C.heading }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && comment.trim()) {
                      e.preventDefault();
                      addComment.mutate({ projectId, content: comment.trim() });
                    }
                  }} />
                <button
                  onClick={() => comment.trim() && addComment.mutate({ projectId, content: comment.trim() })}
                  disabled={!comment.trim() || addComment.isPending}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-all disabled:opacity-50"
                  style={{ background: C.blue }}>
                  <Send size={16} />
                </button>
              </div>
            ) : (
              <a href={getLoginUrl()} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: C.blueLight, color: C.blue, border: `1px solid ${C.cardBorder}` }}>
                <LogIn size={15} /> Sign in to comment
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Project Card ──
function ProjectCard({ project, isLiked, onLike, onOpen, canDelete, onDelete }: {
  project: {
    id: number; title: string; description: string | null; tags: string | null;
    imageUrl: string; layers: number | null; software: string | null; category: string | null;
    likesCount: number; commentsCount: number; userName: string | null; createdAt: Date;
  };
  isLiked: boolean;
  onLike: () => void;
  onOpen: () => void;
  canDelete: boolean;
  onDelete: () => void;
}) {
  const tags: string[] = project.tags ? JSON.parse(project.tags) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200 hover:shadow-lg"
      style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}
      onClick={onOpen}>
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 200, background: "#0a1628" }}>
        <img src={project.imageUrl} alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        {/* Category badge */}
        {project.category && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(21,101,232,0.85)", color: "#fff" }}>
            {project.category}
          </div>
        )}
        {/* Delete button */}
        {canDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "rgba(220,38,38,0.85)" }}>
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-sm mb-1 line-clamp-1" style={{ color: C.heading }}>{project.title}</h3>
        <div className="text-xs mb-2 flex items-center gap-2" style={{ color: C.muted }}>
          <span>{project.userName ?? "Anonymous"}</span>
          {project.layers && (
            <span className="flex items-center gap-0.5">
              <Layers size={11} /> {project.layers}L
            </span>
          )}
          {project.software && (
            <span className="flex items-center gap-0.5">
              <Cpu size={11} /> {project.software.split(" ")[0]}
            </span>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: C.blueLight, color: C.blue, border: `1px solid ${C.cardBorder}` }}>
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: C.muted }}>+{tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Like & Comment counts */}
        <div className="flex items-center gap-4 pt-2" style={{ borderTop: `1px solid ${C.divider}` }}>
          <button
            onClick={(e) => { e.stopPropagation(); onLike(); }}
            className="flex items-center gap-1.5 text-xs font-semibold transition-all"
            style={{ color: isLiked ? "#DC2626" : C.muted }}>
            <Heart size={13} fill={isLiked ? "#DC2626" : "none"} />
            {project.likesCount}
          </button>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
            <MessageCircle size={13} />
            {project.commentsCount}
          </div>
          <div className="ml-auto text-[10px]" style={{ color: C.muted }}>
            {new Date(project.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Community Page ──
export default function Community() {
  const { user, isAuthenticated } = useAuth();
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const utils = trpc.useUtils();
  const LIMIT = 12;

  const { data, isLoading, refetch } = trpc.community.list.useQuery({
    limit: LIMIT,
    offset: page * LIMIT,
    category: category === "All" ? undefined : category,
  });

  const projects = data?.projects ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  // Batch fetch liked status
  const projectIds = projects.map(p => p.id);
  const myLikes = trpc.community.myLikes.useQuery(
    { projectIds },
    { enabled: isAuthenticated && projectIds.length > 0 }
  );
  const likedSet = new Set(myLikes.data?.likedIds ?? []);

  const toggleLike = trpc.community.toggleLike.useMutation({
    onMutate: async ({ projectId }) => {
      // Optimistic update
      await utils.community.myLikes.cancel();
      const prev = utils.community.myLikes.getData({ projectIds });
      utils.community.myLikes.setData({ projectIds }, (old) => {
        if (!old) return old;
        const isLiked = old.likedIds.includes(projectId);
        return {
          likedIds: isLiked
            ? old.likedIds.filter(id => id !== projectId)
            : [...old.likedIds, projectId],
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) utils.community.myLikes.setData({ projectIds }, ctx.prev);
    },
    onSettled: () => {
      utils.community.list.invalidate();
      utils.community.myLikes.invalidate();
    },
  });

  const deleteMutation = trpc.community.delete.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div className="min-h-screen" style={{ background: C.pageBg }}>
      {/* Header */}
      <div className="py-12 px-8 lg:px-16" style={{ background: `linear-gradient(135deg, ${C.sidebarBg}, #0D2A5E)` }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#60A5FA" }}>
                COMMUNITY
              </div>
              <h1 className="text-3xl font-black text-white" style={{ fontFamily: "'Orbitron', monospace" }}>
                PCB Design Showcase
              </h1>
              <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.65)" }}>
                Share your PCB designs, get feedback, and inspire others
              </p>
            </div>
            {isAuthenticated ? (
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95 shrink-0"
                style={{ background: C.blue, boxShadow: "0 4px 20px rgba(21,101,232,0.5)" }}>
                <Plus size={16} /> Share Your Design
              </button>
            ) : (
              <a href={getLoginUrl()}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm transition-all shrink-0"
                style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)" }}>
                <LogIn size={16} /> Sign in to Share
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="px-8 lg:px-16 py-4 sticky top-0 z-20 shadow-sm" style={{ background: C.cardBg, borderBottom: `1px solid ${C.divider}` }}>
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button key={cat}
              onClick={() => { setCategory(cat); setPage(0); }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
              style={{
                background: category === cat ? C.blue : C.blueLight,
                color: category === cat ? "#fff" : C.blue,
                border: `1px solid ${category === cat ? C.blue : C.cardBorder}`,
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-8 lg:px-16 py-10">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
                  <div className="h-48" style={{ background: C.blueLight }} />
                  <div className="p-4 space-y-2">
                    <div className="h-4 rounded" style={{ background: C.blueLight }} />
                    <div className="h-3 w-2/3 rounded" style={{ background: C.blueLight }} />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24">
              <Cpu size={48} className="mx-auto mb-4" style={{ color: C.muted }} />
              <div className="text-lg font-bold mb-2" style={{ color: C.heading }}>No designs yet</div>
              <div className="text-sm mb-6" style={{ color: C.muted }}>
                {isAuthenticated ? "Be the first to share your PCB design!" : "Sign in to share your first design."}
              </div>
              {isAuthenticated ? (
                <button onClick={() => setShowUpload(true)}
                  className="px-6 py-3 rounded-xl font-bold text-white text-sm"
                  style={{ background: C.blue }}>
                  <Plus size={15} className="inline mr-2" />Share Your Design
                </button>
              ) : (
                <a href={getLoginUrl()} className="px-6 py-3 rounded-xl font-bold text-white text-sm inline-flex items-center gap-2"
                  style={{ background: C.blue }}>
                  <LogIn size={15} /> Sign In
                </a>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isLiked={likedSet.has(project.id)}
                  onLike={() => {
                    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
                    toggleLike.mutate({ projectId: project.id });
                  }}
                  onOpen={() => setSelectedProject(project.id)}
                  canDelete={user?.id === project.userId}
                  onDelete={() => deleteMutation.mutate({ id: project.id })}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
                style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, color: C.blue }}>
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-semibold" style={{ color: C.heading }}>
                {page + 1} / {totalPages}
              </span>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
                style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, color: C.blue }}>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showUpload && (
          <UploadModal
            onClose={() => setShowUpload(false)}
            onSuccess={() => { refetch(); utils.community.list.invalidate(); }}
          />
        )}
        {selectedProject !== null && (
          <ProjectModal
            projectId={selectedProject}
            onClose={() => setSelectedProject(null)}
            currentUserId={user?.id}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
