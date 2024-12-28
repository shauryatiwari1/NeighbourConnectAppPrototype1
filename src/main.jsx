import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Ensure the correct path
import './index.css'; // Optional: your CSS file

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
