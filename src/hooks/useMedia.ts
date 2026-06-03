import { useEffect, useState } from 'react';

export const useMedia = (query: string) => {
  const [state, setState] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);
    const handleChange = () => {
      if (!mounted) {
        return;
      }
      setState(!!mql.matches);
    };

    if (mql.addListener) {
      mql.addListener(handleChange);
    } else {
      mql.addEventListener('change', handleChange);
    }

    setState(mql.matches);

    return () => {
      mounted = false;
      if (mql.removeListener) {
        mql.removeListener(handleChange);
      } else {
        mql.removeEventListener('change', handleChange);
      }
    };
  }, [query]);

  return state;
};
