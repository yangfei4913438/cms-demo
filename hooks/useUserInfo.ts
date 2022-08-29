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
    // 清空内存数据
    setUserInfo(undefined);
    // 登出后，清理所有的浏览器缓存数据，避免权限不足的用户，访问到需要更多权限的内容(能不能访问到数据，是cms后台控制的，前端无法判断。)
    await localStorage.clearData();
  };

  return {
    userInfo,
    setUserInfo,
    login,
    logout,
  };
};

export default useUserInfo;
