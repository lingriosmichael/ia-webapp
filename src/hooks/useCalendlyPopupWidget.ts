import { useEffect, useRef } from "react";

const CALENDLY_SCRIPT_SRC =
  "https://assets.calendly.com/assets/external/widget.js";
const CALENDLY_STYLESHEET_HREF =
  "https://assets.calendly.com/assets/external/widget.css";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

function ensureCalendlyStylesheet() {
  if (document.querySelector(`link[href="${CALENDLY_STYLESHEET_HREF}"]`)) {
    return;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = CALENDLY_STYLESHEET_HREF;
  document.head.appendChild(link);
}

function loadCalendlyScript(): Promise<void> {
  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="${CALENDLY_SCRIPT_SRC}"]`,
  );
  if (existingScript) {
    return new Promise((resolve) => {
      if (window.Calendly) {
        resolve();
        return;
      }
      existingScript.addEventListener("load", () => resolve());
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", () => resolve());
    document.body.appendChild(script);
  });
}

// Loads Calendly's official popup widget assets on mount and returns a
// function that opens the popup for a given event URL. Kept as a hook
// (not inline component logic) per this repo's "hooks orchestrate,
// components render" convention — the component just calls openCalendlyPopup.
export function useCalendlyPopupWidget() {
  const readyPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    ensureCalendlyStylesheet();
    readyPromiseRef.current = loadCalendlyScript();
  }, []);

  const openCalendlyPopup = (calendlyUrl: string) => {
    void (readyPromiseRef.current ?? loadCalendlyScript()).then(() => {
      window.Calendly?.initPopupWidget({ url: calendlyUrl });
    });
  };

  return { openCalendlyPopup };
}
