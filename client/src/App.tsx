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
