"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function readClock() {
  const parts = formatter.formatToParts(new Date());
  const hour = parts.find((p) => p.type === "hour")?.value ?? "--";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "--";
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value ?? "";
  return `${hour}:${minute}:${dayPeriod}`;
}

let cached: string | null = null;

function getSnapshot() {
  const current = readClock();
  if (cached !== current) cached = current;
  return cached;
}

function subscribe(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

function useClock() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export function Clock() {
  const raw = useClock();
  const [hour, minute, dayPeriod] = (raw ?? "::").split(":");

  return (
    <p className="font-mono text-sm tabular-nums tracking-wide text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
      {hour}
      <span className="colon-blink">:</span>
      {minute}
      <span className="ml-1 uppercase text-white/60">{dayPeriod}</span>
    </p>
  );
}