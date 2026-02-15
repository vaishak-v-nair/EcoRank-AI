import { Alert, Badge, Button, Grid, Group, Loader, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconRefresh, IconSparkles } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { CandidateCard } from '../components/CandidateCard/CandidateCard';
import { LeaderboardTable } from '../components/Leaderboard/LeaderboardTable';
import { SkillHeatmap } from '../components/SkillHeatmap/SkillHeatmap';
import { useDashboardData } from '../hooks/useCandidates';
import { averageScore, topPerformerRate } from '../utils/scoreHelpers';

export function Dashboard() {
  const navigate = useNavigate();
  const { data, loading, error, refresh } = useDashboardData();

  if (loading) {
    return (
      <Group justify="center" py="xl">
        <Loader size="lg" />
      </Group>
    );
  }

  if (error || !data) {
    return (
      <Stack>
        <Alert color="red" title="Unable to load dashboard" radius="lg">
          {error || 'No data available'}
        </Alert>
        <Button onClick={() => void refresh()} variant="outline" leftSection={<IconRefresh size={16} />}>
          Retry
        </Button>
      </Stack>
    );
  }

  const top10Scores = data.leaderboard.map((row) => row.overall_score);
  const averageTop10 = averageScore(top10Scores);
  const eliteRate = topPerformerRate(top10Scores, 85);
  const evaluatedCount = data.candidates.filter((candidate) => candidate.latest_evaluation !== null).length;

  return (
    <Stack gap="lg">
      <Paper
        withBorder
        radius="lg"
        p="lg"
        style={{
          borderColor: '#dbe7e1',
          background:
            'linear-gradient(135deg, rgba(45, 154, 102, 0.12), rgba(250, 145, 45, 0.14)), rgba(255,255,255,0.86)'
        }}
      >
        <Group justify="space-between" align="end">
          <div>
            <Group gap="xs" mb={6}>
              <Badge color="forest" variant="filled">
                EcoRank Scoring Console
              </Badge>
              <Badge color="copper" variant="light">
                Updated Live
              </Badge>
            </Group>
            <Title order={2}>Selection Dashboard</Title>
            <Text c="dimmed" size="sm">
              Rank leaders across crisis response, sustainability fluency, and team motivation impact.
            </Text>
          </div>
          <Button variant="filled" color="forest" leftSection={<IconRefresh size={16} />} onClick={() => void refresh()}>
            Refresh
          </Button>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <Paper withBorder radius="lg" p="md" className="metric-chip stagger-pop">
          <Text size="xs" c="dimmed" tt="uppercase">
            Top-10 Avg Score
          </Text>
          <Title order={3}>{averageTop10.toFixed(1)}</Title>
        </Paper>
        <Paper withBorder radius="lg" p="md" className="metric-chip stagger-pop">
          <Text size="xs" c="dimmed" tt="uppercase">
            Elite Performer Rate
          </Text>
          <Title order={3}>{eliteRate.toFixed(1)}%</Title>
        </Paper>
        <Paper withBorder radius="lg" p="md" className="metric-chip stagger-pop">
          <Text size="xs" c="dimmed" tt="uppercase">
            Evaluated Candidates
          </Text>
          <Title order={3}>
            {evaluatedCount}/{data.candidates.length}
          </Title>
        </Paper>
        <Paper withBorder radius="lg" p="md" className="metric-chip stagger-pop">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase">
                AI Weighting Model
              </Text>
              <Text fw={700}>40 / 35 / 25</Text>
            </div>
            <IconSparkles size={22} color="#1f7a50" />
          </Group>
        </Paper>
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <LeaderboardTable
            entries={data.leaderboard}
            onRowClick={(candidateId) => navigate(`/candidate/${candidateId}`)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <SkillHeatmap cells={data.heatmap} />
        </Grid.Col>
      </Grid>

      <Stack gap="sm">
        <Title order={3}>Candidate Cards</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {data.candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onOpenProfile={(candidateId) => navigate(`/candidate/${candidateId}`)}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
