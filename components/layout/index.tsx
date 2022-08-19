import type { FC, ReactNode } from 'react';
import Header from 'components/Header';
import Search from 'components/Search';
import Sort from 'components/Sort';
import TimeRange from 'components/TimeRange';

import useUserInfo from 'hooks/useUserInfo';
import Pagination from 'components/pagination';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { userInfo } = useUserInfo();

  return (
    <main className="relative w-screen h-screen box-border overflow-hidden flex flex-col">
      <Header />
      <section className="flex-1 flex h-full overflow-auto">
        {userInfo ? (
          <>
            <aside className="p-6 space-y-3 z-1 w-52 min-w-max h-full overflow-auto bg-[#e0e0e0] shadow-[1px_2px_10px_1px_#050505]">
              <Search />
              <TimeRange />
              <Sort />
              <Pagination />
            </aside>
            <main className="flex-1 h-full">{children}</main>
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center text-3xl text-gray-500">
            🤣哎呀，你还没登录呢～
          </div>
        )}
      </section>
    </main>
  );
};

export default Layout;
