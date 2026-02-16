import {
  ActionIcon,
  Badge,
  Group,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme
} from '@mantine/core';
import { IconChartBar, IconLeaf, IconMoonStars, IconRecycle, IconSunHigh } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Group h="100%" px="lg" justify="space-between">
      <Group gap="sm">
        <IconRecycle size={27} stroke={1.9} color={isDark ? '#68a77f' : '#35704c'} />
        <div>
          <Title order={4} className="header-title">
            EcoRank AI
          </Title>
          <Text size="xs" className="header-subtitle">
            Recycling Production Manager Selection Console
          </Text>
        </div>
      </Group>

      <Group gap="md">
        <Badge variant="light" color="eco" leftSection={<IconLeaf size={12} />}>
          Live Candidate Ranking
        </Badge>
        <UnstyledButton
          onClick={() => navigate('/')}
          style={{ display: 'inline-flex', alignItems: 'center' }}
          className="header-nav-link"
        >
          <Group gap={6}>
            <IconChartBar size={17} />
            <Text fw={700}>Dashboard</Text>
          </Group>
        </UnstyledButton>
        <Tooltip label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          <ActionIcon
            variant="light"
            color="graphite"
            radius="xl"
            onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
            aria-label="Toggle color scheme"
          >
            {isDark ? <IconSunHigh size={17} /> : <IconMoonStars size={17} />}
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}
