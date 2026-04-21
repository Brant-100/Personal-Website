import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HomePage } from "@/pages/HomePage";
import { WebDevDemo } from "@/pages/WebDevDemo";
import { UIDesignDemo } from "@/pages/UIDesignDemo";
import { CustomSoftwareDemo } from "@/pages/CustomSoftwareDemo";
import { NotFound } from "@/pages/NotFound";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="relative min-h-screen">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services/web-development" element={<WebDevDemo />} />
              <Route path="/services/ui-ux-design" element={<UIDesignDemo />} />
              <Route path="/services/custom-software-solutions" element={<CustomSoftwareDemo />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
