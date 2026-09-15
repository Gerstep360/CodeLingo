import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import { AccountProvider } from './account/AccountProvider';
import { App } from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AccountProvider><App /></AccountProvider>
    </HashRouter>
  </StrictMode>,
);
