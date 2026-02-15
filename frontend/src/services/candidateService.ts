import type {
  Candidate,
  CandidateDetailResponse,
  DashboardResponse,
  EvaluationRecord,
  HeatmapCell,
  LeaderboardEntry
} from '../types/candidate.types';
import { apiGet, apiPost } from './api';

export const candidateService = {
  getDashboard(): Promise<DashboardResponse> {
    return apiGet<DashboardResponse>('/dashboard');
  },

  getCandidates(limit = 40, offset = 0): Promise<Candidate[]> {
    return apiGet<Candidate[]>(`/candidates?limit=${limit}&offset=${offset}`);
  },

  getCandidateDetail(candidateId: number): Promise<CandidateDetailResponse> {
    return apiGet<CandidateDetailResponse>(`/candidates/${candidateId}`);
  },

  getLeaderboard(
    limit = 10,
    sortBy = 'rank',
    direction: 'asc' | 'desc' = 'asc'
  ): Promise<LeaderboardEntry[]> {
    return apiGet<LeaderboardEntry[]>(
      `/leaderboard?limit=${limit}&sortBy=${sortBy}&direction=${direction}`
    );
  },

  getHeatmap(top = 10): Promise<HeatmapCell[]> {
    return apiGet<HeatmapCell[]>(`/heatmap?top=${top}`);
  },

  getEvaluations(candidateId: number, limit = 10): Promise<EvaluationRecord[]> {
    return apiGet<EvaluationRecord[]>(`/candidates/${candidateId}/evaluations?limit=${limit}`);
  },

  evaluateCandidate(
    candidateId: number,
    provider: 'mock' | 'openai' = 'mock',
    evaluatorVersion = 'v1'
  ): Promise<{ candidate_id: number; evaluation: EvaluationRecord }> {
    return apiPost<{ candidate_id: number; evaluation: EvaluationRecord }>(
      `/candidates/${candidateId}/evaluate`,
      { provider, evaluatorVersion }
    );
  }
};