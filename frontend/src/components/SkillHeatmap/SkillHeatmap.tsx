import { Group, Paper, Stack, Table, Text, Tooltip } from '@mantine/core';
import type { LeaderboardEntry } from '../../types/candidate.types';

interface SkillHeatmapProps {
  entries: LeaderboardEntry[];
}

function scoreToColor(score: number): string {
  if (score >= 90) return 'rgba(70, 137, 95, 0.88)';
  if (score >= 80) return 'rgba(83, 155, 111, 0.72)';
  if (score >= 70) return 'rgba(131, 148, 167, 0.62)';
  if (score >= 60) return 'rgba(163, 174, 184, 0.52)';
  return 'rgba(194, 164, 145, 0.45)';
}

function textColor(score: number): string {
  return score >= 80 ? '#f5fbf8' : '#1f2c35';
}

function Cell({ label, score }: { label: string; score: number }) {
  return (
    <Tooltip label={`${label}: ${score}/100`} withArrow position="top">
      <div
        style={{
          width: '100%',
          borderRadius: 12,
          padding: '8px 10px',
          textAlign: 'center',
          background: scoreToColor(score),
          color: textColor(score),
          fontWeight: 700
        }}
      >
        {score}
      </div>
    </Tooltip>
  );
}

export function SkillHeatmap({ entries }: SkillHeatmapProps) {
  return (
    <Paper withBorder radius="lg" p="md" className="hover-card surface-panel">
      <Group justify="space-between" mb="sm">
        <Text fw={800}>Skill & Evaluation Heatmap</Text>
        <Text size="xs" c="dimmed">
          Crisis, Sustainability, Motivation
        </Text>
      </Group>

      <Stack>
        <Table verticalSpacing="xs" horizontalSpacing="xs" withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Candidate</Table.Th>
              <Table.Th>Crisis</Table.Th>
              <Table.Th>Sustainability</Table.Th>
              <Table.Th>Motivation</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {entries.slice(0, 10).map((entry) => (
              <Table.Tr key={entry.candidate_id}>
                <Table.Td>
                  <Text size="sm" fw={600}>
                    {entry.full_name}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Cell label="Crisis Management" score={entry.crisis_score} />
                </Table.Td>
                <Table.Td>
                  <Cell label="Sustainability Knowledge" score={entry.sustainability_score} />
                </Table.Td>
                <Table.Td>
                  <Cell label="Team Motivation" score={entry.motivation_score} />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Paper>
  );
}
