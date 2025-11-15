import React, { useState } from 'react';
import { fetchNui } from '../../utils/fetchNui';

function WorldTab({ addLog }) {
  const [weather, setWeather] = useState('CLEAR');
  const [time, setTime] = useState(12);

  const weatherTypes = [
    'CLEAR', 'EXTRASUNNY', 'CLOUDS', 'OVERCAST',
    'RAIN', 'THUNDER', 'CLEARING', 'NEUTRAL',
    'SNOW', 'BLIZZARD', 'SNOWLIGHT', 'XMAS', 'FOGGY'
  ];

  const handleSetWeather = async () => {
    addLog('info', `Setting weather to ${weather}...`);
    await fetchNui('setWeather', { weather });
    addLog('success', `Weather set to ${weather}`);
  };

  const handleSetTime = async () => {
    addLog('info', `Setting time to ${time}:00...`);
    await fetchNui('setTime', { hour: time });
    addLog('success', `Time set to ${time}:00`);
  };

  const handleFreezeTime = async (freeze) => {
    addLog('info', `${freeze ? 'Freezing' : 'Unfreezing'} time...`);
    await fetchNui('freezeTime', { freeze });
    addLog('success', `Time ${freeze ? 'frozen' : 'unfrozen'}`);
  };

  const handleBlackout = async (enabled) => {
    addLog('info', `${enabled ? 'Enabling' : 'Disabling'} blackout...`);
    await fetchNui('setBlackout', { enabled });
    addLog('success', `Blackout ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="tab-content">
      <h2>World Management</h2>

      <div className="card">
        <h3>Weather Control</h3>
        <div className="form-group">
          <label>Weather Type</label>
          <select value={weather} onChange={(e) => setWeather(e.target.value)}>
            {weatherTypes.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          <button className="test-btn" onClick={handleSetWeather}>
            Set Weather
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Time Control</h3>
        <div className="form-group">
          <label>Time: {time}:00</label>
          <input
            type="range"
            min="0"
            max="23"
            value={time}
            onChange={(e) => setTime(parseInt(e.target.value))}
          />
          <button className="test-btn" onClick={handleSetTime}>
            Set Time
          </button>
        </div>

        <div className="button-grid">
          <button className="test-btn" onClick={() => handleFreezeTime(true)}>
            Freeze Time
          </button>
          <button className="test-btn" onClick={() => handleFreezeTime(false)}>
            Unfreeze Time
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Special Effects</h3>
        <div className="button-grid">
          <button className="test-btn" onClick={() => handleBlackout(true)}>
            Enable Blackout
          </button>
          <button className="test-btn" onClick={() => handleBlackout(false)}>
            Disable Blackout
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorldTab;
