/**
 * NextGen Demo - UI Controller
 * Handles NUI communication and UI state
 */

let isUIOpen = false;

// Register keybind to open UI
RegisterCommand('+ngdemo', () => {
  toggleUI();
}, false);

RegisterKeyMapping('+ngdemo', 'Open NextGen Demo UI', 'keyboard', 'F5');

// Toggle UI visibility
function toggleUI() {
  isUIOpen = !isUIOpen;
  SetNuiFocus(isUIOpen, isUIOpen);
  SendNUIMessage({
    action: 'setVisible',
    data: { visible: isUIOpen }
  });
}

// Close UI callback
RegisterNUICallback('closeUI', (data, cb) => {
  if (isUIOpen) {
    toggleUI();
  }
  cb({ ok: true });
});

// Handle ESC key to close UI
setTick(() => {
  if (isUIOpen) {
    // Disable controls while UI is open
    DisableControlAction(0, 1, true); // LookLeftRight
    DisableControlAction(0, 2, true); // LookUpDown
    DisableControlAction(0, 24, true); // Attack
    DisableControlAction(0, 25, true); // Aim
    DisableControlAction(0, 142, true); // MeleeAttackAlternate
    DisableControlAction(0, 106, true); // VehicleMouseControlOverride

    // Check for ESC key
    if (IsControlJustReleased(0, 322)) { // ESC key
      toggleUI();
    }
  }
});

// Framework Stats
RegisterNUICallback('getFrameworkStats', (data, cb) => {
  cb({
    ok: true,
    name: 'NextGen Core',
    version: '1.0.0',
    modules: 28,
    uptime: GetGameTimer()
  });
});

// RPC Test
RegisterNUICallback('testRPC', async (data, cb) => {
  console.log('RPC Test:', data.message);
  cb({ ok: true, response: 'RPC test successful' });
});

// Player Management
RegisterNUICallback('setPlayerHealth', (data, cb) => {
  const ped = PlayerPedId();
  SetEntityHealth(ped, data.health);
  cb({ ok: true });
});

RegisterNUICallback('setPlayerArmor', (data, cb) => {
  const ped = PlayerPedId();
  SetPedArmour(ped, data.armor);
  cb({ ok: true });
});

RegisterNUICallback('healPlayer', (data, cb) => {
  const ped = PlayerPedId();
  SetEntityHealth(ped, 200);
  SetPedArmour(ped, 100);
  cb({ ok: true });
});

RegisterNUICallback('revivePlayer', (data, cb) => {
  const ped = PlayerPedId();
  SetEntityHealth(ped, 200);
  ClearPedTasksImmediately(ped);
  cb({ ok: true });
});

RegisterNUICallback('teleportToWaypoint', (data, cb) => {
  const waypoint = GetFirstBlipInfoId(8);
  if (!DoesBlipExist(waypoint)) {
    cb({ ok: false, error: 'No waypoint set' });
    return;
  }

  const coords = GetBlipInfoIdCoord(waypoint);
  const ped = PlayerPedId();

  SetPedCoordsKeepVehicle(ped, coords[0], coords[1], coords[2] + 50.0);
  cb({ ok: true });
});

// World Management
RegisterNUICallback('setWeather', (data, cb) => {
  SetWeatherTypeNowPersist(data.weather);
  cb({ ok: true });
});

RegisterNUICallback('setTime', (data, cb) => {
  NetworkOverrideClockTime(data.hour, 0, 0);
  cb({ ok: true });
});

RegisterNUICallback('freezeTime', (data, cb) => {
  // This would need to be implemented server-side for multiplayer
  cb({ ok: true });
});

RegisterNUICallback('setBlackout', (data, cb) => {
  SetArtificialLightsState(data.enabled);
  cb({ ok: true });
});

// Economy Management
RegisterNUICallback('addMoney', (data, cb) => {
  // This would need to be implemented server-side
  console.log(`Adding $${data.amount} to ${data.account}`);
  cb({ ok: true });
});

RegisterNUICallback('removeMoney', (data, cb) => {
  // This would need to be implemented server-side
  console.log(`Removing $${data.amount} from ${data.account}`);
  cb({ ok: true });
});

RegisterNUICallback('getBalance', (data, cb) => {
  // This would need to be implemented server-side
  cb({ ok: true, cash: 5000, bank: 25000 });
});

RegisterNUICallback('resetMoney', (data, cb) => {
  // This would need to be implemented server-side
  console.log('Resetting all accounts');
  cb({ ok: true });
});

// Vehicle Management
RegisterNUICallback('spawnVehicle', async (data, cb) => {
  const model = GetHashKey(data.model);

  if (!IsModelInCdimage(model) || !IsModelAVehicle(model)) {
    cb({ ok: false, error: 'Invalid vehicle model' });
    return;
  }

  RequestModel(model);
  while (!HasModelLoaded(model)) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const ped = PlayerPedId();
  const coords = GetEntityCoords(ped, false);
  const heading = GetEntityHeading(ped);

  const vehicle = CreateVehicle(model, coords[0] + 3, coords[1], coords[2], heading, true, false);
  SetPedIntoVehicle(ped, vehicle, -1);
  SetModelAsNoLongerNeeded(model);

  cb({ ok: true });
});

