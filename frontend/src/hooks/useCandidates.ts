import { useCallback, useEffect, useState } from 'react';
import { candidateService } from '../services/candidateService';
import type {
  CandidateDetailResponse,
  DashboardResponse,
  LeaderboardEntry
} from '../types/candidate.types';

interface HookState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const initialState = <T,>(): HookState<T> => ({
  data: null,
  loading: true,
  error: null
});

export function useDashboardData() {
  const [state, setState] = useState<HookState<DashboardResponse>>(initialState);

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await candidateService.getDashboard();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to load dashboard'
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}

export function useCandidateDetail(candidateId: number | null) {
  const [state, setState] = useState<HookState<CandidateDetailResponse>>(initialState);

  const refresh = useCallback(async () => {
    if (!candidateId) {
      setState({ data: null, loading: false, error: 'Invalid candidate id' });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await candidateService.getCandidateDetail(candidateId);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to load candidate details'
      });
    }
  }, [candidateId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}

export function useLeaderboard(limit = 10) {
  const [state, setState] = useState<HookState<LeaderboardEntry[]>>(initialState);

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await candidateService.getLeaderboard(limit);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to load leaderboard'
      });
    }
  }, [limit]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}