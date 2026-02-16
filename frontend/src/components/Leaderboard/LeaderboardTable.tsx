import { useMemo, useState } from 'react';
import {
  Badge,
  Group,
  Paper,
  Progress,
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
  { label: 'Avg Score', field: 'overall_score' },
  { label: 'Experience', field: 'years_experience' },
  { label: 'Performance', field: 'overall_score' }
];

function topBadgeVariant(rank: number) {
  if (rank === 1) return { color: 'yellow', label: '1' };
  if (rank === 2) return { color: 'gray', label: '2' };
  if (rank === 3) return { color: 'grape', label: '3' };
  return { color: 'eco', label: String(rank) };
}

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
        <Text fw={700} size="sm">
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
    () => sortLeaderboard(entries, sortField, sortDirection).slice(0, 10),
    [entries, sortField, sortDirection]
  );

  const handleSort = (incomingField: LeaderboardSortField) => {
    const nextDirection = nextSortDirection(sortField, sortDirection, incomingField);
    setSortField(incomingField);
    setSortDirection(nextDirection);
  };

  return (
    <Paper withBorder radius="lg" p="md" className="hover-card surface-panel">
      <Group justify="space-between" mb="sm">
        <Text fw={800}>Top 10 Candidate Leaderboard</Text>
        <Badge variant="light" color="eco">
          Sortable
        </Badge>
      </Group>

      <ScrollArea>
        <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="sm" miw={860}>
          <Table.Thead>
            <Table.Tr>
              {HEADERS.map((header) => (
                <Table.Th key={header.label}>
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

          <Table.Tbody key={`${sortField}-${sortDirection}`} className="sort-animate">
            {sortedRows.map((row) => {
              const top = row.rank_position <= 3;
              const rankBadge = topBadgeVariant(row.rank_position);

              return (
                <Table.Tr
                  key={row.candidate_id}
                  style={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    background: top ? 'var(--row-top-bg)' : undefined,
                    transition: 'background-color 180ms ease'
                  }}
                  onClick={() => onRowClick?.(row.candidate_id)}
                >
                  <Table.Td>
                    <Badge color={rankBadge.color} variant="filled" radius="xl">
                      #{rankBadge.label}
                    </Badge>
                  </Table.Td>

                  <Table.Td>
                    <Text fw={700}>{row.full_name}</Text>
                    <Text size="xs" c="dimmed">
                      {row.current_role}
                    </Text>
                  </Table.Td>

                  <Table.Td>
                    <Text fw={800}>{row.overall_score.toFixed(1)}</Text>
                  </Table.Td>

                  <Table.Td>
                    <Text>{row.years_experience.toFixed(1)} yrs</Text>
                  </Table.Td>

                  <Table.Td>
                    <Group gap={10} wrap="nowrap">
                      <Progress
                        value={row.overall_score}
                        color={row.overall_score >= 85 ? 'eco' : row.overall_score >= 70 ? 'blue' : 'orange'}
                        radius="xl"
                        style={{ width: 160 }}
                      />
                      <Text size="xs" c="dimmed">
                        {row.overall_score >= 85 ? 'High' : row.overall_score >= 70 ? 'Strong' : 'Moderate'}
                      </Text>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}
