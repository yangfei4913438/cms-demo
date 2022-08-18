import useUserInfo from 'hooks/useUserInfo';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'core/queryConsts';
import { getArticles } from 'http/articles';
import { useAppContext } from 'store/index';
import queryClient from 'core/queryClient';

const Search = () => {
  const [localSearch, setLocalSearch] = useState('');

  const { setList, setSearch, search } = useAppContext();

  const { userInfo } = useUserInfo();

  useQuery(
    queryKeys.filterArticles(search),
    () => getArticles(userInfo?.jwt!, { _q: search }).then(setList),
    {
      enabled: !!userInfo?.jwt && !!search && !!localSearch,
    }
  );

  const handleSearch = async () => {
    if (localSearch === '') {
      // 先清空筛选条件，否则全部文章列表无法发起请求
      setSearch('');
      // 重新请求全部文章列表
      await queryClient.invalidateQueries(queryKeys.articles);
    } else {
      // 更新筛选条件
      setSearch(localSearch);
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
      <div className="p-4 bg-white rounded-md shadow-md">
        <label className="input-group">
          <input
            type="text"
            value={localSearch}
            placeholder="请输入匹配关键字"
            className="input input-bordered w-full"
            onChange={(e) => {
              setLocalSearch(e.target.value);
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
  );
};

export default Search;
