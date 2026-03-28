'use client';

import { useRef } from 'react';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
};

export function RichTextEditor({ value, onChange, rows = 6, className }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function wrapSelection(prefix: string, suffix = prefix, fallback = '') {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? start;
    const selected = value.slice(start, end);
    const content = selected || fallback;
    const replacement = `${prefix}${content}${suffix}`;
    const next = `${value.slice(0, start)}${replacement}${value.slice(end)}`;
    onChange(next);

    requestAnimationFrame(() => {
      textarea.focus();
      if (selected) {
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      } else {
        const caret = start + replacement.length;
        textarea.setSelectionRange(caret, caret);
      }
    });
  }

  function quoteSelection() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? start;
    const selected = value.slice(start, end) || 'Quoted text';
    const quoted = selected
      .split('\n')
      .map((line) => (line.trim().startsWith('>') ? line : `> ${line}`))
      .join('\n');
    const next = `${value.slice(0, start)}${quoted}${value.slice(end)}`;
    onChange(next);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + quoted.length);
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => wrapSelection('**', '**', 'bold text')}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => wrapSelection('*', '*', 'italic text')}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          Italic
        </button>
        <button
          type="button"
          onClick={quoteSelection}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          Quote
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className={className}
      />
    </div>
  );
}
