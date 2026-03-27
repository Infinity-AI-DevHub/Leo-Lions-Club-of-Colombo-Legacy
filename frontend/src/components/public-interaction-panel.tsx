'use client';

import { FormEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Copy, MessageCircle, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import {
  getInteractionSummary,
  getInteractionVisitorToken,
  InteractionTargetType,
  submitComment,
  submitReaction,
  submitShare,
} from '@/lib/interactions-client';

type CommentItem = {
  id: number;
  authorName: string;
  comment: string;
  createdAt: string;
};

type Summary = {
  likes: number;
  dislikes: number;
  shares: number;
  commentsCount: number;
  viewerReaction: 'LIKE' | 'DISLIKE' | null;
  comments: CommentItem[];
};

function XIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2H21.5l-7.11 8.128L22.75 22h-6.54l-5.12-6.71L5.22 22H1.96l7.61-8.7L1.5 2h6.7l4.63 6.13L18.244 2Zm-1.15 18h1.81L7.22 3.9H5.28L17.094 20Z" />
    </svg>
  );
}

function FacebookIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M13.5 8.5V6.7c0-.8.5-1.2 1.3-1.2H16V2.2h-2.1c-2.6 0-4.4 1.7-4.4 4.4v1.9H7v3.2h2.5V22h4V11.7H16l.4-3.2h-2.9Z" />
    </svg>
  );
}

function WhatsAppIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M20.52 3.48A11.9 11.9 0 0 0 12.06.02C5.54.02.22 5.34.22 11.86c0 2.09.55 4.13 1.6 5.93L.02 24l6.4-1.67a11.8 11.8 0 0 0 5.64 1.44h.01c6.52 0 11.84-5.32 11.84-11.84 0-3.16-1.23-6.13-3.39-8.45ZM12.07 21.7c-1.8 0-3.56-.48-5.1-1.39l-.37-.22-3.8 1 1.02-3.7-.24-.38a9.73 9.73 0 0 1-1.5-5.15c0-5.4 4.39-9.79 9.79-9.79 2.62 0 5.08 1.02 6.93 2.88a9.72 9.72 0 0 1 2.86 6.92c0 5.4-4.39 9.79-9.79 9.79Zm5.37-7.34c-.29-.15-1.72-.85-1.98-.95-.26-.1-.45-.15-.65.15-.19.29-.75.95-.92 1.15-.17.2-.34.22-.63.07-.29-.15-1.2-.44-2.29-1.4-.84-.75-1.41-1.68-1.58-1.96-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.65-1.56-.89-2.13-.24-.57-.48-.49-.65-.49h-.56c-.2 0-.51.07-.78.37-.26.29-1 1-1 2.44s1.03 2.83 1.17 3.02c.15.2 2.03 3.11 4.93 4.36.69.3 1.23.49 1.65.63.69.22 1.32.19 1.82.11.55-.08 1.72-.7 1.96-1.37.24-.67.24-1.24.17-1.37-.07-.12-.27-.19-.56-.34Z" />
    </svg>
  );
}

function TelegramIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M9.78 15.4 9.4 20.7c.54 0 .78-.23 1.06-.5l2.55-2.43 5.28 3.86c.97.53 1.65.25 1.9-.9l3.45-16.16h.01c.29-1.36-.49-1.89-1.43-1.54L1.93 10.8c-1.33.52-1.31 1.26-.22 1.6l5.2 1.62L19 6.42c.57-.35 1.09-.16.66.2" />
    </svg>
  );
}

function InstagramIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm-.2 2A3.55 3.55 0 0 0 4 7.55v8.9A3.55 3.55 0 0 0 7.55 20h8.9A3.55 3.55 0 0 0 20 16.45v-8.9A3.55 3.55 0 0 0 16.45 4h-8.9Zm9.65 1.6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

