// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatModal from './components/ChatModal';
import SupportDashboard from './components/Support/SupportDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/support" element={<SupportDashboard />} />
        <Route path="/" element={<ChatModal />} />
      </Routes>
    </Router>
  );
};

export default App;