RegisterNUICallback('deleteVehicle', (data, cb) => {
  const ped = PlayerPedId();
  const vehicle = GetVehiclePedIsIn(ped, false);

  if (vehicle && vehicle !== 0) {
    DeleteVehicle(vehicle);
    cb({ ok: true });
  } else {
    cb({ ok: false, error: 'Not in a vehicle' });
  }
});

RegisterNUICallback('repairVehicle', (data, cb) => {
  const ped = PlayerPedId();
  const vehicle = GetVehiclePedIsIn(ped, false);

  if (vehicle && vehicle !== 0) {
    SetVehicleFixed(vehicle);
    SetVehicleDirtLevel(vehicle, 0.0);
    cb({ ok: true });
  } else {
    cb({ ok: false, error: 'Not in a vehicle' });
  }
});

RegisterNUICallback('flipVehicle', (data, cb) => {
  const ped = PlayerPedId();
  const vehicle = GetVehiclePedIsIn(ped, false);

  if (vehicle && vehicle !== 0) {
    const coords = GetEntityCoords(vehicle, false);
    const heading = GetEntityHeading(vehicle);
    SetEntityCoords(vehicle, coords[0], coords[1], coords[2] + 1.0, false, false, false, false);
    SetEntityRotation(vehicle, 0.0, 0.0, heading, 2, false);
    cb({ ok: true });
  } else {
    cb({ ok: false, error: 'Not in a vehicle' });
  }
});

RegisterNUICallback('maxUpgrades', (data, cb) => {
  const ped = PlayerPedId();
  const vehicle = GetVehiclePedIsIn(ped, false);

  if (vehicle && vehicle !== 0) {
    SetVehicleModKit(vehicle, 0);
    for (let i = 0; i < 50; i++) {
      const max = GetNumVehicleMods(vehicle, i) - 1;
      SetVehicleMod(vehicle, i, max, false);
    }
    ToggleVehicleMod(vehicle, 18, true); // Turbo
    ToggleVehicleMod(vehicle, 22, true); // Xenon
    cb({ ok: true });
  } else {
    cb({ ok: false, error: 'Not in a vehicle' });
  }
});

// Zone Management
RegisterNUICallback('createZone', (data, cb) => {
  const ped = PlayerPedId();
  const coords = GetEntityCoords(ped, false);

  console.log(`Creating zone "${data.name}" at [${coords[0]}, ${coords[1]}, ${coords[2]}] with radius ${data.radius}`);
  // This would need to be implemented with the zone-manager module
  cb({ ok: true });
});

RegisterNUICallback('deleteZone', (data, cb) => {
  console.log(`Deleting zone "${data.name}"`);
  // This would need to be implemented with the zone-manager module
  cb({ ok: true });
});

RegisterNUICallback('listZones', (data, cb) => {
  // This would need to be implemented with the zone-manager module
  cb({ ok: true, count: 5 });
});

RegisterNUICallback('testZoneEnter', (data, cb) => {
  console.log('Testing zone enter event');
  cb({ ok: true });
});

RegisterNUICallback('toggleZoneDebug', (data, cb) => {
  console.log('Toggling zone debug');
  cb({ ok: true });
});

// Admin Tools
RegisterNUICallback('kickPlayer', (data, cb) => {
  console.log(`Kicking player ${data.playerId}: ${data.reason}`);
  // This would need to be implemented server-side
  cb({ ok: true });
});

RegisterNUICallback('banPlayer', (data, cb) => {
  console.log(`Banning player ${data.playerId}: ${data.reason}`);
  // This would need to be implemented server-side
  cb({ ok: true });
});

RegisterNUICallback('freezeAllPlayers', (data, cb) => {
  console.log(`${data.freeze ? 'Freezing' : 'Unfreezing'} all players`);
  // This would need to be implemented server-side
  cb({ ok: true });
});

RegisterNUICallback('teleportToPlayer', (data, cb) => {
  console.log(`Teleporting to player ${data.playerId}`);
  // This would need to be implemented server-side
  cb({ ok: true });
});

RegisterNUICallback('bringPlayer', (data, cb) => {
  console.log(`Bringing player ${data.playerId}`);
  // This would need to be implemented server-side
  cb({ ok: true });
});

RegisterNUICallback('getPlayerList', (data, cb) => {
  // This would need to be implemented server-side
  cb({ ok: true, count: GetNumberOfPlayers() });
});

// Debug Tools
RegisterNUICallback('runPerformanceTest', (data, cb) => {
  console.log('Running performance test...');
  const startTime = GetGameTimer();

  // Simulate some work
  setTimeout(() => {
    const endTime = GetGameTimer();
    console.log(`Performance test completed in ${endTime - startTime}ms`);
    cb({ ok: true, time: endTime - startTime });
  }, 100);
});

// Helper to send logs to UI
function sendLogToUI(type, message) {
  SendNUIMessage({
    action: 'addLog',
    data: { type, message }
  });
}

// Export for other scripts
global.NGDemo = {
  toggleUI,
  sendLog: sendLogToUI
};

console.log('[NextGen Demo] UI Controller loaded');
