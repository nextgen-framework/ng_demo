import React, { useState, useEffect } from 'react';
import { useNuiEvent } from './hooks/useNuiEvent';
import { fetchNui } from './utils/fetchNui';
import Header from './components/Header';
import TabNav from './components/TabNav';
import OverviewTab from './components/tabs/OverviewTab';
import PlayerTab from './components/tabs/PlayerTab';
import WorldTab from './components/tabs/WorldTab';
import EconomyTab from './components/tabs/EconomyTab';
import VehiclesTab from './components/tabs/VehiclesTab';
import ZonesTab from './components/tabs/ZonesTab';
import AdminTab from './components/tabs/AdminTab';
import DebugTab from './components/tabs/DebugTab';

const tabs = [
  { id: 'overview', label: '📊 Overview', component: OverviewTab },
  { id: 'player', label: '👤 Player', component: PlayerTab },
  { id: 'world', label: '🌍 World', component: WorldTab },
  { id: 'economy', label: '💰 Economy', component: EconomyTab },
  { id: 'vehicles', label: '🚗 Vehicles', component: VehiclesTab },
  { id: 'zones', label: '📍 Zones', component: ZonesTab },
  { id: 'admin', label: '⚙️ Admin', component: AdminTab },
  { id: 'debug', label: '🐛 Debug', component: DebugTab },
];

function App() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [debugLogs, setDebugLogs] = useState([
    { type: 'success', message: 'Framework initialized' },
    { type: 'info', message: '28 modules loaded' },
    { type: 'success', message: 'Test UI ready' },
  ]);

  // Listen for NUI messages
  useNuiEvent('setVisible', (data) => {
    setVisible(data.visible);
  });

  useNuiEvent('addLog', (data) => {
    setDebugLogs(prev => [...prev, { type: data.type || 'info', message: data.message, timestamp: new Date() }]);
  });

  // Handle ESC key
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && visible) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
    fetchNui('closeUI');
  };

  const addLog = (type, message) => {
    setDebugLogs(prev => [...prev, { type, message, timestamp: new Date() }]);
  };

  if (!visible) return null;

  const ActiveTabComponent = tabs.find(t => t.id === activeTab)?.component || OverviewTab;

  return (
    <div className="app">
      <div className="container">
        <Header onClose={handleClose} />

        <TabNav
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="content">
          <ActiveTabComponent addLog={addLog} debugLogs={debugLogs} />
        </div>
      </div>
    </div>
  );
}

export default App;
