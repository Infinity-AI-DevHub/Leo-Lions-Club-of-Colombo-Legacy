'use client';

import { useEffect, useMemo, useState } from 'react';

function extractNumber(input: string) {
  const match = input.match(/\d[\d,]*/);
  if (!match) return { value: 0, prefix: input, suffix: '' };
  const raw = match[0];
  const numeric = Number(raw.replaceAll(',', ''));
  const idx = input.indexOf(raw);
  return {
    value: Number.isFinite(numeric) ? numeric : 0,
    prefix: input.slice(0, idx),
    suffix: input.slice(idx + raw.length),
  };
}

export function CountUp({ value }: { value: string }) {
  const parsed = useMemo(() => extractNumber(value), [value]);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parsed.value;
    if (end <= 0) {
      setDisplay(0);
      return;
    }
    const durationMs = 1200;
    const step = Math.max(1, Math.floor(end / 50));
    const interval = window.setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        window.clearInterval(interval);
      } else {
        setDisplay(start);
      }
    }, durationMs / 50);
    return () => window.clearInterval(interval);
  }, [parsed.value]);

  return (
    <span>
      {parsed.prefix}
      {display.toLocaleString()}
      {parsed.suffix}
    </span>
  );
}
