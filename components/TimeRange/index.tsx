import { ChangeEvent, useState } from 'react';
import cx from 'classnames';
import { useAppContext } from 'store';
import queryClient from 'core/queryClient';
import { queryKeys } from 'core/queryConsts';
import conf from 'conf';
import { useRouter } from 'next/router';

const TimeRange = () => {
  const router = useRouter();
  const { time, setTime, search, sort, pagination } = useAppContext();

  const [visible, setVisible] = useState(conf.filters.timeRange);
  const [localTime, setLocalTime] = useState(time);

  const handleSearch = async (stime: typeof time = localTime) => {
    setTime(stime);
    await queryClient.invalidateQueries(
      queryKeys.filterArticles({
        search,
        time: stime,
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
    if (!localTime.start || !localTime.end) return;
    await handleSearch();
  };

  const handleSwitch = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setVisible(false);
      const initData: typeof time = { type: 'createdAt', start: '', end: '' };
      setLocalTime(initData);
      await handleSearch(initData);
    } else {
      setVisible(true);
    }
  };

  return (
    <div>
      <label className="label max-w-max cursor-pointer space-x-2">
        <span className="label-text text-xl font-bold">时间范围筛选</span>
        <input
          type="checkbox"
          className="!toggle checked:bg-none"
          checked={visible}
          onChange={handleSwitch}
        />
      </label>

      <div className="rounded-md bg-white p-4 shadow-md">
        <label className="label max-w-max cursor-pointer space-x-2">
          <span className="label-text text-lg font-bold">
            使用 {localTime.type === 'createdAt' ? '创建' : '更新'} 时间
          </span>
          <input
            type="checkbox"
            disabled={!visible}
            className="!toggle !toggle-primary checked:bg-none"
            checked={localTime.type === 'createdAt'}
            onChange={(e) => {
              const isShow = e.target.checked;
              setLocalTime((prevState) => {
                return {
                  ...prevState,
                  type: isShow ? 'createdAt' : 'updatedAt',
                };
              });
            }}
          />
        </label>

        <label className="input-group">
          <span>开始</span>
          <input
            type="datetime-local"
            step={1}
            value={localTime.start}
            disabled={!visible}
            placeholder="请输入匹配关键字"
            className="input input-bordered"
            onChange={(e) => {
              setLocalTime((prevState) => {
                return {
                  ...prevState,
                  start: e.target.value,
                };
              });
            }}
          />
        </label>
        <label className="input-group mt-2">
          <span>结束</span>
          <input
            type="datetime-local"
            step={1}
            value={localTime.end}
            disabled={!visible}
            placeholder="请输入匹配关键字"
            className="input input-bordered"
            onChange={(e) => {
              setLocalTime((prevState) => {
                return {
                  ...prevState,
                  end: e.target.value,
                };
              });
            }}
          />
        </label>
        <button
          className={cx('btn btn-sm mt-4 h-10 w-32')}
          disabled={!visible}
          onClick={handleQuery}
        >
          筛选
        </button>
      </div>
    </div>
  );
};

export default TimeRange;
