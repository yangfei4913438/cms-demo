import React from 'react';
import Head from 'next/head';

interface IProps {
  // 页面标题
  title: string;
  // 页面描述
  description?: string;
  // 子节点
  children?: React.ReactNode;
}

// 页面头部内容
const PageHeader: React.FC<IProps> = ({ title, description, children }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="content-language" content="en,cn" />
      <meta name="msapplication-TileColor" content="#0055FF" />
      <meta name="theme-color" content="#ffffff" />
      <meta property="og:locale" content="zh_CN" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* 阻止大部分搜索引擎网页抓取工具将页面编入索引，禁止提交当前变更到主分支，仅仅用于测试环境！！！ */}
      {/*<meta name="robots" content="noindex" />*/}
      {/* 其他的页面头部代码 */}
      {children}
    </Head>
  );
};

export default PageHeader;
