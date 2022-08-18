import { ChangeEvent, useState } from 'react';
import cx from 'classnames';
import { useAppContext } from 'store';
import queryClient from 'core/queryClient';
import { queryKeys } from 'core/queryConsts';

const TimeRange = () => {
  const { time, setTime, search } = useAppContext();

  const [visible, setVisible] = useState(true);
  const [localTime, setLocalTime] = useState(time);

  const handleSearch = async (stime: typeof time = localTime) => {
    setTime(stime);
    await queryClient.invalidateQueries(queryKeys.filterArticles({ search, time: stime }));
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
    <div className="space-y-3">
      <label className="label cursor-pointer max-w-max space-x-2">
        <span className="label-text font-bold text-xl">时间范围筛选</span>
        <input
          type="checkbox"
          className="!toggle checked:bg-none"
          checked={visible}
          onChange={handleSwitch}
        />
      </label>

      <div className="bg-white p-4 rounded-md shadow-md">
        <label className="label cursor-pointer max-w-max space-x-2">
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
          className={cx('btn btn-sm w-32 h-10 mt-4')}
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
