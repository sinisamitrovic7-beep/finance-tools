import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent third-party browser extensions (e.g. MetaMask inpage.js) from
// surfacing unrelated unhandled errors inside the Finance.Tools preview.
if (typeof window !== 'undefined') {
  const isExtensionOrigin = (text?: string) =>
    Boolean(
      text &&
        (text.includes('chrome-extension://') ||
          text.includes('moz-extension://') ||
          text.includes('Failed to connect to MetaMask'))
    );

  window.addEventListener(
    'error',
    (event) => {
      if (isExtensionOrigin(event.filename) || isExtensionOrigin(event.message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const reason = event.reason as {message?: string; stack?: string} | string | undefined;
      const msg = typeof reason === 'string' ? reason : reason?.message;
      const stack = typeof reason === 'string' ? undefined : reason?.stack;
      if (isExtensionOrigin(msg) || isExtensionOrigin(stack)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(<App />);
