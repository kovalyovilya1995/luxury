import { useState, useEffect, RefObject } from 'react';

const pixelsToEnd = 21;

export function useElementScroll(
  elementRef: RefObject<HTMLDivElement>,
  trigger?: boolean
) {
  const [scrollPosition, setScrollPosition] = useState({
    scrollX: 0,
    scrollY: 0,
    isAtTop: true,
    isAtBottom: false,
    hasScrollbar: false,
    isEndVisible: false,
  });

  useEffect(() => {
    setTimeout(() => {
      elementRef.current?.dispatchEvent(new CustomEvent('scroll'));
    }, 550);
  }, [trigger, elementRef]);

  useEffect(() => {
    const targetElement = elementRef.current;

    function handleScroll() {
      const scrollHeight = targetElement ? targetElement.scrollHeight : 0;
      const scrollTop = targetElement ? targetElement.scrollTop : 0;
      const isAtTop = scrollTop <= 0;
      const clientHeight = targetElement ? targetElement.clientHeight : 0;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 1;
      const isEndVisible =
        scrollHeight - scrollTop <= clientHeight + 1 + pixelsToEnd;
      const hasScrollbar = scrollHeight > clientHeight;

      setScrollPosition({
        scrollX: targetElement?.scrollLeft || 0,
        scrollY: targetElement?.scrollTop || 0,
        isAtTop,
        isAtBottom,
        hasScrollbar,
        isEndVisible,
      });
    }

    if (targetElement) {
      handleScroll();
      targetElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (targetElement) {
        targetElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [elementRef]);

  return scrollPosition;
}
