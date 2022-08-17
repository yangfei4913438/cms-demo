import { FC, ReactNode, useState } from 'react';
import Header from 'components/Header';
import Filter from 'components/Filter';

import useUserInfo from 'hooks/useUserInfo';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { userInfo } = useUserInfo();

  const [active, setActive] = useState(-1);

  return (
    <main className="absolute top-0 right-0 bottom-0 left-0 box-border overflow-hidden flex flex-col">
      <Header />
      <section className="flex-1 flex">
        {userInfo ? (
          <>
            <Filter />
            <main className="flex-1 h-full">{children}</main>
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center text-3xl text-gray-500">
            哎呀，你还没登录呢～
          </div>
        )}
      </section>
    </main>
  );
};

export default Layout;
