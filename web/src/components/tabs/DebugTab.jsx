import React, { useEffect, useRef } from 'react';
import { fetchNui } from '../../utils/fetchNui';

function DebugTab({ addLog, debugLogs }) {
  const logContainerRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new logs are added
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [debugLogs]);

  const handleClearLogs = () => {
    addLog('info', 'Logs cleared');
  };

  const handleTestError = () => {
    addLog('error', 'This is a test error message');
  };

  const handleTestWarning = () => {
    addLog('warning', 'This is a test warning message');
  };

  const handleTestSuccess = () => {
    addLog('success', 'This is a test success message');
  };

  const handleRunPerformanceTest = async () => {
    addLog('info', 'Running performance test...');
    await fetchNui('runPerformanceTest');
    addLog('success', 'Performance test completed');
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'info':
      default: return 'ℹ️';
    }
  };

  return (
    <div className="tab-content">
      <h2>Debug Console</h2>

      <div className="card">
        <h3>Test Logging</h3>
        <div className="button-grid">
          <button className="test-btn" onClick={handleTestSuccess}>
            Test Success
          </button>
          <button className="test-btn" onClick={handleTestWarning}>
            Test Warning
          </button>
          <button className="test-btn" onClick={handleTestError}>
            Test Error
          </button>
          <button className="test-btn" onClick={handleRunPerformanceTest}>
            Performance Test
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Console Output</h3>
          <button className="clear-btn" onClick={handleClearLogs}>
            Clear Logs
          </button>
        </div>
        <div className="log-container" ref={logContainerRef}>
          {debugLogs.map((log, index) => (
            <div key={index} className={`log-entry log-${log.type}`}>
              <span className="log-icon">{getLogIcon(log.type)}</span>
              <span className="log-time">{formatTime(log.timestamp)}</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DebugTab;
