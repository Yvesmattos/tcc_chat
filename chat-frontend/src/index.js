import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

function initialize(containerId) {
  const container = document.getElementById(containerId);
  const root = createRoot(container);
  root.render(<App />);
}

// Exponha a função de inicialização globalmente
window.MyApp = { initialize };
