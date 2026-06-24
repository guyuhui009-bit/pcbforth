/**
 * CustomerDetail — View and manage a single customer record.
 * Shows contacts, leads, activities, and allows editing.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft, Plus, Phone, Mail, MessageSquare, Edit2, Loader2,
  Users, TrendingUp, Activity as ActivityIcon,
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
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const STAGE_COLORS: Record<string, string> = {
  prospect: "bg-blue-100 text-blue-800",
  active:   "bg-green-100 text-green-800",
  vip:      "bg-purple-100 text-purple-800",
  inactive: "bg-gray-100 text-gray-700",
  lost:     "bg-red-100 text-red-800",
};

const LEAD_STATUS_COLORS: Record<string, string> = {
  new:         "bg-blue-100 text-blue-800",
  contacted:   "bg-cyan-100 text-cyan-800",
  qualified:   "bg-teal-100 text-teal-800",
  proposal:    "bg-purple-100 text-purple-800",
  negotiation: "bg-amber-100 text-amber-800",
  won:         "bg-green-100 text-green-800",
  lost:        "bg-red-100 text-red-800",
};

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const customerId = parseInt(id ?? "0");

  const { data, isLoading, refetch } = trpc.crm.customers.get.useQuery({ id: customerId });
  const updateMutation = trpc.crm.customers.update.useMutation({
    onSuccess: () => { toast.success("Customer updated"); refetch(); setShowEdit(false); },
    onError: (e) => toast.error(e.message),
  });
  const createContactMutation = trpc.crm.contacts.create.useMutation({
    onSuccess: () => { toast.success("Contact added"); refetch(); setShowAddContact(false); },
    onError: (e) => toast.error(e.message),
  });
  const createActivityMutation = trpc.crm.activities.create.useMutation({
    onSuccess: () => { toast.success("Activity logged"); refetch(); setShowAddActivity(false); },
    onError: (e) => toast.error(e.message),
  });

  const [showEdit, setShowEdit] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);

  const [editForm, setEditForm] = useState({
    companyName: "", industry: "", country: "", city: "", website: "", notes: "", stage: "prospect" as any,
  });
  const [contactForm, setContactForm] = useState({
    name: "", title: "", email: "", phone: "", wechat: "", isPrimary: false, notes: "",
  });
  const [activityForm, setActivityForm] = useState({
    type: "note" as any, subject: "", description: "",
  });

  const openEdit = () => {
    if (data?.customer) {
      setEditForm({
        companyName: data.customer.companyName,
        industry: data.customer.industry ?? "",
        country: data.customer.country ?? "",
        city: data.customer.city ?? "",
        website: data.customer.website ?? "",
        notes: data.customer.notes ?? "",
        stage: data.customer.stage,
      });
    }
    setShowEdit(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!data?.customer) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Customer not found.{" "}
        <Button variant="link" onClick={() => setLocation("/admin/crm/customers")}>
          Go back
        </Button>
      </div>
    );
  }

  const { customer, contacts, leads, activities } = data;

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      {/* Back + header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/admin/crm/customers")} className="mt-0.5">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{customer.companyName}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STAGE_COLORS[customer.stage]}`}>
                {customer.stage}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {[customer.industry, customer.country, customer.city].filter(Boolean).join(" · ") || "No details"}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={openEdit} className="gap-2 shrink-0">
          <Edit2 className="h-4 w-4" /> Edit
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="contacts">
        <TabsList>
          <TabsTrigger value="contacts" className="gap-2">
            <Users className="h-4 w-4" /> Contacts ({contacts.length})
          </TabsTrigger>
          <TabsTrigger value="leads" className="gap-2">
            <TrendingUp className="h-4 w-4" /> Leads ({leads.length})
          </TabsTrigger>
          <TabsTrigger value="activities" className="gap-2">
            <ActivityIcon className="h-4 w-4" /> Activities ({activities.length})
          </TabsTrigger>
        </TabsList>

        {/* Contacts tab */}
        <TabsContent value="contacts" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowAddContact(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add Contact
            </Button>
          </div>
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No contacts yet</p>
          ) : (
            contacts.map((c) => (
              <Card key={c.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{c.name}
                        {c.isPrimary && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Primary</span>
                        )}
                      </div>
                      {c.title && <div className="text-sm text-muted-foreground">{c.title}</div>}
                      <div className="flex flex-wrap gap-3 mt-2">
                        {c.email && (
                          <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                            <Mail className="h-3 w-3" /> {c.email}
                          </a>
                        )}
                        {c.phone && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" /> {c.phone}
                          </span>
                        )}
                        {c.wechat && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageSquare className="h-3 w-3" /> {c.wechat}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Leads tab */}
        <TabsContent value="leads" className="mt-4 space-y-3">
          {leads.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No leads yet</p>
          ) : (
            leads.map((l) => (
              <Card
                key={l.id}
                className="cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => setLocation(`/admin/crm/leads/${l.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{l.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {l.source?.replace(/_/g, " ")} · {new Date(l.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEAD_STATUS_COLORS[l.status]}`}>
                      {l.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Activities tab */}
        <TabsContent value="activities" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowAddActivity(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Log Activity
            </Button>
          </div>
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No activities yet</p>
          ) : (
            <div className="space-y-2">
              {activities.map((a) => (
                <div key={a.id} className="flex gap-3 p-3 rounded-lg border">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">
                      {a.type.replace(/_/g, " ")}
                      {a.subject && ` — ${a.subject}`}
                    </div>
                    {a.description && <div className="text-xs text-muted-foreground mt-0.5">{a.description}</div>}
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(a.occurredAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Customer</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Company Name *</label>
              <Input className="mt-1" value={editForm.companyName}
                onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Industry</label>
                <Input className="mt-1" value={editForm.industry}
                  onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Country</label>
                <Input className="mt-1" value={editForm.country}
                  onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Stage</label>
              <Select value={editForm.stage} onValueChange={(v: any) => setEditForm({ ...editForm, stage: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["prospect","active","vip","inactive","lost"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
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
              onClick={() => updateMutation.mutate({ id: customerId, ...editForm })}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Contact dialog */}
      <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Contact</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input className="mt-1" value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input className="mt-1" value={contactForm.title}
                  onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
                  placeholder="e.g. Hardware Engineer" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input className="mt-1" type="email" value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input className="mt-1" value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">WeChat</label>
                <Input className="mt-1" value={contactForm.wechat}
                  onChange={(e) => setContactForm({ ...contactForm, wechat: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddContact(false)}>Cancel</Button>
            <Button
              onClick={() => createContactMutation.mutate({ customerId, ...contactForm, email: contactForm.email || undefined, phone: contactForm.phone || undefined, wechat: contactForm.wechat || undefined, title: contactForm.title || undefined })}
              disabled={createContactMutation.isPending}
            >
              {createContactMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Activity dialog */}
      <Dialog open={showAddActivity} onOpenChange={setShowAddActivity}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Log Activity</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={activityForm.type} onValueChange={(v: any) => setActivityForm({ ...activityForm, type: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["call","email","meeting","wechat","demo","quote_sent","sample_sent","follow_up","note"].map(t => (
                    <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input className="mt-1" value={activityForm.subject}
                onChange={(e) => setActivityForm({ ...activityForm, subject: e.target.value })}
                placeholder="Brief subject..." />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input className="mt-1" value={activityForm.description}
                onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                placeholder="Details..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddActivity(false)}>Cancel</Button>
            <Button
              onClick={() => createActivityMutation.mutate({
                customerId,
                type: activityForm.type,
                subject: activityForm.subject || undefined,
                description: activityForm.description || undefined,
              })}
              disabled={createActivityMutation.isPending}
            >
              {createActivityMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Log
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
