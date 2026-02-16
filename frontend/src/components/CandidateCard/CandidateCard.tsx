import { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, Group, Progress, Stack, Text } from '@mantine/core';
import { IconShare, IconUserSearch } from '@tabler/icons-react';
import type { Candidate } from '../../types/candidate.types';

interface CandidateCardProps {
  candidate: Candidate;
  onOpenProfile?: (candidateId: number) => void;
}

function scoreColor(score: number): 'eco' | 'blue' | 'orange' {
  if (score >= 85) return 'eco';
  if (score >= 70) return 'blue';
  return 'orange';
}

export function CandidateCard({ candidate, onOpenProfile }: CandidateCardProps) {
  const [copied, setCopied] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const evalData = candidate.latest_evaluation;

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const skills = useMemo(
    () => (candidate.skills_json || []).slice(0, 5).map((skill) => skill.name),
    [candidate.skills_json]
  );

  const handleShare = async () => {
    if (!navigator.clipboard) return;
    const detailUrl = `${window.location.origin}/candidate/${candidate.id}`;
    await navigator.clipboard.writeText(detailUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Card
      withBorder
      radius="lg"
      p="md"
      className="hover-card surface-panel"
    >
      <Stack gap="sm">
        <Group justify="space-between" align="start">
          <div>
            <Text fw={800}>{candidate.full_name}</Text>
            <Text size="sm" c="dimmed">
              {candidate.current_role}
            </Text>
          </div>
          {evalData?.rank_position ? (
            <Badge color="eco" variant="filled">
              Rank #{evalData.rank_position}
            </Badge>
          ) : null}
        </Group>

        <Group gap={8}>
          <Badge variant="light" color="graphite">
            {candidate.years_experience.toFixed(1)} yrs exp
          </Badge>
          <Badge variant="light" color="graphite">
            {candidate.location_state}
          </Badge>
        </Group>

        <Group gap={6}>
          {skills.map((skill) => (
            <Badge key={skill} variant="outline" color="eco" radius="sm">
              {skill}
            </Badge>
          ))}
        </Group>

        {evalData ? (
          <Stack gap={6}>
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                Crisis Management
              </Text>
              <Text size="xs" fw={700}>
                {evalData.crisis_score}
              </Text>
            </Group>
            <Progress value={animateIn ? evalData.crisis_score : 0} color={scoreColor(evalData.crisis_score)} radius="xl" />

            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                Sustainability Knowledge
              </Text>
              <Text size="xs" fw={700}>
                {evalData.sustainability_score}
              </Text>
            </Group>
            <Progress value={animateIn ? evalData.sustainability_score : 0} color={scoreColor(evalData.sustainability_score)} radius="xl" />

            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                Team Motivation
              </Text>
              <Text size="xs" fw={700}>
                {evalData.motivation_score}
              </Text>
            </Group>
            <Progress value={animateIn ? evalData.motivation_score : 0} color={scoreColor(evalData.motivation_score)} radius="xl" />

            <Group justify="space-between" mt={4}>
              <Text fw={700}>Composite Score</Text>
              <Badge color={scoreColor(evalData.overall_score)} variant="filled">
                {evalData.overall_score.toFixed(1)}
              </Badge>
            </Group>
          </Stack>
        ) : (
          <Badge color="orange" variant="light">
            Awaiting Evaluation
          </Badge>
        )}

        <Group mt="sm">
          <Button variant="default" leftSection={<IconUserSearch size={16} />} onClick={() => onOpenProfile?.(candidate.id)}>
            View
          </Button>
          <Button
            variant="filled"
            color={copied ? 'eco' : 'graphite'}
            leftSection={<IconShare size={16} />}
            onClick={() => { void handleShare(); }}
          >
            {copied ? 'Shared' : 'Share Candidate'}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
