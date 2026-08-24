import { useEffect, useState } from "react";

// Starts false (matching SSR/first paint) and syncs to the real value in an
// effect — see useAuth.ts's useSessionQuery for why this codebase treats
// "only touch browser APIs after mount" as a hard rule, not a nicety.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
