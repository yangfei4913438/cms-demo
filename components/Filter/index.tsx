const Filter = () => {
  return (
    <aside className="z-1 w-52 min-w-max h-full bg-gray-300 shadow-[1px_2px_10px_1px_#050505]">
      <div className="p-6 gap-6">
        <div>
          <label className="label">
            <span className="label-text font-bold text-xl">模糊匹配</span>
          </label>
          <label className="input-group">
            <input type="text" placeholder="请输入匹配关键字" className="input input-bordered" />
            <button className="btn">搜索</button>
          </label>
        </div>
      </div>
    </aside>
  );
};

export default Filter;
