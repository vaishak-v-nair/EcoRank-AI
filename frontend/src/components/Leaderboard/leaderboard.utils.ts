import type { LeaderboardEntry } from '../../types/candidate.types';

export type LeaderboardSortField =
  | 'rank_position'
  | 'overall_score'
  | 'crisis_score'
  | 'sustainability_score'
  | 'motivation_score'
  | 'years_experience'
  | 'full_name';

export type SortDirection = 'asc' | 'desc';

export function sortLeaderboard(
  entries: LeaderboardEntry[],
  field: LeaderboardSortField,
  direction: SortDirection
): LeaderboardEntry[] {
  const sorted = [...entries].sort((a, b) => {
    const left = a[field as keyof LeaderboardEntry];
    const right = b[field as keyof LeaderboardEntry];

    if (typeof left === 'number' && typeof right === 'number') {
      return left - right;
    }

    return String(left).localeCompare(String(right));
  });

  return direction === 'asc' ? sorted : sorted.reverse();
}

export function nextSortDirection(
  currentField: LeaderboardSortField,
  currentDirection: SortDirection,
  incomingField: LeaderboardSortField
): SortDirection {
  if (incomingField !== currentField) {
    return incomingField === 'rank_position' ? 'asc' : 'desc';
  }

  return currentDirection === 'asc' ? 'desc' : 'asc';
}