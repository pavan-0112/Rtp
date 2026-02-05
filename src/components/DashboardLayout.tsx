
import { ReactNode } from 'react';
import { Header } from './layout/Header';
import Sidebar from './layout/Sidebar';
import { AnimatedDiv, fadeIn } from '@/components/ui/animated-components';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <AnimatedDiv className="min-h-screen bg-gray-50" {...fadeIn}>
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </AnimatedDiv>
  );
};

export default DashboardLayout;
