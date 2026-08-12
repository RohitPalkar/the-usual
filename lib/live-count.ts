"use client";

import { useSyncExternalStore } from "react";
import { siteConfig } from "@/lib/site";

let count = siteConfig.listenersBase;
const subscribers = new Set<() => void>();
let running = false;

function tick() {
  const drift = Math.floor(Math.random() * 9) - 4;
  count = Math.max(20, count + drift);
  subscribers.forEach((cb) => cb());
}

function ensureRunning() {
  if (running) return;
  running = true;
  setInterval(tick, 5000);
}

export function useLiveCount(): number {
  ensureRunning();
  return useSyncExternalStore(
    (cb) => {
      subscribers.add(cb);
      return () => subscribers.delete(cb);
    },
    () => count,
    () => siteConfig.listenersBase,
  );
}