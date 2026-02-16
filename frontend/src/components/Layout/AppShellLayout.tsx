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
          background: 'var(--shell-header-bg)',
          borderBottom: '1px solid var(--shell-header-line)',
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
