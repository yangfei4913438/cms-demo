import NextLink from 'components/nextLink';

const Header = () => {
  return (
    <header className="w-full bg-gray-700 flex justify-between px-4 text-white">
      <NextLink href="/" className="py-3">
        <span className="text-2xl lowercase ">查询范例</span>
      </NextLink>
      <div className="h-full flex items-center gap-2">
        <button className="btn btn-ghost">登录</button>
        <button className="btn btn-ghost">注册</button>
      </div>
    </header>
  );
};

export default Header;
