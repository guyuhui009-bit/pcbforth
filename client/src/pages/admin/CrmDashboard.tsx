/**
 * CRM Dashboard — Admin overview
 * Shows key stats and recent activity across the CRM pipeline.
 */
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  Users, TrendingUp, FileText, Briefcase, Receipt,
  ChevronRight, Plus, RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const STAT_CARDS = [
  { key: "customers", label: "Customers", icon: Users, color: "text-blue-500", bg: "bg-blue-50", path: "/admin/crm/customers" },
  { key: "leads",     label: "Leads",     icon: TrendingUp, color: "text-green-500", bg: "bg-green-50", path: "/admin/crm/leads" },
  { key: "rfqs",      label: "RFQs",      icon: FileText, color: "text-amber-500", bg: "bg-amber-50", path: "/admin/crm/rfqs" },
  { key: "projects",  label: "Projects",  icon: Briefcase, color: "text-purple-500", bg: "bg-purple-50", path: "/admin/crm/projects" },
  { key: "invoices",  label: "Invoices",  icon: Receipt, color: "text-rose-500", bg: "bg-rose-50", path: "/admin/crm/invoices" },
] as const;

export default function CrmDashboard() {
  const [, setLocation] = useLocation();
  const { data: stats, isLoading, refetch } = trpc.crm.stats.useQuery();
  const { data: rfqData } = trpc.crm.rfqs.list.useQuery({ limit: 5 });
  const { data: leadData } = trpc.crm.leads.list.useQuery({ limit: 5 });

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            PCBforth sales pipeline overview
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, bg, path }) => (
          <Card
            key={key}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setLocation(path)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-12 mb-1" />
              ) : (
                <div className="text-2xl font-bold">{stats?.[key] ?? 0}</div>
              )}
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent RFQs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Recent RFQs</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs"
              onClick={() => setLocation("/admin/crm/rfqs")}
            >
              View all <ChevronRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {!rfqData?.items?.length ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No RFQs yet</p>
            ) : (
              rfqData.items.map((rfq) => (
                <div
                  key={rfq.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => setLocation(`/admin/crm/rfqs/${rfq.id}`)}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      RFQ #{rfq.id} — {rfq.pcbType?.toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rfq.layers ? `${rfq.layers}L` : "—"} ·{" "}
                      {rfq.quantity ? `${rfq.quantity} pcs` : "—"} ·{" "}
                      {new Date(rfq.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <RfqStatusBadge status={rfq.status} />
                </div>
              ))
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 gap-2"
              onClick={() => setLocation("/admin/crm/rfqs")}
            >
              <Plus className="h-3 w-3" /> Manage RFQs
            </Button>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Recent Leads</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs"
              onClick={() => setLocation("/admin/crm/leads")}
            >
              View all <ChevronRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {!leadData?.items?.length ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No leads yet</p>
            ) : (
              leadData.items.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => setLocation(`/admin/crm/leads/${lead.id}`)}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{lead.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {lead.source?.replace(/_/g, " ")} · {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <LeadStatusBadge status={lead.status} />
                </div>
              ))
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 gap-2"
              onClick={() => setLocation("/admin/crm/leads")}
            >
              <Plus className="h-3 w-3" /> Manage Leads
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick navigation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Quick Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Customers", path: "/admin/crm/customers", icon: Users },
              { label: "Leads", path: "/admin/crm/leads", icon: TrendingUp },
              { label: "RFQs", path: "/admin/crm/rfqs", icon: FileText },
              { label: "Quotes", path: "/admin/crm/quotes", icon: FileText },
              { label: "Projects", path: "/admin/crm/projects", icon: Briefcase },
              { label: "Invoices", path: "/admin/crm/invoices", icon: Receipt },
            ].map(({ label, path, icon: Icon }) => (
              <Button
                key={path}
                variant="outline"
                className="h-16 flex-col gap-2 text-xs"
                onClick={() => setLocation(path)}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Status badge helpers ──────────────────────────────────────────────────────

const RFQ_STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  reviewing: "bg-blue-100 text-blue-800",
  quoted:    "bg-purple-100 text-purple-800",
  accepted:  "bg-green-100 text-green-800",
  rejected:  "bg-red-100 text-red-800",
  completed: "bg-gray-100 text-gray-800",
};

function RfqStatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RFQ_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

const LEAD_STATUS_COLORS: Record<string, string> = {
  new:         "bg-blue-100 text-blue-800",
  contacted:   "bg-cyan-100 text-cyan-800",
  qualified:   "bg-teal-100 text-teal-800",
  proposal:    "bg-purple-100 text-purple-800",
  negotiation: "bg-amber-100 text-amber-800",
  won:         "bg-green-100 text-green-800",
  lost:        "bg-red-100 text-red-800",
};

function LeadStatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEAD_STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}
