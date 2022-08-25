import { QueryClient } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  logger: {
    log: (...args) => {
      console.log('info:', args);
    },
    warn: (...args) => {
      console.warn('warning:', args);
    },
    error: (...args) => {
      console.error('error:', args);
    },
  },
  defaultOptions: {
    queries: {
      retry: 3, // 默认，异常重试三次
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 重试延时
      refetchOnMount: false,
      refetchOnWindowFocus: false, // 关闭页面聚焦重新请求
      enabled: true, // 默认开启网络请求
      keepPreviousData: false, // 默认每次都是新请求，不再使用前面的数据（分页或者无限滚动请求需要开启）
    },
  },
});

export default queryClient;
