import React, { useState } from 'react';
import { fetchNui } from '../../utils/fetchNui';

function VehiclesTab({ addLog }) {
  const [vehicleModel, setVehicleModel] = useState('adder');

  const popularVehicles = [
    { model: 'adder', name: 'Adder (Supercar)' },
    { model: 'zentorno', name: 'Zentorno (Supercar)' },
    { model: 't20', name: 'T20 (Supercar)' },
    { model: 'insurgent', name: 'Insurgent (Military)' },
    { model: 'police', name: 'Police Cruiser' },
    { model: 'police2', name: 'Police Buffalo' },
    { model: 'ambulance', name: 'Ambulance' },
    { model: 'fbi2', name: 'FBI SUV' },
  ];

  const handleSpawnVehicle = async () => {
    addLog('info', `Spawning ${vehicleModel}...`);
    await fetchNui('spawnVehicle', { model: vehicleModel });
    addLog('success', `Spawned ${vehicleModel}`);
  };

  const handleDeleteVehicle = async () => {
    addLog('info', 'Deleting current vehicle...');
    await fetchNui('deleteVehicle');
    addLog('success', 'Vehicle deleted');
  };

  const handleRepairVehicle = async () => {
    addLog('info', 'Repairing vehicle...');
    await fetchNui('repairVehicle');
    addLog('success', 'Vehicle repaired');
  };

  const handleFlipVehicle = async () => {
    addLog('info', 'Flipping vehicle...');
    await fetchNui('flipVehicle');
    addLog('success', 'Vehicle flipped');
  };

  const handleMaxUpgrades = async () => {
    addLog('info', 'Applying max upgrades...');
    await fetchNui('maxUpgrades');
    addLog('success', 'Max upgrades applied');
  };

  return (
    <div className="tab-content">
      <h2>Vehicle Management</h2>

      <div className="card">
        <h3>Spawn Vehicle</h3>
        <div className="form-group">
          <label>Vehicle Model</label>
          <select value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)}>
            {popularVehicles.map(v => (
              <option key={v.model} value={v.model}>{v.name}</option>
            ))}
          </select>
          <button className="test-btn" onClick={handleSpawnVehicle}>
            Spawn Vehicle
          </button>
        </div>

        <div className="form-group">
          <label>Custom Model</label>
          <input
            type="text"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            placeholder="Enter model name"
          />
        </div>
      </div>

      <div className="card">
        <h3>Vehicle Actions</h3>
        <div className="button-grid">
          <button className="test-btn" onClick={handleRepairVehicle}>
            Repair Vehicle
          </button>
          <button className="test-btn" onClick={handleFlipVehicle}>
            Flip Vehicle
          </button>
          <button className="test-btn" onClick={handleMaxUpgrades}>
            Max Upgrades
          </button>
          <button className="test-btn danger" onClick={handleDeleteVehicle}>
            Delete Vehicle
          </button>
        </div>
      </div>
    </div>
  );
}

export default VehiclesTab;
