import React, { FC } from 'react';
import Link from 'next/link';

interface NextLinkProps {
  // 超链接
  href: string;
  // 自定义类名
  className?: string;
  // 是否当前页打开，默认当前页面打开
  self?: boolean;
  // title属性(seo权重1份)
  title?: string;
  // 点击事件
  onClick?: () => void;
  children?: React.ReactNode;
}

// 封装一下next提供的link组件，支持生产模式下的SEO
const NextLink: FC<NextLinkProps> = ({
  href,
  className,
  onClick,
  self = true,
  title = '',
  children,
}) => {
  return (
    <Link href={href} passHref>
      <a className={className} onClick={onClick} title={title} target={self ? '_self' : '_blank'}>
        {children}
      </a>
    </Link>
  );
};

export default NextLink;
