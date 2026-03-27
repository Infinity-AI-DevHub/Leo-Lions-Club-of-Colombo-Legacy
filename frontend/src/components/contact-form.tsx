'use client';

import { FormEvent, useState } from 'react';
import { API_BASE_URL } from '@/lib/config';
import { trackMotivationEvent } from '@/lib/motivation-client';

export function ContactForm() {
  const [status, setStatus] = useState<string>('');
  const [sending, setSending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setStatus('Sending...');
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);

    const response = await fetch(`${API_BASE_URL}/public/contact-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
      }),
    });

    setStatus(response.ok ? 'Message sent successfully.' : 'Unable to send message.');
    setSending(false);
    if (response.ok) {
      trackMotivationEvent('contact_submit', window.location.pathname, 'contact_form_submit');
      formEl.reset();
    }
  }

  return (
    <form className="mt-3 space-y-3" onSubmit={onSubmit}>
      <input
        name="name"
        required
        placeholder="Full name"
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500"
      />
      <input
        name="email"
        required
        type="email"
        placeholder="Email address"
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500"
      />
      <input
        name="phone"
        placeholder="Phone number"
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500"
      />
      <input
        name="subject"
        placeholder="Subject"
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500"
      />
      <textarea
        name="message"
        required
        placeholder="Your message"
        rows={4}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500"
      />
      <button
        type="submit"
        disabled={sending}
        className="button-pop rounded-xl bg-gradient-to-r from-sky-700 to-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {sending ? 'Sending...' : 'Submit'}
      </button>
      {status ? <p className="text-sm text-slate-600">{status}</p> : null}
    </form>
  );
}
