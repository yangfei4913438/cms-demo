import type { FC, ReactNode } from 'react';
import Header from 'components/Header';
import useUserInfo from 'hooks/useUserInfo';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { userInfo } = useUserInfo();
  const { t } = useTranslation();

  return (
    <main className="relative box-border flex h-screen w-screen flex-col overflow-hidden">
      <Header />
      {userInfo ? (
        children
      ) : (
        <div className="flex h-full w-full items-center justify-center text-3xl text-gray-500">
          {t('no_login_text')}
        </div>
      )}
    </main>
  );
};

export default Layout;
