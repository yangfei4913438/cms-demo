import { useEffect } from 'react';
import { throttle } from 'lodash';

const useBackgroundImageLazy = () => {
  const onImageLazyLoad = () => {
    let lazyLoadImages: NodeListOf<HTMLImageElement>;
    if ('IntersectionObserver' in window) {
      lazyLoadImages = document.querySelectorAll('.lazy');
      let imageObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            let image = entry.target;
            image.classList.remove('lazy');
            imageObserver.unobserve(image);
          }
        });
      });
      lazyLoadImages.forEach((image) => imageObserver.observe(image));
    } else {
      let lazyLoadThrottleTimeout: NodeJS.Timeout;
      lazyLoadImages = document.querySelectorAll('.lazy');

      const lazyLoad = () => {
        if (lazyLoadThrottleTimeout) {
          clearTimeout(lazyLoadThrottleTimeout);
        }
        lazyLoadThrottleTimeout = setTimeout(function () {
          let scrollTop = window.pageYOffset;
          lazyLoadImages.forEach(function (img) {
            if (img.offsetTop < window.innerHeight + scrollTop) {
              img.src = <string>img.dataset.src;
              img.classList.remove('lazy');
            }
          });
          if (lazyLoadImages.length == 0) {
            document.removeEventListener('scroll', throttle(lazyLoad, 300));
            window.removeEventListener('resize', throttle(lazyLoad, 300));
            window.removeEventListener('orientationChange', throttle(lazyLoad, 300));
          }
        }, 20);
      };

      document.addEventListener('scroll', throttle(lazyLoad, 300));
      window.addEventListener('resize', throttle(lazyLoad, 300));
      window.addEventListener('orientationChange', throttle(lazyLoad, 300));
    }
  };

  useEffect(() => {
    onImageLazyLoad();
    document.addEventListener('scroll', throttle(onImageLazyLoad, 300));
    window.addEventListener('resize', throttle(onImageLazyLoad, 300));
    window.addEventListener('orientationChange', throttle(onImageLazyLoad, 300));
    return () => {
      document.removeEventListener('scroll', throttle(onImageLazyLoad, 300));
      window.removeEventListener('resize', throttle(onImageLazyLoad, 300));
      window.removeEventListener('orientationChange', throttle(onImageLazyLoad, 300));
    };
  }, []);
};

export default useBackgroundImageLazy;
