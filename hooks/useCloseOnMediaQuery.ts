"use client";

import { useEffect } from "react";

export function useCloseOnMediaQuery(query: string, onMatch: () => void): void {
  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches) {
      onMatch();
    }

    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        onMatch();
      }
    };

    media.addEventListener("change", onChange);

    return () => {
      media.removeEventListener("change", onChange);
    };
  }, [query, onMatch]);
}
