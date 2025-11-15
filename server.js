/**
 * NextGen Demo Plugin - Server Side
 * Complete demonstration of all framework features
 */

class DemoPlugin {
  constructor(framework, metadata) {
    this.framework = framework;
    this.metadata = metadata;
    this.playerData = new Map();
  }

  /**
   * Initialize the demo plugin
   */
  async init(framework, options) {
    // Banner is now displayed automatically by plugin manager

    // Demo 1: EventBus
    this.demoEventBus();

    // Demo 2: RPC System
    this.demoRPC();

    // Demo 3: Chat Commands
    this.demoChatCommands();

    // Demo 4: Player Management
    this.demoPlayerManagement();

    // Demo 5: Hooks
    this.demoHooks();

    console.log('[Demo Plugin] ✅ All features initialized');
  }

  /**
   * Demo 1: EventBus Usage
   */
  demoEventBus() {
    console.log('[Demo] Setting up EventBus demonstrations...');

    // Listen to framework events
    this.framework.eventBus.on('PLAYER_CONNECTED', (data) => {
      console.log(`[Demo EventBus] Player connected: ${data.name} (${data.source})`);
    });

    // Custom events
    this.framework.eventBus.on('DEMO_EVENT', (data) => {
      console.log('[Demo EventBus] Custom event received:', data);
    });

    // Emit a test event
    setTimeout(() => {
      this.framework.eventBus.emit('DEMO_EVENT', {
        message: 'EventBus is working!',
        timestamp: Date.now()
      });
    }, 2000);

    console.log('[Demo] ✅ EventBus setup complete');
  }

  /**
   * Demo 2: RPC System
   */
  demoRPC() {
    console.log('[Demo] Setting up RPC demonstrations...');

    // RPC 1: Get server info
    this.framework.rpc.register('demo:getServerInfo', (source) => {
      return {
        serverName: GetConvar('sv_hostname', 'Unknown'),
        players: GetNumPlayerIndices(),
        maxPlayers: GetConvarInt('sv_maxclients', 32),
        gametype: 'NextGen Demo',
        map: 'Los Santos'
      };
    });

    // RPC 2: Give player money (example)
    this.framework.rpc.register('demo:giveMoney', (source, amount) => {
      if (typeof amount !== 'number' || amount <= 0) {
        throw new Error('Invalid amount');
      }

      // Get or create player data
      let playerData = this.playerData.get(source) || { money: 0 };
      playerData.money += amount;
      this.playerData.set(source, playerData);

      console.log(`[Demo RPC] Gave $${amount} to player ${source}`);

      return {
        success: true,
        newBalance: playerData.money
      };
    });

    // RPC 3: Get player stats
    this.framework.rpc.register('demo:getPlayerStats', (source) => {
      const playerData = this.playerData.get(source) || { money: 0 };
      const player = this.framework.getPlayer(source);

      return {
        source: source,
        name: GetPlayerName(source),
        money: playerData.money,
        stateBag: player ? player.state : {}
      };
    });

    // RPC 4: Teleport player
    this.framework.rpc.register('demo:teleportPlayer', (source, x, y, z) => {
      const ped = GetPlayerPed(source);
      SetEntityCoords(ped, x, y, z, false, false, false, false);

      return { success: true, position: { x, y, z } };
    });

    console.log('[Demo] ✅ RPC handlers registered');
  }

