import { useState } from 'react';
import { Badge, Button, Card, Divider, Group, Progress, Stack, Text } from '@mantine/core';
import { IconMapPin, IconShare, IconUserSearch } from '@tabler/icons-react';
import type { Candidate } from '../../types/candidate.types';
import { scoreColor, scoreLabel } from '../../utils/scoreHelpers';
import { candidateCardStyles } from './candidateCard.styles';

interface CandidateCardProps {
  candidate: Candidate;
  onOpenProfile?: (candidateId: number) => void;
}

export function CandidateCard({ candidate, onOpenProfile }: CandidateCardProps) {
  const [copied, setCopied] = useState(false);
  const latestScore = candidate.latest_evaluation?.overall_score ?? null;

  const handleShare = async () => {
    if (!navigator.clipboard) {
      return;
    }

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
      style={{
        ...candidateCardStyles.card,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(249,252,250,0.92))',
        borderColor: '#dbe7e1',
        boxShadow: '0 8px 24px rgba(20, 91, 59, 0.08)'
      }}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="start">
          <div>
            <Text fw={700}>{candidate.full_name}</Text>
            <Text size="sm" c="dimmed">
              {candidate.current_role}
            </Text>
          </div>
          {candidate.latest_evaluation?.rank_position ? (
            <Badge color="indigo" variant="light">
              Rank #{candidate.latest_evaluation.rank_position}
            </Badge>
          ) : null}
        </Group>

        <Group gap={8}>
          <Badge color="gray" variant="outline">
            {candidate.years_experience.toFixed(1)} yrs
          </Badge>
          <Badge color="gray" variant="outline">
            {candidate.highest_education}
          </Badge>
          <Badge color="gray" variant="outline">
            <Group gap={4}>
              <IconMapPin size={12} />
              {candidate.location_state}
            </Group>
          </Badge>
        </Group>

        <Text size="sm" style={candidateCardStyles.summary}>
          {candidate.profile_summary}
        </Text>

        {latestScore !== null ? (
          <>
            <Group justify="space-between">
              <Text size="sm" fw={700}>
                Overall Score: {latestScore.toFixed(1)}
              </Text>
              <Badge color={scoreColor(latestScore)}>{scoreLabel(latestScore)}</Badge>
            </Group>
            <Progress value={latestScore} color={scoreColor(latestScore)} radius="xl" size="sm" />
          </>
        ) : (
          <Badge color="yellow" variant="light">
            Awaiting Evaluation
          </Badge>
        )}
      </Stack>

      <Divider my="md" />

      <Group mt="md" style={candidateCardStyles.footer}>
        <Button
          variant="filled"
          leftSection={<IconUserSearch size={16} />}
          onClick={() => onOpenProfile?.(candidate.id)}
        >
          Open Profile
        </Button>
        <Button
          variant="light"
          color={copied ? 'teal' : 'gray'}
          leftSection={<IconShare size={16} />}
          onClick={() => {
            void handleShare();
          }}
        >
          {copied ? 'Shared' : 'Share'}
        </Button>
      </Group>
    </Card>
  );
}
