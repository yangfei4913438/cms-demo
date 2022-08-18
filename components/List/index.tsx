import { type FC, useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'core/queryConsts';
import { getArticles } from 'http/articles';
import useUserInfo from 'hooks/useUserInfo';
import { useAppContext } from 'store/index';
import { formatTime } from 'utils/times';

const List: FC = () => {
  const { userInfo } = useUserInfo();
  const { list, setList, search, time } = useAppContext();

  const query = () => {
    let options = {};
    if (search) {
      options = { _q: search };
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
    return getArticles(userInfo?.jwt!, options).then(setList);
  };

  useQuery(queryKeys.filterArticles({ search, time }), query, {
    // 存在令牌才可以发起查询
    enabled: !!userInfo?.jwt,
  });

  return (
    <>
      {list?.length === 0 && (
        <div className="w-full h-full flex justify-center items-center text-3xl text-gray-500">
          🤣哎呀，没有数据显示哦～
        </div>
      )}
      <div className="space-y-8 p-6">
        {list?.map((row) => {
          return (
            <div
              className="w-full flex bg-white box-border overflow-hidden rounded-md shadow-md"
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
              <div className="flex-1 flex flex-col items-start justify-start p-6">
                <div className="h-10 text-2xl font-bold flex items-center">
                  <span className="overflow-hidden whitespace-nowrap overflow-ellipsis">
                    {row.title}
                  </span>
                </div>
                <div className="w-full flex-1 mt-2 text-gray-500">{row.description}</div>
                <div className="w-full flex justify-between items-center">
                  <div>{dayjs.utc(row.updatedAt).local().format('YYYY-MM-DD HH:mm:ss')}</div>
                  <button className="btn btn-sm btn-outline btn-ghost rounded-none px-8 text-gray-400 border-gray-300">
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
