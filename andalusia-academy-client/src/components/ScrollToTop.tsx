import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Router keeps the old scroll position on navigation; reset it when the page changes.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
