/**
 * Target System Demo
 * Demonstrates all features of the target module
 */

const framework = exports['ng-core'].GetFramework();
let target = null;

// Demo vehicles spawned for testing
const demoVehicles = [];

// Wait for framework to be ready
setImmediate(async () => {
  while (!framework.isReady()) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  target = framework.getModule('target');
  if (!target) {
    console.error('[Target Demo] Target module not found!');
    return;
  }

  console.log('[Target Demo] Initializing target demonstrations...');

  setupTargetDemos();
  setupDemoCommands();
});

/**
 * Setup all target demonstrations
 */
function setupTargetDemos() {
  // Demo 1: Vehicle Interactions
  setupVehicleDemo();

  // Demo 2: Ped Interactions
  setupPedDemo();

  // Demo 3: Object Interactions
  setupObjectDemo();

  // Demo 4: Zone Interactions
  setupZoneDemo();

  // Demo 5: Entity Type Interactions
  setupEntityTypeDemo();

  console.log('[Target Demo] All target demos setup complete!');
}

/**
 * Demo 1: Vehicle-specific interactions
 */
function setupVehicleDemo() {
  // Target specific vehicle models
  target.addModel(['adder', 'zentorno', 't20'], [
    {
      label: 'Open Trunk',
      icon: 'car',
      distance: 2.5,
      canInteract: (entity) => {
        // Check if vehicle is unlocked (simplified)
        return true;
      },
      onSelect: (entity) => {
        const plate = GetVehicleNumberPlateText(entity);
        console.log(`[Target Demo] Opening trunk of vehicle: ${plate}`);

        // Visual feedback
        SetVehicleDoorOpen(entity, 5, false, false); // Open trunk

        setTimeout(() => {
          SetVehicleDoorShut(entity, 5, false);
        }, 3000);

        emit('chat:addMessage', {
          args: ['Target Demo', `Opened trunk of ${GetDisplayNameFromVehicleModel(GetEntityModel(entity))}`]
        });
      }
    },
    {
      label: 'Check Fuel',
      icon: 'gas-pump',
      distance: 2.0,
      onSelect: (entity) => {
        const fuel = Math.floor(Math.random() * 100);
        emit('chat:addMessage', {
          args: ['Target Demo', `Fuel level: ${fuel}%`]
        });
      }
    }
  ]);

  console.log('[Target Demo] Vehicle interactions registered');
}

/**
 * Demo 2: Ped interactions
 */
function setupPedDemo() {
  // All peds have these options
  target.addEntityType('ped', [
    {
      label: 'Greet',
      icon: 'hand-wave',
      distance: 2.0,
      canInteract: (entity) => {
        // Don't interact with player ped
        return entity !== PlayerPedId();
      },
      onSelect: (entity) => {
        console.log('[Target Demo] Greeting ped:', entity);

        // Make ped look at player
        const playerPed = PlayerPedId();
        const playerCoords = GetEntityCoords(playerPed, true);
        TaskTurnPedToFaceCoord(entity, playerCoords[0], playerCoords[1], playerCoords[2], 1000);

        emit('chat:addMessage', {
          args: ['Target Demo', 'You greeted the person!']
        });
      }
    },
    {
      label: 'Ask for Directions',
      icon: 'map',
      distance: 2.5,
      canInteract: (entity) => {
        return entity !== PlayerPedId();
      },
      onSelect: (entity) => {
        const responses = [
          'Turn left at the next corner',
          'I\'m not from around here',
          'Sorry, I\'m in a hurry!',
          'The bank is two blocks that way'
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];

        emit('chat:addMessage', {
          args: ['Citizen', response]
        });
      }
    }
  ]);

  console.log('[Target Demo] Ped interactions registered');
}

/**
 * Demo 3: Object interactions
 */
function setupObjectDemo() {
  // ATM machines (prop example)
  target.addModel(['prop_atm_01', 'prop_atm_02', 'prop_atm_03'], [
    {
      label: 'Use ATM',
      icon: 'dollar-sign',
      distance: 1.5,
      onSelect: (entity) => {
        console.log('[Target Demo] Using ATM');

        emit('chat:addMessage', {
          args: ['Target Demo', 'Opening ATM... (This would open the banking UI)']
        });

        // This would normally open a UI
        setTimeout(() => {
          emit('chat:addMessage', {
            args: ['ATM', 'Your balance: $10,000']
          });
        }, 1000);
      }
    }
  ]);

  // Dumpsters
  target.addModel(['prop_dumpster_01a', 'prop_dumpster_02a'], [
    {
      label: 'Search Dumpster',
      icon: 'trash',
      distance: 2.0,
      onSelect: (entity) => {
        emit('chat:addMessage', {
          args: ['Target Demo', 'Searching dumpster...']
        });

        setTimeout(() => {
          const items = ['Empty Can', 'Old Newspaper', 'Nothing useful'];
          const found = items[Math.floor(Math.random() * items.length)];

          emit('chat:addMessage', {
            args: ['Search Result', `You found: ${found}`]
          });
        }, 2000);
      }
    }
  ]);

  console.log('[Target Demo] Object interactions registered');
}

/**
 * Demo 4: Zone-based interactions
 */
