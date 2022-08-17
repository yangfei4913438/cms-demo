import useUserInfo from 'hooks/useUserInfo';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'core/queryConsts';
import { filterArticles } from 'http/articles';
import { useAppContext } from 'store/index';
import queryClient from 'core/queryClient';

const Filter = () => {
  const [edit, setEdit] = useState({ filter: '' });

  const { setList, setFilter, filter } = useAppContext();

  const { userInfo } = useUserInfo();

  useQuery(
    queryKeys.filterArticles(filter),
    () => filterArticles(userInfo?.jwt!, filter).then(setList),
    {
      enabled: !!userInfo?.jwt && !!filter && !!edit.filter,
    }
  );

  const handleSearch = async () => {
    if (edit.filter === '') {
      // 先清空筛选条件，否则全部文章列表无法发起请求
      setFilter('');
      // 重新请求全部文章列表
      await queryClient.invalidateQueries(queryKeys.articles);
    } else {
      // 更新筛选条件
      setFilter(edit.filter);
    }
  };

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      await handleSearch();
    }
  };

  return (
    <aside className="z-1 w-52 min-w-max h-full bg-gray-300 shadow-[1px_2px_10px_1px_#050505]">
      <div className="p-6 gap-6">
        <div>
          <label className="label">
            <span className="label-text font-bold text-xl">模糊匹配</span>
          </label>
          <label className="input-group">
            <input
              type="text"
              value={edit.filter}
              placeholder="请输入匹配关键字"
              className="input input-bordered"
              onChange={(e) => {
                setEdit((prev) => {
                  return {
                    ...prev,
                    filter: e.target.value,
                  };
                });
              }}
              // @ts-ignore
              onKeyDown={handleKeyDown}
            />
            <button className="btn" onClick={handleSearch}>
              搜索
            </button>
          </label>
        </div>
      </div>
    </aside>
  );
};

export default Filter;
