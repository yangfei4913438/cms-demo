import type { FC, ReactNode } from 'react';
import Header from 'components/Header';
import Search from 'components/Search';
import Sort from 'components/Sort';
import TimeRange from 'components/TimeRange';

import useUserInfo from 'hooks/useUserInfo';
import Pagination from 'components/pagination';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { userInfo } = useUserInfo();
  const { t } = useTranslation();

  return (
    <main className="relative box-border flex h-screen w-screen flex-col overflow-hidden">
      <Header />
      <section className="flex h-full flex-1 overflow-auto">
        {userInfo ? (
          <>
            <aside className="z-1 h-full w-52 min-w-max space-y-3 overflow-auto bg-[#e0e0e0] p-6 shadow-[1px_2px_10px_1px_#050505]">
              <Search />
              <TimeRange />
              <Sort />
              <Pagination />
            </aside>
            <main className="h-full" style={{ width: 'calc(100% - 13rem - 10rem)' }}>
              {children}
            </main>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl text-gray-500">
            {t('no_login_text')}
          </div>
        )}
      </section>
    </main>
  );
};

export default Layout;
