import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/** Resets window scroll on client-side route changes. */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
