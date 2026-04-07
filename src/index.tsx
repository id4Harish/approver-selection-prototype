import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { ThemeProvider } from '@fluentui/react';
import App from './App';
import './index.css';

initializeIcons();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
