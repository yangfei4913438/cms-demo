import { useEffect, useState } from 'react';
import classnames from 'classnames';

/**
 * 网格辅助线，默认不显示
 * 同时按下 ctrl + g 就可以显示、关闭，网格辅助线
 * */
const GridColumn = () => {
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const monitor = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'g') {
        setShowGrid(() => !showGrid);
      }
    };
    window.addEventListener('keyup', monitor);

    return () => {
      window.removeEventListener('keyup', monitor);
    };
  }, [showGrid]);

  return (
    <div
      className={classnames('pointer-events-none absolute top-0 left-0 bottom-0 right-0 flex justify-center', {
        hidden: !showGrid || process.env.NODE_ENV === 'production',
      })}
    >
      <section className="container fixed z-50 grid h-screen w-screen grid-cols-10 gap-16">
        {Array.from({ length: 10 }).map((_, idx) => {
          return <div className="bg-black bg-opacity-10" key={idx} />;
        })}
      </section>
    </div>
  );
};

export default GridColumn;
