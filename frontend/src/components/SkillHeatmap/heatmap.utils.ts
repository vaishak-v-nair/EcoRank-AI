import type { HeatmapCell } from '../../types/candidate.types';

export interface HeatmapGroup {
  category: string;
  skills: HeatmapCell[];
}

export function proficiencyToColor(value: number): string {
  const normalized = Math.max(0, Math.min(5, value));
  const hue = 8 + (normalized / 5) * 120;
  const saturation = 76;
  const lightness = 92 - normalized * 6;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function groupHeatmapByCategory(cells: HeatmapCell[]): HeatmapGroup[] {
  const groups = new Map<string, HeatmapCell[]>();

  cells.forEach((cell) => {
    const bucket = groups.get(cell.category) || [];
    bucket.push(cell);
    groups.set(cell.category, bucket);
  });

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, skills]) => ({
      category,
      skills: [...skills].sort((left, right) => right.avg_proficiency - left.avg_proficiency)
    }));
}