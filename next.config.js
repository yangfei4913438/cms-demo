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

// 多语言配置
const i18n = {
  defaultLocale: 'zh-Hans', // 默认语言
  locales: ['zh-Hans', 'en'], // 可用的语言
  localeDetection: true, // 启用嗅探浏览器语言，加快语言检测速度
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
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
