import React, { useState } from 'react';
import { fetchNui } from '../../utils/fetchNui';

function PlayerTab({ addLog }) {
  const [health, setHealth] = useState(100);
  const [armor, setArmor] = useState(0);

  const handleSetHealth = async () => {
    addLog('info', `Setting health to ${health}...`);
    await fetchNui('setPlayerHealth', { health });
    addLog('success', `Health set to ${health}`);
  };

  const handleSetArmor = async () => {
    addLog('info', `Setting armor to ${armor}...`);
    await fetchNui('setPlayerArmor', { armor });
    addLog('success', `Armor set to ${armor}`);
  };

  const handleHealPlayer = async () => {
    addLog('info', 'Healing player...');
    await fetchNui('healPlayer');
    setHealth(100);
    addLog('success', 'Player healed');
  };

  const handleRevivePlayer = async () => {
    addLog('info', 'Reviving player...');
    await fetchNui('revivePlayer');
    addLog('success', 'Player revived');
  };

  const handleTeleportWaypoint = async () => {
    addLog('info', 'Teleporting to waypoint...');
    await fetchNui('teleportToWaypoint');
    addLog('success', 'Teleported to waypoint');
  };

  return (
    <div className="tab-content">
      <h2>Player Management</h2>

      <div className="card">
        <h3>Health & Armor</h3>
        <div className="form-group">
          <label>Health: {health}</label>
          <input
            type="range"
            min="0"
            max="200"
            value={health}
            onChange={(e) => setHealth(parseInt(e.target.value))}
          />
          <button className="test-btn" onClick={handleSetHealth}>
            Set Health
          </button>
        </div>

        <div className="form-group">
          <label>Armor: {armor}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={armor}
            onChange={(e) => setArmor(parseInt(e.target.value))}
          />
          <button className="test-btn" onClick={handleSetArmor}>
            Set Armor
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <div className="button-grid">
          <button className="test-btn" onClick={handleHealPlayer}>
            Heal Player
          </button>
          <button className="test-btn" onClick={handleRevivePlayer}>
            Revive Player
          </button>
          <button className="test-btn" onClick={handleTeleportWaypoint}>
            Teleport to Waypoint
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayerTab;
