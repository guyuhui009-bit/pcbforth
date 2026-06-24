import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// Lazy-loaded routes — all 11 pages
const Home               = lazy(() => import("./pages/Home"));
const Quote              = lazy(() => import("./pages/Quote"));
const DesignServices     = lazy(() => import("./pages/DesignServices"));
const SchematicDesign    = lazy(() => import("./pages/design-services/SchematicDesign"));
const PcbLayout          = lazy(() => import("./pages/design-services/PcbLayout"));
const SignalIntegrity    = lazy(() => import("./pages/design-services/SignalIntegrity"));
const PowerIntegrity     = lazy(() => import("./pages/design-services/PowerIntegrity"));
const EmcDesign          = lazy(() => import("./pages/design-services/EmcDesign"));
const DfmReview          = lazy(() => import("./pages/design-services/DfmReview"));
const ComponentSelection = lazy(() => import("./pages/design-services/ComponentSelection"));
const Community          = lazy(() => import("./pages/Community"));
const NotFound           = lazy(() => import("./pages/NotFound"));
const FreeSample         = lazy(() => import("./pages/FreeSample"));

// CRM Admin pages
const AdminCrmLayout     = lazy(() => import("./components/AdminCrmLayout"));
const CrmDashboard       = lazy(() => import("./pages/admin/CrmDashboard"));
const Customers          = lazy(() => import("./pages/admin/Customers"));
const CustomerDetail     = lazy(() => import("./pages/admin/CustomerDetail"));
const Leads              = lazy(() => import("./pages/admin/Leads"));
const Rfqs               = lazy(() => import("./pages/admin/Rfqs"));
const RfqDetail          = lazy(() => import("./pages/admin/RfqDetail"));
const Quotes             = lazy(() => import("./pages/admin/Quotes"));
const Projects           = lazy(() => import("./pages/admin/Projects"));
const ProjectDetail      = lazy(() => import("./pages/admin/ProjectDetail"));
const Invoices           = lazy(() => import("./pages/admin/Invoices"));

function Router() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0D1B3E" }} />}>
      <Switch>
        {/* Home */}
        <Route path={"/"} component={Home} />
        {/* Quote */}
        <Route path={"/quote"} component={Quote} />
        <Route path={"/free-sample"} component={FreeSample} />
        {/* Design Services — overview */}
        <Route path={"/design-services"} component={DesignServices} />
        {/* Design Services — sub-pages */}
        <Route path={"/design-services/schematic"} component={SchematicDesign} />
        <Route path={"/design-services/pcb-layout"} component={PcbLayout} />
        <Route path={"/design-services/si"} component={SignalIntegrity} />
        <Route path={"/design-services/pi"} component={PowerIntegrity} />
        <Route path={"/design-services/emc"} component={EmcDesign} />
        <Route path={"/design-services/dfm"} component={DfmReview} />
        <Route path={"/design-services/components"} component={ComponentSelection} />
        {/* Community Showcase */}
        <Route path={"/community"} component={Community} />
        {/* CRM Admin */}
        <Route path="/admin/crm" component={() => <AdminCrmLayout><CrmDashboard /></AdminCrmLayout>} />
        <Route path="/admin/crm/customers" component={() => <AdminCrmLayout><Customers /></AdminCrmLayout>} />
        <Route path="/admin/crm/customers/:id" component={() => <AdminCrmLayout><CustomerDetail /></AdminCrmLayout>} />
        <Route path="/admin/crm/leads" component={() => <AdminCrmLayout><Leads /></AdminCrmLayout>} />
        <Route path="/admin/crm/rfqs" component={() => <AdminCrmLayout><Rfqs /></AdminCrmLayout>} />
        <Route path="/admin/crm/rfqs/:id" component={() => <AdminCrmLayout><RfqDetail /></AdminCrmLayout>} />
        <Route path="/admin/crm/quotes" component={() => <AdminCrmLayout><Quotes /></AdminCrmLayout>} />
        <Route path="/admin/crm/projects" component={() => <AdminCrmLayout><Projects /></AdminCrmLayout>} />
        <Route path="/admin/crm/projects/:id" component={() => <AdminCrmLayout><ProjectDetail /></AdminCrmLayout>} />
        <Route path="/admin/crm/invoices" component={() => <AdminCrmLayout><Invoices /></AdminCrmLayout>} />

        {/* 404 */}
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
