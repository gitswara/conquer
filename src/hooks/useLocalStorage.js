import { useCallback } from 'react';

export function useLocalStorage(key) {
  const read = useCallback(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [key]);

  const write = useCallback(
    (value) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    [key]
  );

  const clear = useCallback(() => {
    window.localStorage.removeItem(key);
  }, [key]);

  return { read, write, clear };
}
