// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Função de inicialização do React App
function initialize(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID ${containerId} not found.`);
    return;
  }
  const root = createRoot(container);
  root.render(<App />);
}

// Exponha a função de inicialização globalmente
window.MyApp = { initialize };
