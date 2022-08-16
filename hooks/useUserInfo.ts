import { useEffect, useState } from 'react';
import localStorage from 'utils/localStorage';
import { userLogin } from 'http/userinfo';
import { useAppContext } from 'store';
import conf from 'conf';
import queryClient from 'core/queryClient';

const useUserInfo = () => {
  const { userInfo, setUserInfo } = useAppContext();

  useEffect(() => {
    const info = localStorage.getValue('userInfo', conf.encrypt, conf.salt);
    if (info) {
      setUserInfo(info);
    }
  }, [setUserInfo]);

  const login = async (username: string, password: string) => {
    const data = await userLogin(username, password);
    localStorage.setValue('userInfo', data, conf.encrypt, conf.salt);
    setUserInfo(data);
  };

  const logout = async () => {
    await queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    localStorage.delValue('userInfo', conf.encrypt, conf.salt);
    setUserInfo(undefined);
  };

  return {
    userInfo,
    setUserInfo,
    login,
    logout,
  };
};

export default useUserInfo;
