'use client';

import { API_BASE_URL } from './config';

export type PollResults = {
  pollId: number;
  status: 'PUBLISHED' | 'CLOSED' | 'DRAFT';
  totalVotes: number;
  selectedOptionIndex: number | null;
  options: Array<{ index: number; label: string; votes: number; percentage: number }>;
};

export async function getPollResults(pollId: number, visitorToken: string) {
  const query = new URLSearchParams();
  if (visitorToken) query.set('visitorToken', visitorToken);
  const response = await fetch(`${API_BASE_URL}/public/polls/${pollId}/results?${query.toString()}`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Failed to load poll results');
  return (await response.json()) as PollResults;
}

export async function voteOnPoll(pollId: number, visitorToken: string, optionIndex: number) {
  const response = await fetch(`${API_BASE_URL}/public/polls/${pollId}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorToken, optionIndex }),
  });
  if (!response.ok) throw new Error('Failed to vote');
  return (await response.json()) as PollResults;
}

export async function undoPollVote(pollId: number, visitorToken: string) {
  const response = await fetch(`${API_BASE_URL}/public/polls/${pollId}/unvote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorToken }),
  });
  if (!response.ok) throw new Error('Failed to undo vote');
  return (await response.json()) as PollResults;
}
