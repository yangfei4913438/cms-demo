import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import storage from 'utils/localStore';

const useLanguageInit = () => {
  const router = useRouter();
  const { i18n } = useTranslation();

  useEffect(() => {
    (async () => {
      const locale = await storage.getValue('lang');
      // 如果存在语言，就应用存储的语言
      if (locale) {
        // 无页面刷新切换页面语言
        await i18n.changeLanguage(locale);
        // 无感知修改url, 更新当前页面的路径而不重新运行
        await router.push(router.pathname, router.asPath, { locale: locale, scroll: false });
      }
    })();
  }, []);
};

export default useLanguageInit;
