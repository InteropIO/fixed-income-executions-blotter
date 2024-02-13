import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { IOConnectProvider } from '@interopio/react-hooks';
import IOWorkspaces from '@interopio/workspaces-api';
import IOConnectBrowserFactory from '@interopio/browser';
import IOConnectDesktopFactoryFunction from '@interopio/desktop';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <IOConnectProvider
      settings={{
        browser: {
          config: { libraries: [IOWorkspaces] },
          factory: IOConnectBrowserFactory,
        },
        desktop: {
          config: { libraries: [IOWorkspaces] },
          factory: IOConnectDesktopFactoryFunction,
        },
      }}
    >
      <App />
    </IOConnectProvider>
  </StrictMode>,
);
