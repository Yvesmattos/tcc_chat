// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

function initialize(containerId) {
  ReactDOM.render(<App />, document.getElementById(containerId));
}

// Exponha a função de inicialização globalmente
window.MyApp = { initialize };
