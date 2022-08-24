import { useEffect } from 'react';
import { useRouter } from 'next/router';
import storage from 'utils/localStorage';

const useLanguageInit = () => {
  const router = useRouter();

  useEffect(() => {
    const locale = storage.getValue('lang');
    // 如果存在语言，就应用存储的语言
    if (locale) {
      router.replace(router.pathname, router.asPath, { locale: locale, scroll: false });
    }
  }, []);
};

export default useLanguageInit;
