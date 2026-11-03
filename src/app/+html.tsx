import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// Color splash for the web/PWA. It is removed from _layout.tsx when the app is ready.
const splashCss = `
  #splash { position: fixed; inset: 0; z-index: 9999; background: #208AEF;
    display: flex; align-items: center; justify-content: center; }
  #splash img { width: 120px; height: 120px; border-radius: 28px; }
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#208AEF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Mi Sistema" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/icon-192-new.png" />

        <style dangerouslySetInnerHTML={{ __html: splashCss }} />
        <ScrollViewStyleReset />
      </head>

      <body>
        <div id="splash">
          <img src="/images/icon-192-new.png" alt="Mi Sistema" />
        </div>
        {children}
      </body>
    </html>
  );
}