export function PublicInteractionPanel({
  targetType,
  targetId,
  compact = false,
  mode = 'full',
  shareUrl,
  shareTitle,
  shareImageUrl,
}: {
  targetType: InteractionTargetType;
  targetId: number;
  compact?: boolean;
  mode?: 'full' | 'counts' | 'reactions';
  shareUrl?: string;
  shareTitle?: string;
  shareImageUrl?: string;
}) {
  const [visitorToken, setVisitorToken] = useState<string>('');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [shareNotice, setShareNotice] = useState('');
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  async function loadImage(src: string) {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = src;
    });
  }

  async function buildShareImageFile(title: string, url: string, imageUrl?: string) {
    const size = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');

    if (imageUrl) {
      try {
        const image = await loadImage(imageUrl);
        const scale = Math.max(size / image.width, size / image.height);
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;
        const dx = (size - drawWidth) / 2;
        const dy = (size - drawHeight) / 2;
        ctx.drawImage(image, dx, dy, drawWidth, drawHeight);
      } catch {
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, '#0b1f3d');
        gradient.addColorStop(0.55, '#124a84');
        gradient.addColorStop(1, '#0e7490');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
      }
    } else {
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#0b1f3d');
      gradient.addColorStop(0.55, '#124a84');
      gradient.addColorStop(1, '#0e7490');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }

    const overlay = ctx.createLinearGradient(0, 0, size, size);
    overlay.addColorStop(0, 'rgba(6,18,38,0.72)');
    overlay.addColorStop(0.5, 'rgba(9,40,78,0.58)');
    overlay.addColorStop(1, 'rgba(7,23,44,0.75)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.arc(900, 180, 220, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(170, 890, 190, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e2f2ff';
    ctx.font = '700 34px sans-serif';
    ctx.fillText('LEO LIONS CLUB OF COLOMBO LEGACY', 88, 120);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 78px sans-serif';
    const words = title.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > 900) {
        if (line) lines.push(line);
        line = word;
      } else {
        line = test;
      }
      if (lines.length >= 4) break;
    }
    if (line && lines.length < 4) lines.push(line);
    let y = 280;
    for (const part of lines) {
      ctx.fillText(part, 88, y);
      y += 96;
    }

    ctx.fillStyle = '#c8e7ff';
    ctx.font = '500 36px sans-serif';
    ctx.fillText('Empower You! Lead. Serve. Inspire.', 88, 820);

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '500 30px sans-serif';
    const shortUrl = url.replace(/^https?:\/\//, '');
    ctx.fillText(shortUrl.length > 52 ? `${shortUrl.slice(0, 52)}...` : shortUrl, 88, 890);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((file) => {
        if (!file) {
          reject(new Error('Failed to generate image'));
          return;
        }
        resolve(file);
      }, 'image/png');
    });

    return new File([blob], `leo-lions-share-${Date.now()}.png`, {
      type: 'image/png',
      lastModified: Date.now(),
    });
  }

  async function recordShare() {
    if (!visitorToken) return;
    const updated = await submitShare(targetType, targetId, visitorToken);
    setSummary(updated);
  }

  const load = useCallback(async (token: string) => {
    setLoading(true);
    try {
      const data = await getInteractionSummary(targetType, targetId, token);
      setSummary(data);
    } catch {
      setError('Failed to load reactions/comments.');
    } finally {
      setLoading(false);
    }
  }, [targetId, targetType]);

  useEffect(() => {
    const token = getInteractionVisitorToken();
    setVisitorToken(token);
    void load(token);
  }, [load]);

  async function onReact(type: 'LIKE' | 'DISLIKE') {
    if (!visitorToken) return;
    setSending(true);
    setError('');
    try {
      const data = await submitReaction(targetType, targetId, type, visitorToken);
      setSummary(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to react right now.');
    } finally {
      setSending(false);
    }
  }

  async function onCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!visitorToken || !comment.trim()) return;
    setSending(true);
    setError('');
    try {
      const data = await submitComment(targetType, targetId, {
        visitorToken,
        authorName: authorName.trim() || 'Guest',
        comment: comment.trim(),
      });
      setSummary(data);
      setComment('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to add comment right now.');
    } finally {
      setSending(false);
    }
  }

  async function onShare(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setError('');
    setShareNotice('');
    try {
      const current = window.location.href;
      const resolvedUrl = shareUrl ? new URL(shareUrl, window.location.origin).toString() : current;
      const title = shareTitle || document.title || 'Leo Lions Club of Colombo Legacy';
      const text = `${title} | Leo Lions Club of Colombo Legacy`;
      const shareImage = await buildShareImageFile(title, resolvedUrl, shareImageUrl).catch(() => null);
      if (navigator.share) {
        try {
          if (
            shareImage &&
            'canShare' in navigator &&
            typeof navigator.canShare === 'function' &&
            navigator.canShare({ files: [shareImage] })
          ) {
            await navigator.share({ title, text, url: resolvedUrl, files: [shareImage] });
          } else {
            await navigator.share({ title, text, url: resolvedUrl });
          }
          await recordShare();
          setShareNotice('Shared.');
          setShareMenuOpen(false);
          return;
        } catch {
          // Fall through to menu options.
        }
      }
      setShareMenuOpen((prev) => !prev);
    } catch {
      setError('Unable to share right now.');
    }
  }

  async function onShareChannel(channel: 'x' | 'facebook' | 'whatsapp' | 'telegram' | 'instagram' | 'copy') {
    setError('');
    setShareNotice('');
    const current = window.location.href;
    const resolvedUrl = shareUrl ? new URL(shareUrl, window.location.origin).toString() : current;
    const title = shareTitle || document.title || 'Leo Lions Club of Colombo Legacy';
    const text = `${title} | Leo Lions Club of Colombo Legacy`;
    const appLabel =
      channel === 'x'
        ? 'X'
        : channel === 'facebook'
          ? 'Facebook'
          : channel === 'whatsapp'
            ? 'WhatsApp'
            : channel === 'telegram'
              ? 'Telegram'
              : channel === 'instagram'
                ? 'Instagram'
                : 'other apps';

    try {
      if (channel === 'copy') {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(resolvedUrl);
        } else {
          window.prompt('Copy this link:', resolvedUrl);
        }
        await recordShare();
        setShareNotice('Link copied.');
      } else {
        const file = await buildShareImageFile(title, resolvedUrl, shareImageUrl);
        const canShareFiles =
          'canShare' in navigator &&
          typeof navigator.canShare === 'function' &&
          navigator.canShare({ files: [file] });
        if (navigator.share && canShareFiles) {
          try {
            await navigator.share({
              title,
              text,
              url: resolvedUrl,
              files: [file],
            });
            await recordShare();
            setShareNotice(`Shared image. Select ${appLabel} in your share sheet.`);
          } catch {
            const local = URL.createObjectURL(file);
            const anchor = document.createElement('a');
            anchor.href = local;
            anchor.download = file.name;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(local);
            await recordShare();
            setShareNotice(`Image downloaded. Upload it on ${appLabel}.`);
          }
        } else {
          const local = URL.createObjectURL(file);
          const anchor = document.createElement('a');
          anchor.href = local;
          anchor.download = file.name;
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
          URL.revokeObjectURL(local);
          await recordShare();
          setShareNotice(`Image downloaded. Upload it on ${appLabel}.`);
        }
      }
      setShareMenuOpen(false);
    } catch {
      setError('Unable to complete share action.');
    }
  }

  const countsOnly = mode === 'counts';
  const reactionsOnly = mode === 'reactions';

  return (
    <div className={clsx('rounded-2xl border border-slate-200 bg-white/85', compact ? 'p-2.5' : 'p-4')}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={sending || loading}
          onClick={() => onReact('LIKE')}
          className={clsx(
            'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition',
            summary?.viewerReaction === 'LIKE'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
              : 'border-slate-300 bg-white text-slate-700 hover:border-sky-300',
          )}
        >
          <ThumbsUp size={13} />
          {summary?.likes ?? 0}
        </button>
        <button
          type="button"
          disabled={sending || loading}
          onClick={() => onReact('DISLIKE')}
          className={clsx(
            'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition',
            summary?.viewerReaction === 'DISLIKE'
              ? 'border-rose-300 bg-rose-50 text-rose-700'
              : 'border-slate-300 bg-white text-slate-700 hover:border-sky-300',
          )}
        >
          <ThumbsDown size={13} />
          {summary?.dislikes ?? 0}
        </button>
        {!reactionsOnly ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            <MessageCircle size={13} />
            {summary?.commentsCount ?? 0} comments
          </span>
        ) : null}
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-sky-300"
        >
          <Share2 size={13} />
          Share {summary?.shares ?? 0}
        </button>
      </div>

      {!countsOnly && !reactionsOnly ? (
        <form className="mt-3 space-y-2" onSubmit={onCommentSubmit}>
          <div className="grid gap-2 sm:grid-cols-[180px_1fr]">
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name (optional)"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500"
            />
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500"
            />
          </div>
          <button
            type="submit"
            disabled={sending || !comment.trim()}
            className="rounded-lg bg-gradient-to-r from-sky-700 to-blue-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            {sending ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : null}

      {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
      {shareNotice ? <p className="mt-2 text-xs text-emerald-700">{shareNotice}</p> : null}

      {shareMenuOpen ? (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2">
          <div className="grid grid-cols-6 gap-2">
            <button
              type="button"
              title="Share to X"
              aria-label="Share to X"
              onClick={() => onShareChannel('x')}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-slate-300 bg-white font-bold text-slate-800"
            >
              <XIcon />
            </button>
            <button
              type="button"
              title="Share to Facebook"
              aria-label="Share to Facebook"
              onClick={() => onShareChannel('facebook')}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-slate-300 bg-white font-bold text-blue-700"
            >
              <FacebookIcon />
            </button>
            <button
              type="button"
              title="Share to WhatsApp"
              aria-label="Share to WhatsApp"
              onClick={() => onShareChannel('whatsapp')}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-slate-300 bg-white font-bold text-emerald-700"
            >
              <WhatsAppIcon />
            </button>
            <button
              type="button"
              title="Share to Telegram"
              aria-label="Share to Telegram"
              onClick={() => onShareChannel('telegram')}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-slate-300 bg-white font-bold text-sky-700"
            >
              <TelegramIcon />
            </button>
            <button
              type="button"
              title="Share to Instagram"
              aria-label="Share to Instagram"
              onClick={() => onShareChannel('instagram')}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-slate-300 bg-white font-bold text-fuchsia-700"
            >
              <InstagramIcon />
            </button>
            <button
              type="button"
              title="Copy link"
              aria-label="Copy link"
              onClick={() => onShareChannel('copy')}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-slate-300 bg-white"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>
      ) : null}

      {!countsOnly && !reactionsOnly ? (
        <div className="mt-3 space-y-2">
          {(summary?.comments || []).slice(0, compact ? 3 : 6).map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs font-semibold text-slate-700">{item.authorName || 'Guest'}</p>
              <p className="mt-1 text-sm text-slate-700">{item.comment}</p>
              <p className="mt-1 text-[11px] text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
          ))}
          {loading ? <p className="text-xs text-slate-500">Loading reactions and comments...</p> : null}
        </div>
      ) : null}
    </div>
  );
}
