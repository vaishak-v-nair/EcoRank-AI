import { useMemo, useState } from 'react';
import {
  Badge,
  Group,
  Paper,
  RingProgress,
  ScrollArea,
  Table,
  Text,
  UnstyledButton
} from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import type { LeaderboardEntry } from '../../types/candidate.types';
import {
  type LeaderboardSortField,
  type SortDirection,
  nextSortDirection,
  sortLeaderboard
} from './leaderboard.utils';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  onRowClick?: (candidateId: number) => void;
}

interface HeaderCell {
  label: string;
  field: LeaderboardSortField;
}

const HEADERS: HeaderCell[] = [
  { label: 'Rank', field: 'rank_position' },
  { label: 'Candidate', field: 'full_name' },
  { label: 'Experience', field: 'years_experience' },
  { label: 'Overall', field: 'overall_score' },
  { label: 'Crisis', field: 'crisis_score' },
  { label: 'Sustainability', field: 'sustainability_score' },
  { label: 'Motivation', field: 'motivation_score' }
];

function SortHeader({
  label,
  field,
  activeField,
  direction,
  onSort
}: {
  label: string;
  field: LeaderboardSortField;
  activeField: LeaderboardSortField;
  direction: SortDirection;
  onSort: (field: LeaderboardSortField) => void;
}) {
  const isActive = activeField === field;
  const Icon = direction === 'asc' ? IconChevronUp : IconChevronDown;

  return (
    <UnstyledButton onClick={() => onSort(field)}>
      <Group gap={4} wrap="nowrap">
        <Text fw={600} size="sm">
          {label}
        </Text>
        {isActive ? <Icon size={14} /> : null}
      </Group>
    </UnstyledButton>
  );
}

export function LeaderboardTable({ entries, onRowClick }: LeaderboardTableProps) {
  const [sortField, setSortField] = useState<LeaderboardSortField>('rank_position');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedRows = useMemo(
    () => sortLeaderboard(entries, sortField, sortDirection),
    [entries, sortField, sortDirection]
  );

  const handleSort = (incomingField: LeaderboardSortField) => {
    const nextDirection = nextSortDirection(sortField, sortDirection, incomingField);
    setSortField(incomingField);
    setSortDirection(nextDirection);
  };

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
        <Text fw={700}>Top 10 Leaderboard</Text>
        <Badge variant="light" color="forest">
          {entries.length} candidates
        </Badge>
      </Group>

      <ScrollArea>
        <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="sm" miw={760}>
          <Table.Thead>
            <Table.Tr>
              {HEADERS.map((header) => (
                <Table.Th key={header.field}>
                  <SortHeader
                    label={header.label}
                    field={header.field}
                    activeField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {sortedRows.slice(0, 10).map((row) => (
              <Table.Tr
                key={row.candidate_id}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                onClick={() => onRowClick?.(row.candidate_id)}
              >
                <Table.Td>
                  <Badge color="forest" variant="filled">
                    #{row.rank_position}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text fw={600}>{row.full_name}</Text>
                  <Text size="xs" c="dimmed">
                    {row.location_city}, {row.location_state}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{row.years_experience.toFixed(1)} yrs</Text>
                  <Text size="xs" c="dimmed">
                    {row.current_role}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={8}>
                    <RingProgress
                      size={28}
                      thickness={4}
                      sections={[{ value: row.overall_score, color: row.overall_score >= 85 ? 'forest.7' : 'copper.6' }]}
                    />
                    <Text fw={700}>{row.overall_score.toFixed(1)}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>{row.crisis_score}</Table.Td>
                <Table.Td>{row.sustainability_score}</Table.Td>
                <Table.Td>{row.motivation_score}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}
