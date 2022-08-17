import useUserInfo from 'hooks/useUserInfo';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'core/queryConsts';
import { filterArticles } from 'http/articles';
import { useAppContext } from 'store/index';
import queryClient from 'core/queryClient';

const Filter = () => {
  const [edit, setEdit] = useState({ filter: '' });
  const [filter, setFilter] = useState('');

  const { setList } = useAppContext();

  const { userInfo } = useUserInfo();

  useQuery(
    queryKeys.filterArticles(filter),
    () =>
      filterArticles(userInfo?.jwt!, filter).then((res) => {
        setList(res);
        setFilter('');
      }),
    {
      enabled: !!userInfo?.jwt && !!filter,
    }
  );

  const handleSearch = async () => {
    if (!edit.filter) {
      await queryClient.invalidateQueries(queryKeys.articles);
    } else {
      setFilter(edit.filter);
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
