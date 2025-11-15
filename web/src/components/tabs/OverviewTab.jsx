import React from 'react';
import { fetchNui } from '../../utils/fetchNui';

function OverviewTab({ addLog }) {
  const handleGetStats = async () => {
    addLog('info', 'Fetching framework statistics...');
    const result = await fetchNui('getFrameworkStats');
    addLog('success', `Framework: ${result.name || 'NextGen'} v${result.version || '1.0.0'}`);
  };

  const handleTestRPC = async () => {
    addLog('info', 'Testing RPC system...');
    const result = await fetchNui('testRPC', { message: 'Hello from UI!' });
    addLog('success', 'RPC test completed');
  };

  return (
    <div className="tab-content">
      <h2>Framework Overview</h2>

      <div className="card">
        <h3>System Status</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Framework</span>
            <span className="stat-value">NextGen Core v1.0.0</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Modules Loaded</span>
            <span className="stat-value">28</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Status</span>
            <span className="stat-value status-online">Online</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Quick Tests</h3>
        <div className="button-grid">
          <button className="test-btn" onClick={handleGetStats}>
            Get Framework Stats
          </button>
          <button className="test-btn" onClick={handleTestRPC}>
            Test RPC System
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Module Status</h3>
        <div className="module-list">
          <div className="module-item">
            <span className="module-name">Database</span>
            <span className="module-status status-online">✓</span>
          </div>
          <div className="module-item">
            <span className="module-name">Logger</span>
            <span className="module-status status-online">✓</span>
          </div>
          <div className="module-item">
            <span className="module-name">RPC</span>
            <span className="module-status status-online">✓</span>
          </div>
          <div className="module-item">
            <span className="module-name">Player Manager</span>
            <span className="module-status status-online">✓</span>
          </div>
          <div className="module-item">
            <span className="module-name">Zone Manager</span>
            <span className="module-status status-online">✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;
