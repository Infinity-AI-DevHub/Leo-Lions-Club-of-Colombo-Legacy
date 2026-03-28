import { ReactNode } from 'react';
import { Reveal } from './motion/reveal';
import { RichTextContent } from './rich-text-content';

export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-16">
      <Reveal>
        <h2 className="text-2xl font-bold text-slate-900 md:text-4xl">{title}</h2>
        {subtitle ? (
          <RichTextContent
            text={subtitle}
            className="mt-3 max-w-3xl space-y-2 md:text-lg"
            paragraphClassName="text-slate-600"
          />
        ) : null}
      </Reveal>
      <Reveal className="mt-6">{children}</Reveal>
    </section>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return <div className="card-hover glass-panel rounded-2xl p-5">{children}</div>;
}
