import 'react-i18next';

// 数据结构使用中文的，这样提示也是中文的
import home from 'public/locales/zh/home.json';
import ui from 'public/locales/zh/ui.json';

declare module 'react-i18next' {
  // 这个接口名称不能改！
  interface CustomTypeOptions {
    // 自定义资源类型
    resources: {
      home: typeof home;
      ui: typeof ui;
    };
  }
}
