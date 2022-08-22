import { ChangeEvent, useState } from 'react';
import { useAppContext } from 'store/index';
import queryClient from 'core/queryClient';
import { queryKeys } from 'core/queryConsts';
import conf from 'conf';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const Search = () => {
  const { t } = useTranslation();
  const router = useRouter();
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
        locale: router.locale,
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
      <label className="label max-w-max cursor-pointer space-x-2">
        <span className="label-text text-xl font-bold">{t('filter.search')}</span>
        <input
          type="checkbox"
          className="!toggle checked:bg-none"
          checked={visible}
          onChange={handleSwitch}
        />
      </label>
      <div className="rounded-md bg-white p-4 shadow-md">
        <label className="input-group">
          <input
            type="text"
            value={localSearch}
            disabled={!visible}
            placeholder={t('filter.search.placeholder')}
            className="input w-full focus:border-blue-500"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button className="btn capitalize" disabled={!visible} onClick={() => handleSearch()}>
            {t('filter.search.button')}
          </button>
        </label>
      </div>
    </div>
  );
};

export default Search;
