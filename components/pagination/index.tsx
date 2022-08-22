import { ChangeEvent, useState } from 'react';
import cx from 'classnames';
import conf from 'conf/index';
import { useAppContext } from 'store';
import queryClient from 'core/queryClient';
import { queryKeys } from 'core/queryConsts';
import { useRouter } from 'next/router';

const Pagination = () => {
  const router = useRouter();
  const { search, time, sort, pagination, setPagination } = useAppContext();

  const handleSwitch = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setPagination((prevState) => ({
        ...prevState,
        visible: false,
        page: 1,
        pageSize: conf.filters.pageSizeMin,
      }));
      await queryClient.invalidateQueries(
        queryKeys.filterArticles({
          search,
          time,
          sort,
          pagination: { page: 1, pageSize: conf.filters.pageSizeMin, visible: false },
          locale: router.locale,
        })
      );
    } else {
      setPagination((prevState) => ({ ...prevState, visible: true }));
    }
  };

  // 单页显示数量不能太多，除非是无限滚动
  const changePageSize = (size: number) => {
    if (size <= conf.filters.pageSizeMin) {
      setPagination((prevState) => ({ ...prevState, pageSize: conf.filters.pageSizeMin }));
    } else if (size >= conf.filters.pageSizeMax) {
      setPagination((prevState) => ({ ...prevState, pageSize: conf.filters.pageSizeMax }));
    } else {
      setPagination((prevState) => ({ ...prevState, pageSize: size }));
    }
  };

  const changePage = (offset: number) => {
    if (offset <= 1) {
      setPagination((prevState) => ({ ...prevState, page: 1 }));
    } else if (offset >= pagination.pageCount) {
      setPagination((prevState) => ({ ...prevState, page: pagination.pageCount }));
    } else {
      setPagination((prevState) => ({ ...prevState, page: offset }));
    }
  };

  return (
    <div>
      <label className="label max-w-max cursor-pointer space-x-2">
        <span className="label-text text-xl font-bold">分页</span>
        <input
          type="checkbox"
          className="!toggle checked:bg-none"
          checked={pagination.visible}
          onChange={handleSwitch}
        />
      </label>
      <div className="w-[320px] space-y-4 rounded-md bg-white p-4 shadow-md">
        <div className="input-group input-group-sm h-11 w-full">
          <span>每页文章数量</span>
          <select
            value={pagination.pageSize}
            disabled={!pagination.visible}
            onChange={(e) => changePageSize(Number(e.target.value))}
            className="select select-bordered select-sm h-11 flex-1 leading-5 text-gray-500"
          >
            <option disabled>选择每页文章数量</option>
            {Array.from({ length: conf.filters.pageSizeMax }, (_, idx) =>
              idx % conf.filters.pageSizeMin === 0 ? idx + conf.filters.pageSizeMin : -1
            )
              .filter((o) => o > -1)
              .map((o) => (
                <option key={o}>{o}</option>
              ))}
          </select>
        </div>
        <label className="input-group input-group-sm h-11">
          <span>当前第</span>
          <input
            type="number"
            min={1}
            disabled={!pagination.visible}
            value={pagination.page}
            onChange={(e) => changePage(Number(e.target.value))}
            placeholder="请输入页码"
            className="input input-bordered input-sm h-11 w-10 flex-1"
          />
          <span>页</span>
        </label>
        <div className="btn-group grid grid-cols-4">
          <button
            className={cx('btn btn-outline btn-sm h-11')}
            disabled={pagination.page < 2 || !pagination.visible}
            onClick={() => changePage(1)}
          >
            首页
          </button>
          <button
            className="btn btn-outline btn-sm h-11"
            disabled={pagination.page < 2 || !pagination.visible}
            onClick={() => changePage(pagination.page - 1)}
          >
            上一页
          </button>
          <button
            className="btn btn-outline btn-sm h-11"
            disabled={pagination.page >= pagination.pageCount || !pagination.visible}
            onClick={() => changePage(pagination.page + 1)}
          >
            下一页
          </button>
          <button
            className="btn btn-outline btn-sm h-11"
            disabled={pagination.page >= pagination.pageCount || !pagination.visible}
            onClick={() => changePage(pagination.pageCount)}
          >
            尾页
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
