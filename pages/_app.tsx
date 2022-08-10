import 'styles/index.scss';
import type { AppProps } from 'next/app';
import useBackgroundImageLazy from 'hooks/useBackgroundImageLazy';

function MyApp({ Component, pageProps }: AppProps) {
  // 背景图片懒加载，全局生效
  useBackgroundImageLazy();

  return <Component {...pageProps} />;
}

export default MyApp;
