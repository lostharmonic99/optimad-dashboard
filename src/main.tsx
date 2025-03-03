import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';
import './index.css';

/**
 * Initializes the React application by mounting the App component to the DOM.
 */
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found. Ensure index.html has <div id="root">');
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);