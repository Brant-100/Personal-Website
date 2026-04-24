import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { HomePage } from "@/pages/HomePage";
import { ProjectDetail } from "@/pages/ProjectDetail";
import { BlogIndex } from "@/pages/BlogIndex";
import { BlogPost } from "@/pages/BlogPost";
import { Now } from "@/pages/Now";
import { ServicesPage } from "@/pages/ServicesPage";
import { WebDevDemo } from "@/pages/WebDevDemo";
import { UIDesignDemo } from "@/pages/UIDesignDemo";
import { CustomSoftwareDemo } from "@/pages/CustomSoftwareDemo";
import { AboutPage } from "@/pages/AboutPage";
import { NotFound } from "@/pages/NotFound";

function AppShell({ children }) {
  useKeyboardShortcuts();
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppShell>
        <div className="relative min-h-screen">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/now" element={<Now />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/web-development" element={<WebDevDemo />} />
              <Route path="/services/ui-ux-design" element={<UIDesignDemo />} />
              <Route path="/services/custom-software-solutions" element={<CustomSoftwareDemo />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <BackToTop />
          <CommandPalette />
        </div>
        </AppShell>
      </BrowserRouter>
    </ThemeProvider>
  );
}
