export function calculateOverallScore(
  crisisScore: number,
  sustainabilityScore: number,
  motivationScore: number
): number {
  const weighted =
    crisisScore * 0.4 +
    sustainabilityScore * 0.35 +
    motivationScore * 0.25;

  return Number(weighted.toFixed(2));
}

export function averageScore(values: number[]): number {
  if (!values.length) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return Number((total / values.length).toFixed(1));
}

export function topPerformerRate(scores: number[], threshold = 85): number {
  if (!scores.length) {
    return 0;
  }

  const topCount = scores.filter((score) => score >= threshold).length;
  return Number(((topCount / scores.length) * 100).toFixed(1));
}

export function scoreLabel(score: number): 'Needs Development' | 'Strong' | 'Excellent' {
  if (score >= 85) {
    return 'Excellent';
  }

  if (score >= 70) {
    return 'Strong';
  }

  return 'Needs Development';
}

export function scoreColor(score: number): 'red' | 'yellow' | 'green' {
  if (score >= 85) {
    return 'green';
  }

  if (score >= 70) {
    return 'yellow';
  }

  return 'red';
}

export function formatScore(score: number): string {
  return `${Number(score).toFixed(1)} / 100`;
}
