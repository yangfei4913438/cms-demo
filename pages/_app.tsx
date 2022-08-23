import 'styles/index.scss';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { appWithI18Next } from 'ni18n';
import type { AppProps } from 'next/app';
import { QueryClientProvider, Hydrate } from '@tanstack/react-query';
import useBackgroundImageLazy from 'hooks/useBackgroundImageLazy';
import queryClient from 'core/queryClient';
import { AppWrapper } from 'store';
import useLanguageInit from 'hooks/useLanguageInit';
import { ni18nConfig } from '../ni18n.config';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const MyApp = ({ Component, pageProps }: AppProps) => {
  // 背景图片懒加载，全局生效
  useBackgroundImageLazy();
  // 语言初始化
  useLanguageInit();

  const router = useRouter();

  useEffect(() => {
    if (router.locale === 'zh') {
      import('dayjs/locale/zh-cn').then(() => dayjs.locale('zh-cn'));
    }
    if (router.locale === 'en') {
      import('dayjs/locale/en').then(() => dayjs.locale('en'));
    }
  }, [router.locale]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AppWrapper>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
          </Hydrate>
        </QueryClientProvider>
      </AppWrapper>
    </LocalizationProvider>
  );
};

export default appWithI18Next(MyApp, ni18nConfig);
