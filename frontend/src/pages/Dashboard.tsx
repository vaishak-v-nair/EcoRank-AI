import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Code,
  List,
  Loader,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import {
  IconBolt,
  IconRefresh,
  IconRosetteDiscountCheck,
  IconSparkles,
  IconTargetArrow,
  IconTerminal2,
  IconPlugConnectedX
} from '@tabler/icons-react';
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
      <Stack gap="md">
        <Skeleton height={120} radius="lg" />
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          <Skeleton height={90} radius="lg" />
          <Skeleton height={90} radius="lg" />
          <Skeleton height={90} radius="lg" />
          <Skeleton height={90} radius="lg" />
        </SimpleGrid>
        <Group justify="center" py="lg">
          <Loader size="lg" />
        </Group>
      </Stack>
    );
  }

  if (error || !data) {
    const backendOffline = (error || '').toLowerCase().includes('cannot reach backend api');
    return (
      <Stack gap="md">
        <Paper
          withBorder
          radius="lg"
          p="lg"
          style={{
            borderColor: '#4c2b2f',
            background:
              'linear-gradient(135deg, rgba(129, 39, 56, 0.28), rgba(33, 18, 34, 0.45)), rgba(24, 20, 26, 0.9)'
          }}
        >
          <Group gap="sm" mb="xs">
            <ThemeIcon radius="xl" size="lg" color="red" variant="filled">
              <IconPlugConnectedX size={18} />
            </ThemeIcon>
            <Title order={3} c="#ffd4d8">
              Unable to load dashboard
            </Title>
          </Group>
          <Text c="#ffdfe2">{error || 'No data available'}</Text>
        </Paper>
        {backendOffline ? (
          <Paper withBorder radius="lg" p="md" style={{ borderColor: '#3f4d58', background: 'rgba(11, 24, 32, 0.72)' }}>
            <Group gap={8} mb={8}>
              <ThemeIcon size="md" radius="xl" color="graphite" variant="light">
                <IconTerminal2 size={14} />
              </ThemeIcon>
              <Text fw={700}>Local recovery steps</Text>
            </Group>
            <List spacing={6} size="sm">
              <List.Item>Start full stack from repo root: <Code>npm run dev</Code></List.Item>
              <List.Item>Or start backend only: <Code>npm run dev:backend</Code></List.Item>
              <List.Item>Open app at <Code>http://localhost:5173</Code></List.Item>
            </List>
          </Paper>
        ) : null}
        {!backendOffline ? (
          <Alert color="yellow" radius="lg">
            The API is reachable but returned an unexpected error. Retry once, then check backend logs.
          </Alert>
        ) : null}
        <Button onClick={() => void refresh()} variant="filled" color="eco" leftSection={<IconRefresh size={16} />}>
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
        className="surface-hero"
      >
        <Group justify="space-between" align="end">
          <div>
            <Group gap="xs" mb={6}>
              <Badge color="eco" variant="filled">
                EcoRank Scoring Console
              </Badge>
              <Badge color="graphite" variant="light">
                Updated Live
              </Badge>
            </Group>
            <Title order={2}>Selection Dashboard</Title>
            <Text c="dimmed" size="sm">
              Rank leaders across crisis response, sustainability fluency, and team motivation impact.
            </Text>
          </div>
          <Button variant="filled" color="eco" leftSection={<IconRefresh size={16} />} onClick={() => void refresh()}>
            Refresh
          </Button>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <Paper withBorder radius="lg" p="md" className="metric-chip stagger-pop">
          <Group justify="space-between" align="center">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase">
                Top-10 Avg Score
              </Text>
              <Title order={3}>{averageTop10.toFixed(1)}</Title>
            </div>
            <ThemeIcon size="lg" radius="xl" color="eco" variant="light">
              <IconTargetArrow size={18} />
            </ThemeIcon>
          </Group>
        </Paper>
        <Paper withBorder radius="lg" p="md" className="metric-chip stagger-pop">
          <Group justify="space-between" align="center">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase">
                Elite Performer Rate
              </Text>
              <Title order={3}>{eliteRate.toFixed(1)}%</Title>
            </div>
            <ThemeIcon size="lg" radius="xl" color="graphite" variant="light">
              <IconRosetteDiscountCheck size={18} />
            </ThemeIcon>
          </Group>
        </Paper>
        <Paper withBorder radius="lg" p="md" className="metric-chip stagger-pop">
          <Group justify="space-between" align="center">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase">
                Evaluated Candidates
              </Text>
              <Title order={3}>
                {evaluatedCount}/{data.candidates.length}
              </Title>
            </div>
            <ThemeIcon size="lg" radius="xl" color="eco" variant="light">
              <IconBolt size={18} />
            </ThemeIcon>
          </Group>
        </Paper>
        <Paper withBorder radius="lg" p="md" className="metric-chip stagger-pop">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase">
                AI Weighting Model
              </Text>
              <Text fw={700}>40 / 35 / 25</Text>
            </div>
            <IconSparkles size={22} color="#35704c" />
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
          <Stack>
            <SkillHeatmap entries={data.leaderboard} />
            <Card withBorder radius="lg" p="md" className="surface-panel-soft">
              <Group justify="space-between">
                <Text fw={700}>Scoring Weights</Text>
                <Badge color="eco" variant="light">
                  AI rubric
                </Badge>
              </Group>
              <Divider my="sm" />
              <Stack gap={8}>
                <Group justify="space-between">
                  <Text size="sm">Crisis Management</Text>
                  <Badge color="eco">40%</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Sustainability</Text>
                  <Badge color="eco">35%</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Team Motivation</Text>
                  <Badge color="eco">25%</Badge>
                </Group>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>

      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Title order={3}>Candidate Cards</Title>
          <Badge variant="light" color="eco">
            Click any card for deep profile
          </Badge>
        </Group>
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
