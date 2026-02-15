import { Badge, Group, Paper, Progress, SimpleGrid, Stack, Text } from '@mantine/core';
import type { HeatmapCell } from '../../types/candidate.types';
import { groupHeatmapByCategory, proficiencyToColor } from './heatmap.utils';

interface SkillHeatmapProps {
  cells: HeatmapCell[];
}

export function SkillHeatmap({ cells }: SkillHeatmapProps) {
  const grouped = groupHeatmapByCategory(cells);

  return (
    <Paper
      withBorder
      radius="lg"
      p="md"
      style={{
        borderColor: '#dbe7e1',
        boxShadow: '0 10px 28px rgba(18, 50, 40, 0.08)'
      }}
    >
      <Group justify="space-between" mb="sm">
        <Text fw={700}>Skill Heatmap</Text>
        <Text size="sm" c="dimmed">
          Top 10 ranked candidates
        </Text>
      </Group>

      <Stack gap="md">
        {grouped.map((group) => (
          <Stack key={group.category} gap={6}>
            <Group justify="space-between" align="center">
              <Text fw={700} size="sm">
                {group.category}
              </Text>
              <Badge color="forest" variant="light">
                {group.skills.length} skills
              </Badge>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              {group.skills.map((cell) => (
                <Paper
                  key={`${group.category}-${cell.skill_name}`}
                  p="sm"
                  radius="sm"
                  withBorder
                  style={{
                    background: proficiencyToColor(cell.avg_proficiency),
                    borderColor: 'rgba(20, 91, 59, 0.15)'
                  }}
                >
                  <Text size="sm" fw={600}>
                    {cell.skill_name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Avg proficiency: {cell.avg_proficiency.toFixed(2)} / 5
                  </Text>
                  <Progress
                    value={(cell.avg_proficiency / 5) * 100}
                    mt={8}
                    radius="xl"
                    size="sm"
                    color="forest"
                  />
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