  /**
   * Demo 3: Chat Commands
   */
  demoChatCommands() {
    const chatCommands = this.framework.getModule('chat-commands');
    if (!chatCommands) {
      console.log('[Demo] ⚠️ Chat commands module not loaded');
      return;
    }

    console.log('[Demo] Setting up chat commands...');

    // Command 1: Demo info
    chatCommands.register('demo', (source) => {
      chatCommands.sendMessage(source, '^3=== NextGen Demo Plugin ===');
      chatCommands.sendMessage(source, '^5Version: ^7' + this.metadata.version);
      chatCommands.sendMessage(source, '^5Features:');
      this.metadata.features.forEach(feature => {
        chatCommands.sendMessage(source, `  ^2✓ ^7${feature}`);
      });
      chatCommands.sendMessage(source, '^7Try: ^5/demomoney ^7or ^5/demoteleport');
    }, {
      description: 'Show demo plugin information',
      aliases: ['demoinfo']
    });

    // Command 2: Give money
    chatCommands.register('demomoney', (source, args) => {
      const amount = parseInt(args[0]) || 1000;
      const result = this.framework.rpc.callClient('demo:receiveMoney', source, amount)
        .catch(() => null);

      const playerData = this.playerData.get(source) || { money: 0 };
      playerData.money += amount;
      this.playerData.set(source, playerData);

      chatCommands.sendMessage(source, `^2+$${amount}^7 | Balance: ^2$${playerData.money}`);
    }, {
      description: 'Give yourself money (demo)',
      usage: '/demomoney [amount]'
    });

    // Command 3: Teleport locations
    chatCommands.register('demoteleport', (source, args) => {
      const locations = {
        'ls': { x: -275.0, y: -957.0, z: 31.2, name: 'Legion Square' },
        'airport': { x: -1037.0, y: -2737.0, z: 20.2, name: 'Airport' },
        'pier': { x: -1686.0, y: -1072.0, z: 13.0, name: 'Del Perro Pier' },
        'mount': { x: 501.0, y: 5604.0, z: 797.0, name: 'Mount Chiliad' }
      };

      const locationKey = args[0]?.toLowerCase();
      const location = locations[locationKey];

      if (!location) {
        chatCommands.sendMessage(source, '^1Usage: ^7/demoteleport <location>');
        chatCommands.sendMessage(source, '^5Locations: ^7' + Object.keys(locations).join(', '));
        return;
      }

      const ped = GetPlayerPed(source);
      SetEntityCoords(ped, location.x, location.y, location.z, false, false, false, false);

      chatCommands.sendMessage(source, `^2Teleported to: ^7${location.name}`);

      // Notify client
      this.framework.rpc.callClient('notify', source, `Teleported to ${location.name}`, 'success')
        .catch(() => {});
    }, {
      description: 'Teleport to demo locations',
      usage: '/demoteleport <ls|airport|pier|mount>',
      aliases: ['dtp']
    });

    // Command 4: Spawn vehicle
    chatCommands.register('demovehicle', (source, args) => {
      const models = {
        'adder': 'Adder (Super)',
        'infernus': 'Infernus (Super)',
        'zentorno': 'Zentorno (Super)',
        'police': 'Police Car',
        'taxi': 'Taxi',
        'bus': 'Bus'
      };

      const modelKey = args[0]?.toLowerCase() || 'adder';
      const modelName = Object.keys(models).includes(modelKey) ? modelKey : 'adder';

      const ped = GetPlayerPed(source);
      const [x, y, z] = GetEntityCoords(ped);
      const heading = GetEntityHeading(ped);

      const vehicle = CreateVehicle(GetHashKey(modelName), x + 3, y, z, heading, true, false);

      chatCommands.sendMessage(source, `^2Vehicle spawned: ^7${models[modelName] || modelName}`);

      // Notify client
      this.framework.rpc.callClient('notify', source, `Spawned ${models[modelName]}`, 'success')
        .catch(() => {});
    }, {
      description: 'Spawn a demo vehicle',
      usage: '/demovehicle [model]',
      aliases: ['dv']
    });

    // Command 5: List players
    chatCommands.register('players', (source) => {
      const players = [];
      for (let i = 0; i < GetNumPlayerIndices(); i++) {
        const playerId = GetPlayerFromIndex(i);
        const name = GetPlayerName(playerId);
        players.push(`^5[${playerId}]^7 ${name}`);
      }

      chatCommands.sendMessage(source, `^3=== Online Players (${players.length}) ===`);
      players.forEach(player => chatCommands.sendMessage(source, player));
    }, {
      description: 'List online players',
      aliases: ['online', 'list']
    });

    // Command 6: Announce (admin)
    chatCommands.register('announce', (source, args) => {
      if (args.length === 0) {
        chatCommands.sendMessage(source, '^1Usage: ^7/announce <message>');
        return;
      }

      const message = args.join(' ');
      chatCommands.broadcast(`^3[ANNOUNCEMENT] ^7${message}`);
      console.log(`[Demo] Player ${source} announced: ${message}`);
    }, {
      description: 'Broadcast message to all players',
      permission: 'command.announce',
      aliases: ['broadcast', 'ann'],
      params: [
        { name: 'message', help: 'Message to broadcast' }
      ]
    });

    // Command 7: Goto player (admin)
    chatCommands.register('goto', (source, args) => {
      if (args.length === 0) {
        chatCommands.sendMessage(source, '^1Usage: ^7/goto <player_id>');
        return;
      }

      const targetId = parseInt(args[0]);
      if (isNaN(targetId) || !GetPlayerPed(targetId)) {
        chatCommands.sendMessage(source, '^1Error: ^7Invalid player ID');
        return;
      }

      const targetPed = GetPlayerPed(targetId);
      const [x, y, z] = GetEntityCoords(targetPed);

      const ped = GetPlayerPed(source);
      SetEntityCoords(ped, x, y, z, false, false, false, false);

      chatCommands.sendMessage(source, `^2Teleported to ^7${GetPlayerName(targetId)}`);
    }, {
      description: 'Teleport to a player',
      permission: 'command.goto',
      aliases: ['tp'],
      params: [
        { name: 'player_id', help: 'Target player ID' }
      ]
    });

    // Command 8: Bring player (admin)
    chatCommands.register('bring', (source, args) => {
      if (args.length === 0) {
        chatCommands.sendMessage(source, '^1Usage: ^7/bring <player_id>');
        return;
      }

      const targetId = parseInt(args[0]);
      if (isNaN(targetId) || !GetPlayerPed(targetId)) {
        chatCommands.sendMessage(source, '^1Error: ^7Invalid player ID');
        return;
      }

      const ped = GetPlayerPed(source);
      const [x, y, z] = GetEntityCoords(ped);

      const targetPed = GetPlayerPed(targetId);
      SetEntityCoords(targetPed, x, y, z, false, false, false, false);

      chatCommands.sendMessage(source, `^2Brought ^7${GetPlayerName(targetId)}^2 to you`);
      chatCommands.sendMessage(targetId, `^2You were brought to ^7${GetPlayerName(source)}`);
    }, {
      description: 'Bring a player to you',
      permission: 'command.bring',
      params: [
        { name: 'player_id', help: 'Target player ID' }
      ]
    });

    // Command 9: Heal player
    chatCommands.register('heal', (source, args) => {
      let targetId = source;

      if (args.length > 0) {
        targetId = parseInt(args[0]);
        if (isNaN(targetId) || !GetPlayerPed(targetId)) {
          chatCommands.sendMessage(source, '^1Error: ^7Invalid player ID');
          return;
        }
      }

      const targetPed = GetPlayerPed(targetId);
      SetEntityHealth(targetPed, 200);

      if (targetId === source) {
        chatCommands.sendMessage(source, '^2You healed yourself');
      } else {
        chatCommands.sendMessage(source, `^2Healed ^7${GetPlayerName(targetId)}`);
        chatCommands.sendMessage(targetId, `^2You were healed by ^7${GetPlayerName(source)}`);
      }
    }, {
      description: 'Heal yourself or a player',
      params: [
        { name: 'player_id', help: 'Target player ID (optional)' }
      ]
    });

    // Command 10: Give weapon (admin)
    chatCommands.register('weapon', (source, args) => {
      if (args.length === 0) {
        chatCommands.sendMessage(source, '^1Usage: ^7/weapon <weapon_name>');
        chatCommands.sendMessage(source, '^5Examples: ^7pistol, smg, rifle, shotgun');
        return;
      }

      const weaponName = args[0].toLowerCase();
      const weapons = {
        'pistol': 'WEAPON_PISTOL',
        'smg': 'WEAPON_SMG',
        'rifle': 'WEAPON_ASSAULTRIFLE',
        'shotgun': 'WEAPON_PUMPSHOTGUN',
        'sniper': 'WEAPON_SNIPERRIFLE',
        'rpg': 'WEAPON_RPG'
      };

      const weaponHash = weapons[weaponName] || weaponName.toUpperCase();
      const ped = GetPlayerPed(source);

      GiveWeaponToPed(ped, GetHashKey(weaponHash), 250, false, true);
      chatCommands.sendMessage(source, `^2Weapon given: ^7${weaponName}`);
    }, {
      description: 'Give yourself a weapon',
      permission: 'command.weapon',
      aliases: ['gun'],
      params: [
        { name: 'weapon_name', help: 'Weapon name' }
      ]
    });

    // Command 11: Clear chat
    chatCommands.register('clear', (source) => {
      // Send empty lines to clear chat
      for (let i = 0; i < 50; i++) {
        chatCommands.sendMessage(source, ' ');
      }
      chatCommands.sendMessage(source, '^2Chat cleared');
    }, {
      description: 'Clear your chat',
      aliases: ['cls']
    });

    // Command 12: Performance stats
    chatCommands.register('perf', (source) => {
      const performanceModule = this.framework.getModule('performance');

      chatCommands.sendMessage(source, '^3=== Server Performance ===');
      chatCommands.sendMessage(source, `^5Players: ^7${GetNumPlayerIndices()}/${GetConvarInt('sv_maxclients', 32)}`);
      chatCommands.sendMessage(source, `^5Server Time: ^7${new Date().toLocaleTimeString()}`);
      chatCommands.sendMessage(source, `^5Uptime: ^7${Math.floor(process.uptime() / 60)} minutes`);

      if (performanceModule) {
        chatCommands.sendMessage(source, '^7Use ^5F10 ^7to toggle client performance overlay');
      }
    }, {
      description: 'Show server performance stats'
    });

    // Command 13: Whitelist add (admin)
    chatCommands.register('wladd', (source, args) => {
      if (args.length === 0) {
        chatCommands.sendMessage(source, '^1Usage: ^7/wladd <identifier>');
        chatCommands.sendMessage(source, '^5Example: ^7/wladd license:716a655091a9c8579d4709deb5cfec4da3902774');
        return;
      }

      const identifier = args[0];
      const whitelist = this.framework.getModule('whitelist');

      if (!whitelist) {
        chatCommands.sendMessage(source, '^1Error: ^7Whitelist module not loaded');
        return;
      }

      const adminName = GetPlayerName(source);
      whitelist.add(identifier, adminName, 'Added via command')
        .then(result => {
          if (result.success) {
            chatCommands.sendMessage(source, `^2✓ Added to whitelist: ^7${identifier}`);
            console.log(`[Demo] ${adminName} added ${identifier} to whitelist`);
          } else if (result.reason === 'already_whitelisted') {
            chatCommands.sendMessage(source, `^3⚠ Already whitelisted: ^7${identifier}`);
          } else {
            chatCommands.sendMessage(source, `^1Error: ^7${result.reason}`);
          }
        })
        .catch(error => {
          chatCommands.sendMessage(source, `^1Error: ^7${error.message}`);
        });
    }, {
      description: 'Add player to whitelist',
      permission: 'command.whitelist',
      params: [
        { name: 'identifier', help: 'Player identifier (e.g., license:xxx)' }
      ]
    });

    // Command 14: Whitelist remove (admin)
    chatCommands.register('wlremove', (source, args) => {
      if (args.length === 0) {
        chatCommands.sendMessage(source, '^1Usage: ^7/wlremove <identifier>');
        return;
      }

      const identifier = args[0];
      const whitelist = this.framework.getModule('whitelist');

      if (!whitelist) {
        chatCommands.sendMessage(source, '^1Error: ^7Whitelist module not loaded');
        return;
      }

      const adminName = GetPlayerName(source);
      whitelist.remove(identifier, adminName, 'Removed via command')
        .then(result => {
          if (result.success) {
            chatCommands.sendMessage(source, `^2✓ Removed from whitelist: ^7${identifier}`);
            console.log(`[Demo] ${adminName} removed ${identifier} from whitelist`);
          } else if (result.reason === 'not_found') {
            chatCommands.sendMessage(source, `^3⚠ Not found in whitelist: ^7${identifier}`);
          } else {
            chatCommands.sendMessage(source, `^1Error: ^7${result.reason}`);
          }
        })
        .catch(error => {
          chatCommands.sendMessage(source, `^1Error: ^7${error.message}`);
        });
    }, {
      description: 'Remove player from whitelist',
      permission: 'command.whitelist',
      aliases: ['wldel'],
      params: [
        { name: 'identifier', help: 'Player identifier' }
      ]
    });

    // Command 15: Whitelist list (admin)
    chatCommands.register('wllist', (source) => {
      const whitelist = this.framework.getModule('whitelist');

      if (!whitelist) {
        chatCommands.sendMessage(source, '^1Error: ^7Whitelist module not loaded');
        return;
      }

      whitelist.getAll()
        .then(list => {
          chatCommands.sendMessage(source, `^3=== Whitelist (${list.length} entries) ===`);
          if (list.length === 0) {
            chatCommands.sendMessage(source, '^7No whitelisted players');
          } else {
            list.slice(0, 20).forEach((entry, i) => {
              const date = new Date(entry.added_at).toLocaleDateString();
              chatCommands.sendMessage(source, `^5${i + 1}. ^7${entry.identifier} ^5(by ${entry.added_by}, ${date})`);
            });
            if (list.length > 20) {
              chatCommands.sendMessage(source, `^7... and ${list.length - 20} more`);
            }
          }
        })
        .catch(error => {
          chatCommands.sendMessage(source, `^1Error: ^7${error.message}`);
        });
    }, {
      description: 'List whitelisted players',
      permission: 'command.whitelist'
    });

    // Command 16: Whitelist toggle (admin)
    chatCommands.register('wltoggle', (source) => {
      const whitelist = this.framework.getModule('whitelist');

      if (!whitelist) {
        chatCommands.sendMessage(source, '^1Error: ^7Whitelist module not loaded');
        return;
      }

      if (whitelist.isEnabled()) {
        whitelist.disable();
        chatCommands.sendMessage(source, '^3⚠ Whitelist disabled');
        chatCommands.broadcast('^3Server whitelist has been disabled');
      } else {
        whitelist.enable();
        chatCommands.sendMessage(source, '^2✓ Whitelist enabled');
        chatCommands.broadcast('^2Server whitelist has been enabled');
      }
    }, {
      description: 'Toggle whitelist on/off',
      permission: 'command.whitelist'
    });

    console.log('[Demo] ✅ Chat commands registered');
  }

