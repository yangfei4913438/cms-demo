import NextLink from 'components/nextLink';
import { useState } from 'react';
import useUserInfo from 'hooks/useUserInfo';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import storage from 'utils/localStorage';

const Header = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { userInfo, login, logout } = useUserInfo();

  const [edit, setEdit] = useState<{ username: string; password: string }>({
    username: '',
    password: '',
  });

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

  const handleSwitch = async () => {
    if (router.locale === 'zh') {
      await router.replace(router.pathname, '', { locale: 'en', shallow: true }).then(() => {
        // 记录当前使用的语言，页面刷新不会丢失
        storage.setValue('lang', 'en');
      });
    } else {
      await router.replace(router.pathname, '', { locale: 'zh', shallow: true }).then(() => {
        // 记录当前使用的语言，页面刷新不会丢失
        storage.setValue('lang', 'zh');
      });
    }
  };

  return (
    <header className="flex w-full justify-between bg-gray-700 px-4 ">
      <NextLink href="/" className="py-3 text-white">
        <span className="text-2xl">Strapi 查询范例 {t('home.hi')}</span>
      </NextLink>
      <div className="flex h-full items-center gap-2 text-white">
        <label className="label max-w-max cursor-pointer space-x-2">
          <span className="label-text font-bold text-white">
            {router.locale === 'zh' ? '中文' : '英文'}
          </span>
          <input
            type="checkbox"
            className="!toggle !toggle-primary checked:bg-none"
            checked={router.locale === 'zh'}
            onChange={handleSwitch}
          />
        </label>
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
            <div className="pt-2 text-center text-2xl font-bold text-gray-600">用户登录</div>
            <label className="input-group flex">
              <span>用户账号</span>
              <input
                type="text"
                placeholder="请输入您的用户名或邮箱"
                value={edit.username}
                className="input input-bordered input-md flex-1 outline-none"
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
                className="input input-bordered input-md flex-1 outline-none"
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
