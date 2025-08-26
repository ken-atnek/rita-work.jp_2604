import { useEffect, useRef, useState } from 'react';

export const useScrollTrigger = <T extends HTMLElement = HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -100px 0px', // ← 下から100px以内に入ったら発火！
        threshold: 0, // 要素の "ごく一部" が入ればOK
      }
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

  return { ref, isVisible };
};
