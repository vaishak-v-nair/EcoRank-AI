export interface CandidateSkill {
  id: number;
  skill_name: string;
  category: 'Operations' | 'Leadership' | 'Compliance' | 'Sustainability' | 'Safety' | 'Analytics';
  proficiency: number;
}

export interface LatestEvaluation {
  evaluation_id: number;
  evaluator_version: string;
  crisis_score: number;
  sustainability_score: number;
  motivation_score: number;
  overall_score: number;
  evaluated_at: string;
  rank_position: number | null;
}

export interface Candidate {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  location_city: string;
  location_state: string;
  location_country: string;
  years_experience: number;
  highest_education: string;
  current_role: string;
  industry_focus: string;
  profile_summary: string;
  skills_json: Array<{ name: string; category: string; proficiency: number }>;
  latest_evaluation: LatestEvaluation | null;
}

export interface CandidateProfile extends Candidate {
  skills: CandidateSkill[];
}

export interface EvaluationRecord {
  id: number;
  candidate_id: number;
  evaluator_version: string;
  crisis_score: number;
  sustainability_score: number;
  motivation_score: number;
  overall_score: number;
  justification_json: {
    provider?: string;
    confidence?: number;
    evidence?: Record<string, string[]>;
    dimensions?: Record<string, string>;
  };
  evaluated_at: string;
}

export interface CandidateDetailResponse {
  candidate: CandidateProfile;
  evaluations: EvaluationRecord[];
}

export interface LeaderboardEntry {
  candidate_id: number;
  full_name: string;
  current_role: string;
  location_city: string;
  location_state: string;
  years_experience: number;
  crisis_score: number;
  sustainability_score: number;
  motivation_score: number;
  overall_score: number;
  evaluator_version: string;
  evaluated_at: string;
  rank_position: number;
}

export interface HeatmapCell {
  skill_name: string;
  category: string;
  avg_proficiency: number;
  candidate_count: number;
}

export interface DashboardResponse {
  leaderboard: LeaderboardEntry[];
  heatmap: HeatmapCell[];
  candidates: Candidate[];
}