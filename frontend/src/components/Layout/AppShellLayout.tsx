import { AppShell, Container } from '@mantine/core';
import type { ReactNode } from 'react';
import { Header } from './Header';

interface AppShellLayoutProps {
  children: ReactNode;
}

export function AppShellLayout({ children }: AppShellLayoutProps) {
  return (
    <AppShell
      header={{ height: 72 }}
      padding="md"
      styles={{
        header: {
          background: 'rgba(255, 253, 248, 0.9)',
          borderBottom: '1px solid #dce7e2',
          backdropFilter: 'blur(8px)'
        },
        main: {
          background: 'var(--hero-gradient)',
          minHeight: '100vh'
        }
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container size={1300}>
          <div className="page-enter">{children}</div>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
