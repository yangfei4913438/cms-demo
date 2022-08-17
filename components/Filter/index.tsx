import useUserInfo from 'hooks/useUserInfo';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'core/queryConsts';
import { filterArticles } from 'http/articles';
import { useAppContext } from 'store/index';
import queryClient from 'core/queryClient';

const Filter = () => {
  const [localFilter, setLocalFilter] = useState('');

  const { setList, setFilter, filter } = useAppContext();

  const { userInfo } = useUserInfo();

  useQuery(
    queryKeys.filterArticles(filter),
    () => filterArticles(userInfo?.jwt!, filter).then(setList),
    {
      enabled: !!userInfo?.jwt && !!filter && !!localFilter,
    }
  );

  const handleSearch = async () => {
    if (localFilter === '') {
      // 先清空筛选条件，否则全部文章列表无法发起请求
      setFilter('');
      // 重新请求全部文章列表
      await queryClient.invalidateQueries(queryKeys.articles);
    } else {
      // 更新筛选条件
      setFilter(localFilter);
    }
  };

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      await handleSearch();
    }
  };

  return (
    <div>
      <label className="label">
        <span className="label-text font-bold text-xl">模糊匹配</span>
      </label>
      <label className="input-group">
        <input
          type="text"
          value={localFilter}
          placeholder="请输入匹配关键字"
          className="input input-bordered"
          onChange={(e) => {
            setLocalFilter(e.target.value);
          }}
          // @ts-ignore
          onKeyDown={handleKeyDown}
        />
        <button className="btn" onClick={handleSearch}>
          搜索
        </button>
      </label>
    </div>
  );
};

export default Filter;
