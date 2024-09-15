import React from 'react';

const Header = ({ handleLogout }) => {
  const support_username = localStorage.getItem('username');
  return (
    <div className="header">
      <h1>Dashboard de Suporte</h1>
      <span><b>Suporte Conectado:</b> {support_username}</span>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Header;
