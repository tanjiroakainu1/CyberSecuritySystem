import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes/AppRoutes';
import { DataProvider, useData } from '@/context/DataContext';
import { Toast } from '@/components/ui/CrudComponents';
import { RoleSync } from '@/components/layout/RoleSync';

function AppContent() {
  const { toast } = useData();
  return (
    <>
      <RoleSync />
      <AppRoutes />
      <Toast message={toast} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </BrowserRouter>
  );
}
