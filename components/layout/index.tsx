import { FC, ReactNode, useState } from 'react';
import cx from 'classnames';
import NextLink from 'components/nextLink';
import Header from 'components/Header';

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
    <main className="absolute top-0 right-0 bottom-0 left-0 box-border overflow-hidden flex flex-col">
      <Header />
      <section className="flex-1 flex">
        <aside className="z-1 w-52 min-w-max h-full bg-gray-300 shadow-[1px_2px_10px_1px_#050505]">
          <ul className="p-4 menu menu-compact gap-6 flex flex-col">
            {menus.map((menu) => {
              return (
                <li key={menu.id} onClick={() => setActive(menu.id)}>
                  <NextLink
                    href={menu.url}
                    className={cx('flex gap-4 demo', active === menu.id && 'active')}
                  >
                    <span>{menu.name}</span>
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
