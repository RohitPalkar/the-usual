"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

export function Listeners() {
  const [count, setCount] = useState(siteConfig.listenersBase);

  useEffect(() => {
    const id = setInterval(() => {
      const drift = Math.floor(Math.random() * 9) - 4;
      setCount((c) => Math.max(20, c + drift));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="flex items-center gap-2 font-mono text-xs tabular-nums text-white/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      {count.toLocaleString("en-IN")} listeners now
    </p>
  );
}