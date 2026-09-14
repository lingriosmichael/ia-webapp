import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Fades an element in once it nears the viewport. Starts revealed (matching
// SSR/first paint, and matching useMediaQuery's "browser APIs only after
// mount" rule) so nothing but a visitor with a real IntersectionObserver in a
// motion-safe browser ever sees the hidden state.
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );
  const [isRevealed, setIsRevealed] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (
      !node ||
      prefersReducedMotion ||
      typeof IntersectionObserver === "undefined"
    ) {
      setIsRevealed(true);
      return;
    }

    setIsRevealed(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return { ref, isRevealed };
}
