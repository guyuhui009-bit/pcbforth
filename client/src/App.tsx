import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Quote from "./pages/Quote";
import DesignServices from "./pages/DesignServices";
import SchematicDesign from "./pages/design-services/SchematicDesign";
import PcbLayout from "./pages/design-services/PcbLayout";
import SignalIntegrity from "./pages/design-services/SignalIntegrity";
import PowerIntegrity from "./pages/design-services/PowerIntegrity";
import EmcDesign from "./pages/design-services/EmcDesign";
import DfmReview from "./pages/design-services/DfmReview";
import ComponentSelection from "./pages/design-services/ComponentSelection";
import Community from "./pages/Community";

function Router() {
  return (
    <Switch>
      {/* Home */}
      <Route path={"/"} component={Home} />
      {/* Quote */}
      <Route path={"/quote"} component={Quote} />
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
