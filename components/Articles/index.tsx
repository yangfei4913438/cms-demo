import Search from './Search';
import TimeRange from './TimeRange';
import Sort from './Sort';
import Pagination from './pagination';
import List from './List';
import { FC } from 'react';

const Articles: FC<{ isTag?: boolean }> = ({ isTag = false }) => {
  return (
    <section className="flex h-full flex-1 overflow-auto">
      <aside className="z-1 h-full w-52 min-w-max space-y-3 overflow-auto bg-[#e0e0e0] p-6 shadow-[1px_2px_10px_1px_#050505]">
        <Search />
        <TimeRange />
        <Sort />
        <Pagination />
      </aside>
      <main className="h-full overflow-auto bg-[#f1f1f1]" style={{ width: 'calc(100% - 13rem - 10rem)' }}>
        <List isTag={isTag} />
      </main>
    </section>
  );
};

export default Articles;
