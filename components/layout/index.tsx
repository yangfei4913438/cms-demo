import { FC, ReactNode, useState } from 'react';
import cx from 'classnames';
import NextLink from 'components/nextLink';
import Header from 'components/Header';
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
            <aside className="z-1 w-52 min-w-max h-full bg-gray-300 shadow-[1px_2px_10px_1px_#050505]">
              <div className="p-6 gap-6">
                <div>
                  <label className="label">
                    <span className="label-text font-bold text-xl">模糊匹配</span>
                  </label>
                  <label className="input-group">
                    <input
                      type="text"
                      placeholder="请输入匹配关键字"
                      className="input input-bordered"
                    />
                    <button className="btn">搜索</button>
                  </label>
                </div>
              </div>
            </aside>
            <main className="flex-1 h-full">{children}</main>
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center text-3xl text-gray-500">
            哎呀呀，你还没登录呢～
          </div>
        )}
      </section>
    </main>
  );
};

export default Layout;
