import { useEffect } from 'react';
import { useRouter } from 'next/router';
import storage from 'utils/localStore';

const useLanguageInit = () => {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const locale = await storage.getValue('lang');
      // 如果存在语言，就应用存储的语言
      if (locale) {
        await router.replace(router.pathname, router.asPath, { locale: locale, scroll: false });
      }
    })();
  }, []);
};

export default useLanguageInit;
