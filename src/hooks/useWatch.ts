import { useLayoutEffect, useRef } from 'react';

export const useWatch = (callback: () => void, dependencies: any[]) => {
  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      callback();
    }
  }, dependencies);
};
