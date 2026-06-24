/**
 * ProjectDetail — View and manage a single project, including logs and files.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft, Plus, FileText, Download, Loader2, Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  planning:    "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  review:      "bg-purple-100 text-purple-800",
  on_hold:     "bg-gray-100 text-gray-700",
  completed:   "bg-green-100 text-green-800",
  cancelled:   "bg-red-100 text-red-800",
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const projectId = parseInt(id ?? "0");

  const { data, isLoading, refetch } = trpc.crm.projects.get.useQuery({ id: projectId });
  const updateMutation = trpc.crm.projects.update.useMutation({
    onSuccess: () => { toast.success("Project updated"); refetch(); setShowEdit(false); },
    onError: (e) => toast.error(e.message),
  });
  const addLogMutation = trpc.crm.projects.addLog.useMutation({
    onSuccess: () => { toast.success("Log added"); refetch(); setShowAddLog(false); },
    onError: (e) => toast.error(e.message),
  });

  const [showEdit, setShowEdit] = useState(false);
  const [showAddLog, setShowAddLog] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", status: "planning" as any, notes: "" });
  const [logForm, setLogForm] = useState({ action: "", note: "" });

  const openEdit = () => {
    if (data?.project) {
      setEditForm({
        title: data.project.title,
        status: data.project.status,
        notes: data.project.notes ?? "",
      });
    }
    setShowEdit(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!data?.project) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Project not found.{" "}
        <Button variant="link" onClick={() => setLocation("/admin/crm/projects")}>Go back</Button>
      </div>
    );
  }

  const { project, files, logs } = data;

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/admin/crm/projects")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{project.title}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[project.status] ?? "bg-gray-100"}`}>
                {project.status.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {project.projectNumber && `#${project.projectNumber} · `}
              Created {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={openEdit} className="gap-2 shrink-0">
          <Edit2 className="h-4 w-4" /> Edit
        </Button>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["Status", project.status.replace(/_/g, " ")],
          ["Start Date", project.startDate ? new Date(project.startDate).toLocaleDateString() : "—"],
          ["Deadline", project.deadline ? new Date(project.deadline).toLocaleDateString() : "—"],
          ["Completed", project.completedAt ? new Date(project.completedAt).toLocaleDateString() : "—"],
        ].map(([k, v]) => (
          <div key={k} className="p-3 rounded-lg border">
            <div className="text-xs text-muted-foreground mb-1">{k}</div>
            <div className="text-sm font-medium">{v}</div>
          </div>
        ))}
      </div>

      {project.notes && (
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Notes</div>
            <p className="text-sm whitespace-pre-wrap">{project.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="logs">
        <TabsList>
          <TabsTrigger value="logs">Activity Log ({logs.length})</TabsTrigger>
          <TabsTrigger value="files">Files ({files.length})</TabsTrigger>
        </TabsList>

        {/* Logs tab */}
        <TabsContent value="logs" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowAddLog(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add Log
            </Button>
          </div>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No log entries yet</p>
          ) : (
            <div className="space-y-2">
              {[...logs].reverse().map((log) => (
                <div key={log.id} className="flex gap-3 p-3 rounded-lg border">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{log.action}</div>
                    {log.note && <div className="text-xs text-muted-foreground mt-0.5">{log.note}</div>}
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Files tab */}
        <TabsContent value="files" className="mt-4 space-y-3">
          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No files attached</p>
          ) : (
            files.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm truncate">{f.originalName}</div>
                    {f.category && <div className="text-xs text-muted-foreground">{f.category}</div>}
                  </div>
                </div>
                <a href={f.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Edit dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Project</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input className="mt-1" value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={editForm.status} onValueChange={(v: any) => setEditForm({ ...editForm, status: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["planning","in_progress","review","on_hold","completed","cancelled"].map(s => (
                    <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Input className="mt-1" value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button
              onClick={() => updateMutation.mutate({ id: projectId, ...editForm, title: editForm.title || undefined, notes: editForm.notes || undefined })}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Log dialog */}
      <Dialog open={showAddLog} onOpenChange={setShowAddLog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Log Entry</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Action *</label>
              <Input className="mt-1" value={logForm.action}
                onChange={(e) => setLogForm({ ...logForm, action: e.target.value })}
                placeholder="e.g. Gerber files reviewed" />
            </div>
            <div>
              <label className="text-sm font-medium">Note</label>
              <Input className="mt-1" value={logForm.note}
                onChange={(e) => setLogForm({ ...logForm, note: e.target.value })}
                placeholder="Optional details..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddLog(false)}>Cancel</Button>
            <Button
              onClick={() => addLogMutation.mutate({
                projectId,
                action: logForm.action,
                note: logForm.note || undefined,
              })}
              disabled={addLogMutation.isPending || !logForm.action.trim()}
            >
              {addLogMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
