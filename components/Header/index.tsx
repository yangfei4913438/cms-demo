import NextLink from 'components/nextLink';
import { useState } from 'react';
import useUserInfo from 'hooks/useUserInfo';

const Header = () => {
  const [edit, setEdit] = useState<{ username: string; password: string }>({
    username: '',
    password: '',
  });

  const { userInfo, login, logout } = useUserInfo();

  const loginId = 'login-model';

  const handleLogin = async () => {
    const res = await login(edit.username, edit.password);
    if (res.status === 400) {
      alert(res.message);
    } else {
      setEdit({ username: '', password: '' });
    }
  };

  const handleLogout = async () => {
    await logout();
    setEdit({ username: '', password: '' });
  };

  return (
    <header className="w-full bg-gray-700 flex justify-between px-4 ">
      <NextLink href="/" className="py-3 text-white">
        <span className="text-2xl lowercase ">查询范例</span>
      </NextLink>
      <div className="h-full flex items-center gap-2 text-white">
        {userInfo ? (
          <label
            className="btn btn-ghost text-lg"
            onClick={async (e) => {
              e.preventDefault();
              await handleLogout();
            }}
          >
            注销
          </label>
        ) : (
          <label htmlFor={loginId} className="btn btn-ghost text-lg">
            登录
          </label>
        )}
      </div>

      <input type="checkbox" id={loginId} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box space-y-12">
          <div className="relative space-y-6">
            <div className="pt-2 text-center text-gray-600 text-2xl font-bold">用户登录</div>
            <label className="input-group flex">
              <span>用户账号</span>
              <input
                type="text"
                placeholder="请输入您的用户名或邮箱"
                value={edit.username}
                className="flex-1 input input-md input-bordered outline-none"
                onChange={(e) => {
                  setEdit((prev: any) => {
                    return {
                      ...prev,
                      username: e.target.value,
                    };
                  });
                }}
              />
            </label>
            <label className="input-group flex">
              <span>登录密码</span>
              <input
                type="password"
                placeholder="请输入您的登录密码"
                value={edit.password}
                className="flex-1 input input-md input-bordered outline-none"
                onChange={(e) => {
                  setEdit((prev: any) => {
                    return {
                      ...prev,
                      password: e.target.value,
                    };
                  });
                }}
              />
            </label>
          </div>
          <div className="modal-action space-x-4">
            <label htmlFor={loginId} className="btn" onClick={handleLogout}>
              取消登录
            </label>
            <label htmlFor={loginId} className="btn btn-primary" onClick={handleLogin}>
              点击登录
            </label>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
