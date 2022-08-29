import { useEffect } from 'react';
import localStorage from 'utils/localStore';
import { userLogin } from 'http/userinfo';
import { useAppContext } from 'store';
import conf from 'conf';

const useUserInfo = () => {
  const { userInfo, setUserInfo } = useAppContext();

  useEffect(() => {
    (async () => {
      const info = await localStorage.getValue('userInfo', conf.encrypt, conf.salt);
      if (info) {
        setUserInfo(info);
      }
    })();
  }, [setUserInfo]);

  const login = async (username: string, password: string) => {
    const data = await userLogin(username, password);
    if (data?.jwt) {
      await localStorage.setValue('userInfo', data, conf.encrypt, conf.salt);
      setUserInfo(data);
      return { status: 200 };
    }
    return { status: 400, message: data.error.message };
  };

  const logout = async () => {
    await localStorage.delValue('userInfo', conf.encrypt, conf.salt);
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
