/**
 * RfqDetail — View a single RFQ, update status, create quotes, view files.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft, FileText, Plus, Loader2, Download,
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  reviewing: "bg-blue-100 text-blue-800",
  quoted:    "bg-purple-100 text-purple-800",
  accepted:  "bg-green-100 text-green-800",
  rejected:  "bg-red-100 text-red-800",
  completed: "bg-gray-100 text-gray-700",
};

export default function RfqDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const rfqId = parseInt(id ?? "0");

  const { data, isLoading, refetch } = trpc.crm.rfqs.get.useQuery({ id: rfqId });
  const updateStatusMutation = trpc.crm.rfqs.updateStatus.useMutation({
    onSuccess: () => { toast.success("Status updated"); refetch(); },
    onError: (e) => toast.error(e.message),
  });
  const createQuoteMutation = trpc.crm.quotes.create.useMutation({
    onSuccess: () => { toast.success("Quote created"); refetch(); setShowCreateQuote(false); },
    onError: (e) => toast.error(e.message),
  });

  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    unitPrice: "",
    totalPrice: "",
    currency: "USD",
    leadTimeDays: "",
    paymentTerms: "",
    deliveryTerms: "EXW",
    warranty: "",
    notes: "",
    status: "draft" as const,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!data?.rfq) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        RFQ not found.{" "}
        <Button variant="link" onClick={() => setLocation("/admin/crm/rfqs")}>Go back</Button>
      </div>
    );
  }

  const { rfq, files, quotes } = data;

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/admin/crm/rfqs")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">RFQ #{rfq.id}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[rfq.status] ?? "bg-gray-100"}`}>
                {rfq.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Submitted {new Date(rfq.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select
            value={rfq.status}
            onValueChange={(v: any) => updateStatusMutation.mutate({ id: rfqId, status: v })}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["pending","reviewing","quoted","accepted","rejected","completed"].map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* PCB Specs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">PCB Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              {[
                ["Type", rfq.rfqType?.replace(/_/g, " ")],
                ["PCB Type", rfq.pcbType?.toUpperCase()],
                ["Layers", rfq.layers ? `${rfq.layers}L` : null],
                ["Quantity", rfq.quantity ? `${rfq.quantity} pcs` : null],
                ["Board Size", rfq.boardWidth && rfq.boardHeight ? `${rfq.boardWidth} × ${rfq.boardHeight} mm` : null],
                ["Thickness", rfq.boardThickness ? `${rfq.boardThickness} mm` : null],
                ["Material", rfq.material],
                ["Surface Finish", rfq.surfaceFinish],
                ["Copper Weight", rfq.copperWeight],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k as string} className="flex justify-between">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            {rfq.notes && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-muted-foreground mb-1">Notes</div>
                <p className="text-sm whitespace-pre-wrap">{rfq.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Files */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Attached Files ({files.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <p className="text-sm text-muted-foreground">No files attached</p>
            ) : (
              <div className="space-y-2">
                {files.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm truncate">{f.originalName}</span>
                    </div>
                    <a href={f.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quotes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Quotes ({quotes.length})</CardTitle>
          <Button size="sm" onClick={() => setShowCreateQuote(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Create Quote
          </Button>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No quotes yet. Create one to send to the customer.</p>
          ) : (
            <div className="space-y-3">
              {quotes.map((q) => (
                <div key={q.id} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">Quote #{q.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      q.status === "accepted" ? "bg-green-100 text-green-800" :
                      q.status === "sent" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-700"
                    }`}>{q.status}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                    {q.totalPrice && <div><span className="font-medium text-foreground">{q.currency} {q.totalPrice}</span> total</div>}
                    {q.unitPrice && <div><span className="font-medium text-foreground">{q.currency} {q.unitPrice}</span>/unit</div>}
                    {q.leadTimeDays && <div><span className="font-medium text-foreground">{q.leadTimeDays}</span> days lead</div>}
                    {q.paymentTerms && <div>{q.paymentTerms}</div>}
                  </div>
                  {q.notes && <p className="text-xs text-muted-foreground mt-2">{q.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Quote dialog */}
      <Dialog open={showCreateQuote} onOpenChange={setShowCreateQuote}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Create Quote</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Unit Price</label>
                <Input className="mt-1" type="number" value={quoteForm.unitPrice}
                  onChange={(e) => setQuoteForm({ ...quoteForm, unitPrice: e.target.value })}
                  placeholder="0.00" />
              </div>
              <div>
                <label className="text-sm font-medium">Total Price</label>
                <Input className="mt-1" type="number" value={quoteForm.totalPrice}
                  onChange={(e) => setQuoteForm({ ...quoteForm, totalPrice: e.target.value })}
                  placeholder="0.00" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Currency</label>
                <Select value={quoteForm.currency} onValueChange={(v) => setQuoteForm({ ...quoteForm, currency: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="CNY">CNY</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Lead Time (days)</label>
                <Input className="mt-1" type="number" value={quoteForm.leadTimeDays}
                  onChange={(e) => setQuoteForm({ ...quoteForm, leadTimeDays: e.target.value })}
                  placeholder="e.g. 14" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Payment Terms</label>
              <Input className="mt-1" value={quoteForm.paymentTerms}
                onChange={(e) => setQuoteForm({ ...quoteForm, paymentTerms: e.target.value })}
                placeholder="e.g. 30% deposit, 70% before shipment" />
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Input className="mt-1" value={quoteForm.notes}
                onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                placeholder="Additional notes..." />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={quoteForm.status} onValueChange={(v: any) => setQuoteForm({ ...quoteForm, status: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateQuote(false)}>Cancel</Button>
            <Button
              onClick={() => createQuoteMutation.mutate({
                rfqId,
                unitPrice: quoteForm.unitPrice ? parseFloat(quoteForm.unitPrice) : undefined,
                totalPrice: quoteForm.totalPrice ? parseFloat(quoteForm.totalPrice) : undefined,
                currency: quoteForm.currency,
                leadTimeDays: quoteForm.leadTimeDays ? parseInt(quoteForm.leadTimeDays) : undefined,
                paymentTerms: quoteForm.paymentTerms || undefined,
                deliveryTerms: quoteForm.deliveryTerms || undefined,
                notes: quoteForm.notes || undefined,
                status: quoteForm.status,
              })}
              disabled={createQuoteMutation.isPending}
            >
              {createQuoteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
