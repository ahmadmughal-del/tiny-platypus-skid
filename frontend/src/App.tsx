import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CoreWorkspace from "./pages/CoreWorkspace";
import MyForge from "./pages/MyForge";
import ReportDetail from "./pages/ReportDetail"; // Import the new ReportDetail component
import Metrics from "./pages/Metrics"; // Import the new Metrics component
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/workspace" element={<CoreWorkspace />} />
          <Route path="/my-forge" element={<MyForge />} />
          <Route path="/my-forge/:reportId" element={<ReportDetail />} />
        </Route>
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;