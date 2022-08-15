import { FC, ReactNode, useState } from 'react';
import cx from 'classnames';
import NextLink from 'components/nextLink';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [active, setActive] = useState(-1);

  const menus = [
    {
      id: 1,
      name: '列表查询',
      url: '',
    },
    {
      id: 2,
      name: '模糊查询',
      url: '',
    },
    {
      id: 3,
      name: '筛选排序',
      url: '',
    },
    {
      id: 4,
      name: '范围查询',
      url: '',
    },
  ];

  return (
    <main className="absolute top-0 right-0 bottom-0 left-0 box-border overflow-hidden">
      <section className="h-full flex">
        <aside className="w-52 h-full bg-gray-200">
          <header className="text-xl font-bold text-center flex px-4">
            <NextLink href="/" className="btn btn-lg btn-ghost px-2 w-full">
              <span className="text-2xl lowercase">查询范例</span>
            </NextLink>
          </header>
          <hr />
          <ul className="p-4 menu menu-compact gap-0.5 flex flex-col">
            {menus.map((menu) => {
              return (
                <li key={menu.id} onClick={() => setActive(menu.id)}>
                  <NextLink
                    href={menu.url}
                    className={cx('flex gap-4', active === menu.id && 'active')}
                  >
                    <span className="flex-1 text-base font-bold">{menu.name}</span>
                  </NextLink>
                </li>
              );
            })}
          </ul>
        </aside>
        <main className="flex-1 h-full">{children}</main>
      </section>
    </main>
  );
};

export default Layout;
