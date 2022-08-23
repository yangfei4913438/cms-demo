import { ChangeEvent, useState } from 'react';
import cx from 'classnames';
import { useAppContext } from 'store';
import queryClient from 'core/queryClient';
import { queryKeys } from 'core/queryConsts';
import conf from 'conf';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';

const TimeRange = () => {
  const { t } = useTranslation();
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
      const initData: typeof time = { type: 'createdAt', start: null, end: null };
      setLocalTime(initData);
      await handleSearch(initData);
    } else {
      setVisible(true);
    }
  };

  return (
    <div>
      <label className="label max-w-max cursor-pointer space-x-2">
        <span className="label-text text-xl font-bold">{t('filter.time-range')}</span>
        <input
          type="checkbox"
          className="!toggle checked:bg-none"
          checked={visible}
          onChange={handleSwitch}
        />
      </label>

      <div className="flex flex-col space-y-4 rounded-md bg-white p-4 shadow-md">
        <label className="label -my-2 max-w-max cursor-pointer space-x-2">
          <span className="label-text text-lg font-bold">
            {t('filter.time-range.switch', {
              type: localTime.type === 'createdAt' ? t('created') : t('updated'),
            })}
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

        <DesktopDateTimePicker
          views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
          inputFormat="YYYY-MM-DD HH:mm:ss"
          label={t('filter.time-range.start')}
          minutesStep={5}
          closeOnSelect={true}
          ampm={false}
          disabled={!visible}
          value={localTime.start}
          onChange={(date) => {
            setLocalTime((prevState) => {
              return {
                ...prevState,
                start: date,
              };
            });
          }}
          renderInput={(params) => <TextField {...params} />}
        />

        <DesktopDateTimePicker
          views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
          inputFormat="YYYY-MM-DD HH:mm:ss"
          label={t('filter.time-range.end')}
          minutesStep={5}
          closeOnSelect={true}
          ampm={false}
          disabled={!visible}
          value={localTime.end}
          onChange={(date) => {
            console.log('xxxxx:', date);
            setLocalTime((prevState) => {
              return {
                ...prevState,
                end: date,
              };
            });
          }}
          renderInput={(params) => <TextField {...params} />}
        />

        <button
          className={cx('btn btn-sm h-10 w-32 capitalize')}
          disabled={!visible}
          onClick={handleQuery}
        >
          {t('filter.button')}
        </button>
      </div>
    </div>
  );
};

export default TimeRange;
