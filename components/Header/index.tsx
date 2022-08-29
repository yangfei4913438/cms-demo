import NextLink from 'components/ui/nextLink';
import cx from 'classnames';
import { useState } from 'react';
import useUserInfo from 'hooks/useUserInfo';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import storage from 'utils/localStore';

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
      await router.replace(router.pathname, router.asPath, { locale: 'en', shallow: true }).then(async () => {
        // 记录当前使用的语言，页面刷新不会丢失
        await storage.setValue('lang', 'en');
      });
    } else {
      await router.replace(router.pathname, router.asPath, { locale: 'zh', shallow: true }).then(async () => {
        // 记录当前使用的语言，页面刷新不会丢失
        await storage.setValue('lang', 'zh');
      });
    }
  };

  return (
    <header className="flex w-full justify-between bg-gray-700 px-4 ">
      <NextLink href="/" className="py-3 text-white">
        <span className="text-2xl">Strapi {t('logo')}</span>
      </NextLink>
      <div className="flex h-full items-center gap-2 text-white">
        <label className="label max-w-max cursor-pointer space-x-2">
          <span className="label-text font-bold text-white">{router.locale === 'zh' ? '简体中文' : 'English'}</span>
          <input
            type="checkbox"
            className="!toggle !toggle-primary checked:bg-none"
            checked={router.locale === 'zh'}
            onChange={handleSwitch}
          />
        </label>
        {userInfo ? (
          <label
            className="btn btn-ghost text-lg capitalize"
            onClick={async (e) => {
              e.preventDefault();
              await handleLogout();
            }}
          >
            {t('logout')}
          </label>
        ) : (
          <label htmlFor={loginId} className="btn btn-ghost text-lg capitalize">
            {t('login')}
          </label>
        )}
      </div>

      <input type="checkbox" id={loginId} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box space-y-12">
          <div className="relative space-y-6">
            <div className="pt-2 text-center text-2xl font-bold text-gray-600">{t('login.window.title')}</div>
            <label className="input-group flex">
              <span className={cx(router.locale === 'en' && 'min-w-[145px]')}>{t('login.window.username')}</span>
              <input
                type="text"
                placeholder={t('login.window.username.placeholder')}
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
              <span className={cx(router.locale === 'en' && 'min-w-[145px]')}>{t('login.window.password')}</span>
              <input
                type="password"
                placeholder={t('login.window.password.placeholder')}
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
            <label htmlFor={loginId} className="btn capitalize" onClick={handleLogout}>
              {t('login.window.cancel')}
            </label>
            <label htmlFor={loginId} className="btn btn-primary capitalize" onClick={handleLogin}>
              {t('login.window.submit')}
            </label>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
