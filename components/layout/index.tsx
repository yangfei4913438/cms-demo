import { FC, ReactNode } from 'react';
import NextLink from 'components/nextLink';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className="absolute top-0 right-0 bottom-0 left-0 box-border overflow-hidden">
      <section className="h-full flex">
        <aside className="w-52 h-full bg-gray-200">
          <header className="text-xl font-bold text-center flex px-4">
            <NextLink href="/" className="btn btn-lg btn-ghost px-2 w-full">
              <span className="text-2xl">数据服务</span>
            </NextLink>
          </header>
          <hr />
          <ul className="p-4 menu menu-compact gap-0.5 flex flex-col">
            <li>
              <a className="flex gap-4 active">
                <span>#</span>
                <span className="flex-1 text-lg font-bold">配置定义</span>
              </a>
            </li>
            <li>
              <a className="flex gap-4">
                <span>@</span>
                <span className="flex-1 text-lg font-bold">数据列表</span>
              </a>
            </li>
          </ul>
        </aside>
        <main className="flex-1 h-full bg-gray-50 p-4">{children}</main>
      </section>
    </main>
  );
};

export default Layout;
