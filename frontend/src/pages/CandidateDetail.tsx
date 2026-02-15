import { useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Group,
  Loader,
  Paper,
  Stack,
  Table,
  Text,
  Title
} from '@mantine/core';
import { IconArrowLeft, IconPlayerPlay } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { CandidateCard } from '../components/CandidateCard/CandidateCard';
import { useCandidateDetail } from '../hooks/useCandidates';
import { candidateService } from '../services/candidateService';

export function CandidateDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const candidateId = useMemo(() => Number.parseInt(id || '', 10), [id]);
  const { data, loading, error, refresh } = useCandidateDetail(Number.isNaN(candidateId) ? null : candidateId);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);

  const triggerEvaluation = async () => {
    if (Number.isNaN(candidateId)) {
      return;
    }

    setIsEvaluating(true);
    setEvaluationError(null);

    try {
      await candidateService.evaluateCandidate(candidateId, 'mock', 'v1');
      await refresh();
    } catch (requestError) {
      setEvaluationError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to run evaluation for this candidate'
      );
    } finally {
      setIsEvaluating(false);
    }
  };

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
        <Alert color="red" title="Unable to load candidate">
          {error || 'Candidate not found'}
        </Alert>
        <Button variant="outline" onClick={() => navigate('/')} leftSection={<IconArrowLeft size={16} />}>
          Back to Dashboard
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Button variant="subtle" onClick={() => navigate('/')} leftSection={<IconArrowLeft size={16} />}>
          Back
        </Button>
        <Group>
          <Badge color="teal" variant="light">
            {data.evaluations.length} evaluations
          </Badge>
          <Button
            leftSection={<IconPlayerPlay size={16} />}
            loading={isEvaluating}
            onClick={() => void triggerEvaluation()}
          >
            Run Mock Evaluation
          </Button>
        </Group>
      </Group>

      {evaluationError ? (
        <Alert color="red" title="Evaluation failed">
          {evaluationError}
        </Alert>
      ) : null}

      <CandidateCard candidate={data.candidate} onOpenProfile={() => undefined} />

      <Paper
        withBorder
        radius="lg"
        p="md"
        style={{
          borderColor: '#dbe7e1',
          background: 'rgba(255, 255, 255, 0.93)'
        }}
      >
        <Group justify="space-between" mb="sm">
          <Title order={4}>Evaluation History</Title>
          <Badge color="forest" variant="light">
            AI evaluation timeline
          </Badge>
        </Group>

        <Table verticalSpacing="sm" horizontalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Version</Table.Th>
              <Table.Th>Crisis</Table.Th>
              <Table.Th>Sustainability</Table.Th>
              <Table.Th>Motivation</Table.Th>
              <Table.Th>Overall</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.evaluations.map((evaluation) => (
              <Table.Tr key={evaluation.id}>
                <Table.Td>{new Date(evaluation.evaluated_at).toLocaleString()}</Table.Td>
                <Table.Td>{evaluation.evaluator_version}</Table.Td>
                <Table.Td>{evaluation.crisis_score}</Table.Td>
                <Table.Td>{evaluation.sustainability_score}</Table.Td>
                <Table.Td>{evaluation.motivation_score}</Table.Td>
                <Table.Td>
                  <Text fw={700}>{evaluation.overall_score.toFixed(1)}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <Paper
        withBorder
        radius="lg"
        p="md"
        style={{
          borderColor: '#dbe7e1',
          background: 'rgba(255, 255, 255, 0.93)'
        }}
      >
        <Title order={4} mb="sm">
          Latest Justification
        </Title>
        {data.evaluations[0]?.justification_json?.dimensions ? (
          <Stack gap={8}>
            {Object.entries(data.evaluations[0].justification_json.dimensions).map(([dimension, message]) => (
              <Paper key={dimension} radius="md" p="sm" withBorder>
                <Text fw={700} tt="capitalize">
                  {dimension.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1')}
                </Text>
                <Text size="sm" c="dimmed">
                  {message}
                </Text>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Text size="sm" c="dimmed">
            Justification details are not available for this candidate yet.
          </Text>
        )}
      </Paper>
    </Stack>
  );
}
