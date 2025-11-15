import React, { useState } from 'react';
import { fetchNui } from '../../utils/fetchNui';

function ZonesTab({ addLog }) {
  const [zoneName, setZoneName] = useState('test_zone');
  const [zoneRadius, setZoneRadius] = useState(50);

  const handleCreateZone = async () => {
    addLog('info', `Creating zone "${zoneName}"...`);
    await fetchNui('createZone', { name: zoneName, radius: zoneRadius });
    addLog('success', `Zone "${zoneName}" created`);
  };

  const handleDeleteZone = async () => {
    addLog('info', `Deleting zone "${zoneName}"...`);
    await fetchNui('deleteZone', { name: zoneName });
    addLog('success', `Zone "${zoneName}" deleted`);
  };

  const handleListZones = async () => {
    addLog('info', 'Fetching zones...');
    const result = await fetchNui('listZones');
    addLog('success', `Found ${result.count || 0} zones`);
  };

  const handleTestZoneEnter = async () => {
    addLog('info', 'Testing zone enter event...');
    await fetchNui('testZoneEnter');
    addLog('success', 'Zone enter test completed');
  };

  const handleToggleDebug = async () => {
    addLog('info', 'Toggling zone debug...');
    await fetchNui('toggleZoneDebug');
    addLog('success', 'Zone debug toggled');
  };

  return (
    <div className="tab-content">
      <h2>Zone Management</h2>

      <div className="card">
        <h3>Create Zone</h3>
        <div className="form-group">
          <label>Zone Name</label>
          <input
            type="text"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            placeholder="Enter zone name"
          />
        </div>

        <div className="form-group">
          <label>Radius: {zoneRadius}m</label>
          <input
            type="range"
            min="10"
            max="200"
            value={zoneRadius}
            onChange={(e) => setZoneRadius(parseInt(e.target.value))}
          />
        </div>

        <button className="test-btn" onClick={handleCreateZone}>
          Create Zone at Current Position
        </button>
      </div>

      <div className="card">
        <h3>Zone Actions</h3>
        <div className="button-grid">
          <button className="test-btn" onClick={handleListZones}>
            List All Zones
          </button>
          <button className="test-btn" onClick={handleTestZoneEnter}>
            Test Zone Events
          </button>
          <button className="test-btn" onClick={handleToggleDebug}>
            Toggle Debug
          </button>
          <button className="test-btn danger" onClick={handleDeleteZone}>
            Delete Zone
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Predefined Zones</h3>
        <div className="zone-list">
          <div className="zone-item">
            <span>Legion Square</span>
            <button className="zone-btn" onClick={() => { setZoneName('legion_square'); handleDeleteZone(); }}>
              Delete
            </button>
          </div>
          <div className="zone-item">
            <span>Police Station</span>
            <button className="zone-btn" onClick={() => { setZoneName('police_station'); handleDeleteZone(); }}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ZonesTab;
