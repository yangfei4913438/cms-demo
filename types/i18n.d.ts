import 'react-i18next';

// 数据结构使用中文的，这样提示也是中文的
import demo from 'public/locales/zh/demo.json';

declare module 'react-i18next' {
  // 这个接口名称不能改！
  interface CustomTypeOptions {
    // 自定义资源类型
    resources: {
      demo: typeof demo;
    };
  }
}
