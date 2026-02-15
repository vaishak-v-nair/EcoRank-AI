import { Route, Routes } from 'react-router-dom';
import { AppShellLayout } from './components/Layout/AppShellLayout';
import { CandidateDetail } from './pages/CandidateDetail';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <AppShellLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/candidate/:id" element={<CandidateDetail />} />
      </Routes>
    </AppShellLayout>
  );
}

export default App;