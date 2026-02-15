import { Badge, Group, Text, Title, UnstyledButton } from '@mantine/core';
import { IconChartBar, IconRecycle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  return (
    <Group h="100%" px="lg" justify="space-between">
      <Group gap="sm">
        <IconRecycle size={28} stroke={1.9} color="#1f7a50" />
        <div>
          <Title order={4}>EcoRank AI</Title>
          <Text size="xs" c="dimmed">
            Recycling Leadership Intelligence
          </Text>
        </div>
      </Group>

      <Group gap="md">
        <Badge variant="light" color="forest">
          Live Candidate Ranking
        </Badge>
        <UnstyledButton onClick={() => navigate('/')} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <Group gap={6}>
            <IconChartBar size={17} />
            <Text fw={700}>Dashboard</Text>
          </Group>
        </UnstyledButton>
      </Group>
    </Group>
  );
}
