import { useEffect } from 'react';

export type BodyTheme = 'app' | 'auth';

export function useBodyTheme(theme: BodyTheme) {
  useEffect(() => {
    document.body.dataset.theme = theme;
    return () => {
      delete document.body.dataset.theme;
    };
  }, [theme]);
}