  /**
   * Demo 4: Player Management
   */
  demoPlayerManagement() {
    console.log('[Demo] Setting up player management...');

    // Player connecting
    on('playerConnecting', (name, setKickReason, deferrals) => {
      const source = global.source;
      console.log(`[Demo] Player connecting: ${name} (${source})`);

      // Initialize player data
      this.playerData.set(source, {
        money: 5000, // Starting money
        joinTime: Date.now()
      });

      // Emit event
      this.framework.eventBus.emit('PLAYER_CONNECTED', {
        source: source,
        name: name
      });
    });

    // Player dropped
    on('playerDropped', (reason) => {
      const source = global.source;
      console.log(`[Demo] Player dropped: ${source} (${reason})`);

      // Cleanup player data
      this.playerData.delete(source);
    });

    console.log('[Demo] ✅ Player management setup complete');
  }

  /**
   * Demo 5: Hooks System
   */
  demoHooks() {
    console.log('[Demo] Setting up hooks...');

    // Register a hook
    this.framework.registerHook('onPlayerSpawn', async (source) => {
      console.log(`[Demo Hook] Player ${source} spawned`);

      // Give welcome bonus
      const playerData = this.playerData.get(source);
      if (playerData) {
        playerData.money += 100;
        console.log(`[Demo Hook] Welcome bonus given to player ${source}`);
      }
    });

    // Trigger hook example (you would call this from other parts of your code)
    setTimeout(() => {
      this.framework.runHook('onPlayerSpawn', 1);
    }, 5000);

    console.log('[Demo] ✅ Hooks setup complete');
  }

  /**
   * Cleanup
   */
  async destroy() {
    console.log('[Demo Plugin] Shutting down...');
    this.playerData.clear();
  }
}

module.exports = DemoPlugin;
