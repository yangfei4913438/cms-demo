import React, { createContext, useContext, useState } from 'react';

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

export interface IStoreContext {
  userInfo?: IUserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo | undefined>>;
  list?: any[];
  setList: React.Dispatch<React.SetStateAction<any[] | undefined>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const StoreContext = createContext<IStoreContext>({
  setUserInfo: () => undefined,
  setList: () => undefined,
  search: '',
  setSearch: () => undefined,
});

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 用户信息，包含认证jwt
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  // 展示的列表
  const [list, setList] = useState<any[]>();
  // 搜索信息
  const [search, setSearch] = useState('');

  const state: IStoreContext = {
    userInfo,
    setUserInfo,
    list,
    setList,
    search,
    setSearch,
  };

  return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
};

export function useAppContext() {
  return useContext(StoreContext);
}
