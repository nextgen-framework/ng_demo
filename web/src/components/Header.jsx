import React from 'react';

function Header({ onClose }) {
  return (
    <div className="header">
      <div className="header-title">
        <span className="header-icon">🎮</span>
        <h1>NextGen Framework Test UI</h1>
        <span className="version">v1.0.0</span>
      </div>
      <button className="close-btn" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}

export default Header;
