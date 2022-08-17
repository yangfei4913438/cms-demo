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
}

const StoreContext = createContext<IStoreContext>({
  setUserInfo: () => undefined,
  setList: () => undefined,
});

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const [list, setList] = useState<any[]>();

  const state: IStoreContext = {
    userInfo,
    setUserInfo,
    list,
    setList,
  };

  return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
};

export function useAppContext() {
  return useContext(StoreContext);
}
