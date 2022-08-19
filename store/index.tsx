import React, { createContext, useContext, useState } from 'react';
import conf from 'conf';

interface IUserInfo {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface ITime {
  type: 'createdAt' | 'updatedAt';
  start: string;
  end: string;
}

interface ISort {
  name: ArticleSortType;
  sort: 'asc' | 'desc';
}

interface IPagination {
  visible: boolean;
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface IStoreContext {
  userInfo?: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo | undefined>>;
  list?: Articles[];
  setList: React.Dispatch<React.SetStateAction<any[] | undefined>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  time: ITime;
  setTime: React.Dispatch<React.SetStateAction<ITime>>;
  sort: ISort[];
  setSort: React.Dispatch<React.SetStateAction<ISort[]>>;
  pagination: IPagination;
  setPagination: React.Dispatch<React.SetStateAction<IPagination>>;
}

const initData: IStoreContext = {
  setUserInfo: () => undefined,
  setList: () => undefined,
  search: '',
  setSearch: () => undefined,
  time: { type: 'createdAt', start: '', end: '' },
  setTime: () => undefined,
  sort: [],
  setSort: () => undefined,
  pagination: {
    visible: conf.filters.pagination,
    page: 1,
    pageSize: conf.filters.pageSizeMin,
    pageCount: 2,
    total: conf.filters.pageSizeMax,
  },
  setPagination: () => undefined,
};

const StoreContext = createContext<IStoreContext>(initData);

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 用户信息，包含认证jwt
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  // 展示的列表
  const [list, setList] = useState<Articles[]>();
  // 搜索信息
  const [search, setSearch] = useState<string>(initData.search);
  // 时间信息
  const [time, setTime] = useState<ITime>(initData.time);
  // 排序对象
  const [sort, setSort] = useState<ISort[]>(initData.sort);
  // 分页数据
  const [pagination, setPagination] = useState<IPagination>(initData.pagination);

  const state: IStoreContext = {
    userInfo,
    setUserInfo,
    list,
    setList,
    search,
    setSearch,
    time,
    setTime,
    sort,
    setSort,
    pagination,
    setPagination,
  };

  return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
};

export function useAppContext() {
  return useContext(StoreContext);
}
