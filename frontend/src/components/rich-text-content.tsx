import { Fragment, ReactNode } from 'react';

type RichTextContentProps = {
  text?: string | null;
  className?: string;
  paragraphClassName?: string;
};

function renderInline(text: string): ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return tokens.map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return <strong key={`b-${index}`}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      return <em key={`i-${index}`}>{token.slice(1, -1)}</em>;
    }
    return <Fragment key={`t-${index}`}>{token}</Fragment>;
  });
}

export function RichTextContent({
  text,
  className,
  paragraphClassName = 'text-slate-700',
}: RichTextContentProps) {
  const value = String(text || '').replace(/\r\n/g, '\n');
  if (!value.trim()) return null;
  const lines = value.split('\n');
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const isQuote = line.trim().startsWith('>');
    if (isQuote) {
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith('>')) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ''));
        index += 1;
      }
      blocks.push(
        <blockquote
          key={`q-${index}`}
          className="border-l-4 border-sky-300/90 bg-sky-50/80 px-3 py-2 italic text-slate-700"
        >
          {quoteLines.map((quoteLine, quoteIndex) => (
            <p key={`ql-${quoteIndex}`} className={quoteIndex === 0 ? '' : 'mt-1'}>
              {renderInline(quoteLine)}
            </p>
          ))}
        </blockquote>,
      );
      continue;
    }

    if (!line.trim()) {
      index += 1;
      continue;
    }

    blocks.push(
      <p key={`p-${index}`} className={paragraphClassName}>
        {renderInline(line)}
      </p>,
    );
    index += 1;
  }

  return <div className={className || 'space-y-2'}>{blocks}</div>;
}
