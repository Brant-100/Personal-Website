import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

/**
 * Global keyboard shortcuts:
 *   g p  — jump to #projects
 *   g c  — jump to #contact
 *   g b  — navigate to /blog
 *   t    — toggle theme
 *
 * Does NOT fire when focus is inside an input, textarea, or contenteditable.
 */
export function useKeyboardShortcuts() {
  const { toggle } = useTheme();
  const navigate = useNavigate();
  const pendingRef = useRef(null);

  useEffect(() => {
    const isEditable = (el) => {
      if (!el) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
    };

    const scrollTo = (id) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(`/#${id}`);
      }
    };

    const onKey = (e) => {
      if (isEditable(document.activeElement)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();

      // "g" prefix sequence
      if (pendingRef.current === "g") {
        pendingRef.current = null;
        clearTimeout(pendingRef._timer);
        if (key === "p") { scrollTo("projects"); return; }
        if (key === "c") { scrollTo("contact"); return; }
        if (key === "b") { navigate("/blog"); return; }
        return;
      }

      if (key === "g") {
        pendingRef.current = "g";
        pendingRef._timer = setTimeout(() => {
          pendingRef.current = null;
        }, 800);
        return;
      }

      if (key === "t") {
        toggle();
        return;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, navigate]);
}
