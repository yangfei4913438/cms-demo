import type { FC, ReactNode } from 'react';
import Header from 'components/Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className="relative box-border flex h-screen w-screen flex-col overflow-hidden">
      <Header />
      {children}
    </main>
  );
};

export default Layout;
