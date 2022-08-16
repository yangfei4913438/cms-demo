import 'styles/index.scss';
import type { AppProps } from 'next/app';
import { QueryClientProvider, Hydrate } from '@tanstack/react-query';
import useBackgroundImageLazy from 'hooks/useBackgroundImageLazy';
import queryClient from 'core/queryClient';
import { AppWrapper } from 'store';

function MyApp({ Component, pageProps }: AppProps) {
  // 背景图片懒加载，全局生效
  useBackgroundImageLazy();

  return (
    <AppWrapper>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </AppWrapper>
  );
}

export default MyApp;
