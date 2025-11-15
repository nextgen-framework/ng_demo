import React, { useState } from 'react';
import { fetchNui } from '../../utils/fetchNui';

function AdminTab({ addLog }) {
  const [playerId, setPlayerId] = useState(1);
  const [kickReason, setKickReason] = useState('');
  const [banReason, setBanReason] = useState('');

  const handleKickPlayer = async () => {
    addLog('info', `Kicking player ${playerId}...`);
    await fetchNui('kickPlayer', { playerId, reason: kickReason });
    addLog('success', `Player ${playerId} kicked`);
  };

  const handleBanPlayer = async () => {
    addLog('info', `Banning player ${playerId}...`);
    await fetchNui('banPlayer', { playerId, reason: banReason });
    addLog('success', `Player ${playerId} banned`);
  };

  const handleFreezePlayers = async (freeze) => {
    addLog('info', `${freeze ? 'Freezing' : 'Unfreezing'} all players...`);
    await fetchNui('freezeAllPlayers', { freeze });
    addLog('success', `All players ${freeze ? 'frozen' : 'unfrozen'}`);
  };

  const handleTeleportToPlayer = async () => {
    addLog('info', `Teleporting to player ${playerId}...`);
    await fetchNui('teleportToPlayer', { playerId });
    addLog('success', `Teleported to player ${playerId}`);
  };

  const handleBringPlayer = async () => {
    addLog('info', `Bringing player ${playerId}...`);
    await fetchNui('bringPlayer', { playerId });
    addLog('success', `Player ${playerId} brought to you`);
  };

  const handleGetPlayerList = async () => {
    addLog('info', 'Fetching player list...');
    const result = await fetchNui('getPlayerList');
    addLog('success', `${result.count || 0} players online`);
  };

  return (
    <div className="tab-content">
      <h2>Admin Tools</h2>

      <div className="card">
        <h3>Player Moderation</h3>
        <div className="form-group">
          <label>Player ID</label>
          <input
            type="number"
            value={playerId}
            onChange={(e) => setPlayerId(parseInt(e.target.value) || 1)}
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Kick Reason</label>
          <input
            type="text"
            value={kickReason}
            onChange={(e) => setKickReason(e.target.value)}
            placeholder="Enter kick reason"
          />
          <button className="test-btn danger" onClick={handleKickPlayer}>
            Kick Player
          </button>
        </div>

        <div className="form-group">
          <label>Ban Reason</label>
          <input
            type="text"
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            placeholder="Enter ban reason"
          />
          <button className="test-btn danger" onClick={handleBanPlayer}>
            Ban Player
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Player Management</h3>
        <div className="button-grid">
          <button className="test-btn" onClick={handleGetPlayerList}>
            Get Player List
          </button>
          <button className="test-btn" onClick={handleTeleportToPlayer}>
            Teleport to Player
          </button>
          <button className="test-btn" onClick={handleBringPlayer}>
            Bring Player
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Server Control</h3>
        <div className="button-grid">
          <button className="test-btn" onClick={() => handleFreezePlayers(true)}>
            Freeze All Players
          </button>
          <button className="test-btn" onClick={() => handleFreezePlayers(false)}>
            Unfreeze All Players
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminTab;
