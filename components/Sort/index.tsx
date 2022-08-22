import { useAppContext } from 'store/index';
import { ChangeEvent, useState } from 'react';
import conf from 'conf';
import cx from 'classnames';
import queryClient from 'core/queryClient';
import { queryKeys } from 'core/queryConsts';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const Sort = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { time, search, sort: globalSort, setSort, pagination } = useAppContext();

  const [visible, setVisible] = useState(conf.filters.sort);

  const [list, setList] = useState<ArticleSortType[]>([]);

  const initSort: { [key in ArticleSortType]: 'asc' | 'desc' } = {
    title: 'asc',
    createdAt: 'asc',
    updatedAt: 'asc',
  };

  const [localSort, setLocalSort] =
    useState<{ [key in ArticleSortType]: 'asc' | 'desc' }>(initSort);

  const handleSearch = async (
    sort: typeof globalSort = list
      .filter((o) => localSort[o])
      .map((o) => ({ name: o, sort: localSort[o] }))
  ) => {
    setSort(sort);
    await queryClient.invalidateQueries(
      queryKeys.filterArticles({
        search,
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

  const handleQuery = async () => {
    await handleSearch();
  };

  const handleSwitch = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setVisible(false);
      setList([]);
      setLocalSort(initSort);
      await handleSearch([]);
    } else {
      setVisible(true);
    }
  };

  const handleSortCheck = (e: ChangeEvent<HTMLInputElement>, type: ArticleSortType) => {
    const res = e.target.checked;
    if (res) {
      if (!list.includes(type)) {
        setList((prevState) => prevState.concat([type]));
      }
    } else {
      if (list.includes(type)) {
        setList((prevState) => {
          const idx = prevState.indexOf(type);
          return [...prevState.slice(0, idx), ...prevState.slice(idx + 1)];
        });
      }
    }
  };

  const handleSort = (e: ChangeEvent<HTMLInputElement>, type: ArticleSortType) => {
    const res = e.target.checked;
    setLocalSort((prevState) => {
      return {
        ...prevState,
        [type]: !res ? 'asc' : 'desc',
      };
    });
  };

  const showOrder = (type: ArticleSortType) => {
    const idx = list.indexOf(type);
    if (idx === -1) {
      return '';
    }
    return <span className="inline-block text-[16px] font-bold"> (No.{idx + 1}) </span>;
  };

  return (
    <div>
      <label className="label max-w-max cursor-pointer space-x-2">
        <span className="label-text text-xl font-bold">{t('filter.sort')}</span>
        <input
          type="checkbox"
          className="!toggle checked:bg-none"
          checked={visible}
          onChange={handleSwitch}
        />
      </label>
      <div className="rounded-md bg-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <label className="label h-9 cursor-pointer justify-start space-x-2">
            <input
              type="checkbox"
              disabled={!visible}
              className="!checkbox !checkbox-sm"
              checked={list.includes('title')}
              onChange={(e) => handleSortCheck(e, 'title')}
            />
            <span className="label-text text-xl">
              {t('filter.sort.title')} {showOrder('title')}
            </span>
          </label>
          {list.includes('title') && (
            <label className="label cursor-pointer space-x-2">
              <span className="label-text text-lg">
                {localSort.title === 'asc' ? t('filter.sort.asc') : t('filter.sort.desc')}
              </span>
              <input
                type="checkbox"
                className="!toggle checked:bg-none"
                checked={localSort.title === 'desc'}
                onChange={(e) => handleSort(e, 'title')}
              />
            </label>
          )}
        </div>
        <div className="flex items-center justify-between">
          <label className="label h-9 cursor-pointer justify-start space-x-2">
            <input
              type="checkbox"
              disabled={!visible}
              className="!checkbox !checkbox-sm"
              checked={list.includes('createdAt')}
              onChange={(e) => handleSortCheck(e, 'createdAt')}
            />
            <span className="label-text text-xl">
              {t('filter.sort.createdAt')} {showOrder('createdAt')}
            </span>
          </label>
          {list.includes('createdAt') && (
            <label className="label cursor-pointer space-x-2">
              <span className="label-text text-lg">
                {localSort.createdAt === 'asc' ? t('filter.sort.asc') : t('filter.sort.desc')}
              </span>
              <input
                type="checkbox"
                className="!toggle checked:bg-none"
                checked={localSort.createdAt === 'desc'}
                onChange={(e) => handleSort(e, 'createdAt')}
              />
            </label>
          )}
        </div>
        <div className="flex items-center justify-between">
          <label className="label h-9 cursor-pointer justify-start space-x-2">
            <input
              type="checkbox"
              disabled={!visible}
              className="!checkbox !checkbox-sm"
              checked={list.includes('updatedAt')}
              onChange={(e) => handleSortCheck(e, 'updatedAt')}
            />
            <span className="label-text text-xl">
              {t('filter.sort.updatedAt')} {showOrder('updatedAt')}
            </span>
          </label>
          {list.includes('updatedAt') && (
            <label className="label cursor-pointer space-x-2">
              <span className="label-text text-lg">
                {localSort.updatedAt === 'asc' ? t('filter.sort.asc') : t('filter.sort.desc')}
              </span>
              <input
                type="checkbox"
                className="!toggle checked:bg-none"
                checked={localSort.updatedAt === 'desc'}
                onChange={(e) => handleSort(e, 'updatedAt')}
              />
            </label>
          )}
        </div>
        <button
          className={cx('btn btn-sm mt-4 h-10 w-32 capitalize')}
          disabled={!visible}
          onClick={handleQuery}
        >
          {t('filter.sort')}
        </button>
      </div>
    </div>
  );
};

export default Sort;
