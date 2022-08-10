import { useEffect } from 'react';
import { throttle } from 'lodash';

const useCarousel = () => {
  useEffect(() => {
    // 定时器
    let slideRun: NodeJS.Timer;

    // 初始化数据
    const initMonitor = () => {
      // 已经初始化，不再运行
      if (slideRun) return;

      let slideshow = document.getElementById('slideshow')!;
      let images = slideshow.getElementsByTagName('figure')!;
      let current = 0; // 当前活动的图片编号

      const slideOff = () => {
        images[current].className = ''; // 图片淡出
      };
      const slideOn = () => {
        images[current].className = 'active'; // 图片淡入
      };
      // 切换图片
      const changeSlide = () => {
        slideOff();
        current++;
        if (current >= images.length) current = 0;
        slideOn();
      };
      // 图片进入视口才执行动画
      images[0].className = 'active'; // 第一张图片，默认显示
      // 定时器
      slideRun = setInterval(changeSlide, 3000);
    };

    // 开始监听
    const startMonitor = () => {
      // 判断视口,取出第一个图片
      let image = document.querySelector('#slideshow figure');
      let imageObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            initMonitor();
            // 取消订阅
            imageObserver.unobserve(entry.target);
          }
        });
      });
      // 如果图片存在，订阅图片
      image && imageObserver.observe(image);
    };

    startMonitor();
    document.addEventListener('scroll', throttle(startMonitor, 300));
    window.addEventListener('resize', throttle(startMonitor, 300));
    window.removeEventListener('orientationChange', throttle(startMonitor, 300));

    return () => {
      slideRun && clearInterval(slideRun);
      document.removeEventListener('scroll', throttle(startMonitor, 300));
      window.removeEventListener('resize', throttle(startMonitor, 300));
      window.removeEventListener('orientationChange', throttle(startMonitor, 300));
    };
  }, []);
};

export default useCarousel;
