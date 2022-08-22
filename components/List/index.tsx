import { type FC, useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'core/queryConsts';
import { getArticles } from 'http/articles';
import useUserInfo from 'hooks/useUserInfo';
import { useAppContext } from 'store/index';
import { formatTime } from 'utils/times';
import { useRouter } from 'next/router';

const List: FC = () => {
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const { list, setList, search, time, sort, pagination, setPagination } = useAppContext();

  const query = () => {
    let options = {};
    if (pagination.visible) {
      options = {
        pagination: {
          page: pagination.page,
          pageSize: pagination.pageSize,
        },
      };
    }
    if (search) {
      options = { ...options, _q: search };
    }
    if (!!time.start && !!time.end) {
      const filters = {
        [time.type]: {
          $gte: formatTime(time.start),
          $lte: formatTime(time.end),
        },
      };
      options = {
        ...options,
        filters,
      };
    }
    if (sort.length) {
      options = {
        ...options,
        sort: sort.map((o) => `${o.name}:${o.sort}`),
      };
    }
    if (router.locale) {
      options = {
        ...options,
        locale: [router.locale === 'zh' ? 'zh-Hans' : 'en'],
      };
    }

    return getArticles(userInfo?.jwt!, options).then((res) => {
      setList(res.list);
      setPagination((prevState) => ({
        ...prevState,
        ...res.pagination,
        visible: prevState.visible,
        pageSize: prevState.pageSize,
      }));
    });
  };

  useQuery(
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
    }),
    query,
    {
      // 存在令牌才可以发起查询
      enabled: !!userInfo?.jwt,
    }
  );

  return (
    <>
      {list?.length === 0 && (
        <div className="flex h-full w-full items-center justify-center text-3xl text-gray-500">
          🤣哎呀，没有数据显示哦～
        </div>
      )}
      <div className="space-y-8 p-6">
        {list?.map((row) => {
          return (
            <div
              className="box-border flex w-full overflow-hidden rounded-md bg-white shadow-md"
              style={{ height: 220 }}
              key={row.id}
            >
              <div
                className="bg-cover bg-center"
                style={{
                  backgroundImage:
                    row.image.provider === 'local'
                      ? `url('http://localhost:1337${row.image.url}')`
                      : row.image.url,
                  width: 360,
                }}
              />
              <div className="flex flex-1 flex-col items-start justify-start p-6">
                <div className="flex h-10 items-center text-2xl font-bold">
                  <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {row.title}
                  </span>
                </div>
                <div className="mt-2 w-full flex-1 text-gray-500">{row.description}</div>
                <div className="flex w-full items-center justify-between">
                  <div>{dayjs.utc(row.updatedAt).local().format('YYYY-MM-DD HH:mm:ss')}</div>
                  <button className="btn btn-outline btn-ghost btn-sm rounded-none border-gray-300 px-8 text-gray-400">
                    了解更多
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default List;
