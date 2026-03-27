'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export function SitePreloader({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timer: number | null = null;

    const hide = () => {
      timer = window.setTimeout(() => setVisible(false), 900);
    };

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide, { once: true });
    }

    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener('load', hide);
    };
  }, []);

  return (
    <>
      {visible ? (
        <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-sky-900 text-white">
          <div className="rounded-3xl border border-sky-200/25 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
            <Image
              src="/logo.png"
              alt="Leo Lions Club of Colombo Legacy"
              width={112}
              height={112}
              className="h-28 w-28 animate-pulse rounded-full border border-sky-100/30 object-cover shadow-lg"
              priority
            />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100/90">Loading Legacy</p>
          <div className="mt-3 h-1.5 w-44 overflow-hidden rounded-full bg-sky-200/20">
            <div className="h-full w-1/2 animate-[preloaderSlide_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-cyan-300 to-sky-100" />
          </div>
        </div>
      ) : null}
      {children}
    </>
  );
}