function setupZoneDemo() {
  const zoneManager = framework.getModule('zone-manager');
  if (!zoneManager) {
    console.warn('[Target Demo] Zone manager not available, skipping zone demo');
    return;
  }

  // Create a demo zone at Legion Square
  const demoZone = {
    name: 'target_demo_bank',
    type: 'sphere',
    coords: { x: 150.0, y: -1040.0, z: 29.37 },
    radius: 3.0,
    data: {
      label: 'Demo Bank Zone'
    }
  };

  zoneManager.registerZone(demoZone);

  // Add target options for this zone
  target.addZone('target_demo_bank', [
    {
      label: 'Open Bank Menu',
      icon: 'university',
      canInteract: () => {
        // Could check if player has ID, time of day, etc.
        return true;
      },
      onSelect: () => {
        emit('chat:addMessage', {
          args: ['Target Demo', 'Opening bank menu... (Zone interaction)']
        });

        console.log('[Target Demo] Bank zone interaction triggered');
      }
    },
    {
      label: 'Talk to Teller',
      icon: 'user',
      onSelect: () => {
        emit('chat:addMessage', {
          args: ['Bank Teller', 'How can I help you today?']
        });
      }
    }
  ]);

  console.log('[Target Demo] Zone interactions registered at Legion Square bank');
}

/**
 * Demo 5: Entity type interactions
 */
function setupEntityTypeDemo() {
  // All vehicles get these options
  target.addEntityType('vehicle', [
    {
      label: 'Get In Vehicle',
      icon: 'car-side',
      distance: 3.0,
      canInteract: (entity) => {
        // Check if player is not already in a vehicle
        return !IsPedInAnyVehicle(PlayerPedId(), false);
      },
      onSelect: (entity) => {
        const playerPed = PlayerPedId();

        // Find closest vehicle seat
        for (let i = -1; i < 8; i++) {
          if (IsVehicleSeatFree(entity, i)) {
            TaskEnterVehicle(playerPed, entity, 2000, i, 1.0, 1, 0);

            emit('chat:addMessage', {
              args: ['Target Demo', `Getting into vehicle (seat ${i})`]
            });
            break;
          }
        }
      }
    }
  ]);

  // All objects can be examined
  target.addEntityType('object', [
    {
      label: 'Examine Object',
      icon: 'search',
      distance: 2.0,
      onSelect: (entity) => {
        const model = GetEntityModel(entity);
        const coords = GetEntityCoords(entity, true);

        emit('chat:addMessage', {
          args: ['Target Demo', `Object Model: ${model} at [${coords[0].toFixed(2)}, ${coords[1].toFixed(2)}, ${coords[2].toFixed(2)}]`]
        });
      }
    }
  ]);

  console.log('[Target Demo] Entity type interactions registered');
}

/**
 * Setup demo commands
 */
function setupDemoCommands() {
  // Command to spawn a demo vehicle
  RegisterCommand('targetdemo', () => {
    const playerPed = PlayerPedId();
    const coords = GetEntityCoords(playerPed, true);
    const heading = GetEntityHeading(playerPed);

    // Spawn vehicle in front of player
    const forwardVector = GetEntityForwardVector(playerPed);
    const spawnCoords = {
      x: coords[0] + forwardVector[0] * 5.0,
      y: coords[1] + forwardVector[1] * 5.0,
      z: coords[2]
    };

    const modelHash = GetHashKey('adder');

    RequestModel(modelHash);
    while (!HasModelLoaded(modelHash)) {
      Wait(0);
    }

    const vehicle = CreateVehicle(modelHash, spawnCoords.x, spawnCoords.y, spawnCoords.z, heading, true, false);

    if (vehicle && DoesEntityExist(vehicle)) {
      SetVehicleOnGroundProperly(vehicle);
      SetEntityAsMissionEntity(vehicle, true, true);
      demoVehicles.push(vehicle);

      emit('chat:addMessage', {
        args: ['Target Demo', `Demo vehicle spawned! Point at it and press E to interact. Use /targetcleanup to remove.`]
      });

      console.log('[Target Demo] Spawned demo vehicle:', vehicle);
    }
  }, false);

  // Command to enable debug trace
  RegisterCommand('targettrace', () => {
    const currentState = target.config.enableTrace;
    target.setDebugTrace(!currentState);

    emit('chat:addMessage', {
      args: ['Target Demo', `Debug trace ${!currentState ? 'enabled' : 'disabled'}`]
    });
  }, false);

  // Command to cleanup demo vehicles
  RegisterCommand('targetcleanup', () => {
    let count = 0;

    demoVehicles.forEach(vehicle => {
      if (DoesEntityExist(vehicle)) {
        DeleteEntity(vehicle);
        count++;
      }
    });

    demoVehicles.length = 0;

    emit('chat:addMessage', {
      args: ['Target Demo', `Cleaned up ${count} demo vehicles`]
    });
  }, false);

  // Command to show demo info
  RegisterCommand('targetinfo', () => {
    emit('chat:addMessage', {
      args: ['=== Target Demo Info ===']
    });
    emit('chat:addMessage', {
      args: ['Commands', '/targetdemo - Spawn demo vehicle']
    });
    emit('chat:addMessage', {
      args: ['Commands', '/targettrace - Toggle debug trace']
    });
    emit('chat:addMessage', {
      args: ['Commands', '/targetcleanup - Remove demo vehicles']
    });
    emit('chat:addMessage', {
      args: ['Features', 'Point at vehicles, peds, objects and press E']
    });
    emit('chat:addMessage', {
      args: ['Features', 'Visit Legion Square bank for zone demo']
    });
    emit('chat:addMessage', {
      args: ['Features', 'Try ATMs, dumpsters, and other props']
    });
  }, false);

  console.log('[Target Demo] Commands registered: /targetdemo, /targettrace, /targetcleanup, /targetinfo');

  // Show info on startup
  setTimeout(() => {
    emit('chat:addMessage', {
      args: ['Target Demo', 'Target system demo loaded! Type /targetinfo for commands']
    });
  }, 2000);
}

// Cleanup on resource stop
on('onResourceStop', (resourceName) => {
  if (resourceName === GetCurrentResourceName()) {
    demoVehicles.forEach(vehicle => {
      if (DoesEntityExist(vehicle)) {
        DeleteEntity(vehicle);
      }
    });
  }
});
