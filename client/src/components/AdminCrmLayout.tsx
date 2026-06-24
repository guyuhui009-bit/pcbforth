/**
 * AdminCrmLayout — Sidebar layout for CRM admin pages.
 * Uses DashboardLayout pattern but with CRM-specific navigation.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  LayoutDashboard, Users, TrendingUp, FileText, Briefcase, Receipt,
  ChevronLeft, Menu, X,
} from "lucide-react";
import { useState } from "react";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview",  path: "/admin/crm" },
  { icon: Users,           label: "Customers", path: "/admin/crm/customers" },
  { icon: TrendingUp,      label: "Leads",     path: "/admin/crm/leads" },
  { icon: FileText,        label: "RFQs",      path: "/admin/crm/rfqs" },
  { icon: FileText,        label: "Quotes",    path: "/admin/crm/quotes" },
  { icon: Briefcase,       label: "Projects",  path: "/admin/crm/projects" },
  { icon: Receipt,         label: "Invoices",  path: "/admin/crm/invoices" },
];

export default function AdminCrmLayout({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) return <DashboardLayoutSkeleton />;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-6 p-8 max-w-md w-full">
          <h1 className="text-2xl font-semibold tracking-tight text-center">Admin Access Required</h1>
          <p className="text-sm text-muted-foreground text-center">
            Sign in with an admin account to access the CRM dashboard.
          </p>
          <Button
            onClick={() => { window.location.href = getLoginUrl(); }}
            size="lg"
            className="w-full"
          >
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r bg-card transition-all duration-200 shrink-0 ${
          sidebarOpen ? "w-56" : "w-14"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-14 px-3 border-b">
          {sidebarOpen && (
            <span className="font-semibold text-sm truncate">CRM Admin</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Back to site */}
        <div className="px-2 pt-3">
          <button
            onClick={() => setLocation("/")}
            className={`flex items-center gap-2 w-full px-2 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ${!sidebarOpen ? "justify-center" : ""}`}
          >
            <ChevronLeft className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Back to site</span>}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
            const isActive = path === "/admin/crm"
              ? location === path
              : location.startsWith(path);
            return (
              <button
                key={path}
                onClick={() => setLocation(path)}
                className={`flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                } ${!sidebarOpen ? "justify-center" : ""}`}
                title={!sidebarOpen ? label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User info */}
        {sidebarOpen && (
          <div className="px-3 py-3 border-t">
            <div className="text-xs text-muted-foreground truncate">{user.name}</div>
            <div className="text-xs text-muted-foreground truncate opacity-60">{user.role}</div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
