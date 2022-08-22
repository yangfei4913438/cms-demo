const nextBuildId = require('next-build-id');
const path = require('path');

// 安全标头
const securityHeaders = [
  {
    // dns 预解析
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    // xss 防护
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    // 这可以防止允许用户上传和共享文件的网站的 XSS 攻击
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // 防止点击劫持攻击
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    // 推荐人策略
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 多语言配置
  // 官网文档
  // https://nextjs.org/docs/advanced-features/i18n-routing
  // UTS Locale Identifiers
  // https://www.unicode.org/reports/tr35/tr35-59/tr35.html#unicode_script_subtag_validity
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    // 关闭浏览器语言嗅探，避免和本地的语言切换逻辑冲突（默认先走这里的嗅探，然后才会是内部逻辑，如果两边值不一致就会出现进入页面就闪屏）
    localeDetection: false,
  },
  headers: async () => {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  // Small package to generate a consistent, git-based build id for your Next.js app when running next build on each server in a multi-server deployment.
  generateBuildId: () => nextBuildId({ dir: __dirname }),
  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      assets: path.resolve(__dirname, 'assets'),
      components: path.resolve(__dirname, 'components'),
      conf: path.resolve(__dirname, 'conf'),
      hooks: path.resolve(__dirname, 'hooks'),
      core: path.resolve(__dirname, 'core'),
      http: path.resolve(__dirname, 'http'),
      pages: path.resolve(__dirname, 'pages'),
      public: path.resolve(__dirname, 'public'),
      store: path.resolve(__dirname, 'store'),
      styles: path.resolve(__dirname, 'styles'),
      utils: path.resolve(__dirname, 'utils'),
    };
    return config;
  },
};

module.exports = nextConfig;
