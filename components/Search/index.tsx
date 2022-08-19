import { ChangeEvent, useState } from 'react';
import { useAppContext } from 'store/index';
import queryClient from 'core/queryClient';
import { queryKeys } from 'core/queryConsts';
import conf from 'conf';

const Search = () => {
  const [visible, setVisible] = useState(conf.filters.search);
  const { setSearch, time, sort, pagination } = useAppContext();
  const [localSearch, setLocalSearch] = useState('');

  const handleSearch = async (key: string = localSearch) => {
    setSearch(key);
    await queryClient.invalidateQueries(
      queryKeys.filterArticles({
        search: key,
        time,
        sort,
        pagination: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          visible: pagination.visible,
        },
      })
    );
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  // @ts-ignore
  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await handleSearch();
    }
  };

  const handleSwitch = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setVisible(false);
      setLocalSearch('');
      await handleSearch('');
    } else {
      setVisible(true);
    }
  };

  return (
    <div>
      <label className="label cursor-pointer max-w-max space-x-2">
        <span className="label-text font-bold text-xl">模糊匹配</span>
        <input
          type="checkbox"
          className="!toggle checked:bg-none"
          checked={visible}
          onChange={handleSwitch}
        />
      </label>
      <div className="p-4 bg-white rounded-md shadow-md">
        <label className="input-group">
          <input
            type="text"
            value={localSearch}
            disabled={!visible}
            placeholder="请输入匹配关键字"
            className="input w-full focus:border-blue-500"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button className="btn" disabled={!visible} onClick={() => handleSearch()}>
            搜索
          </button>
        </label>
      </div>
    </div>
  );
};

export default Search;
