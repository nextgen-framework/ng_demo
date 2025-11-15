# NextGen Demo Plugin

Complete demonstration plugin showcasing **ALL** NextGen Framework features.

## 🎯 Purpose

This plugin demonstrates every feature of the NextGen Core framework in a practical, ready-to-use implementation.

## ✨ Features Demonstrated

### ✅ Server-Side
- EventBus for custom events
- RPC handlers (4 endpoints)
- Chat commands (21 commands)
- Player data management
- Whitelist management
- Hooks system
- Plugin lifecycle (init/destroy)

### ✅ Client-Side
- EventBus integration
- RPC communication with server
- Notifications (all types)
- Performance overlay (F10)
- Custom UI display (F9)
- Key bindings
- Real-time stats tracking

## 🚀 Installation

1. **Ensure ng-core is installed and started**:
```lua
-- In server.cfg
ensure ng-core
```

2. **Add ng-demo to resources**:
```lua
-- In server.cfg
ensure ng-demo
```

3. **Restart server** or run:
```
restart ng-core
ensure ng-demo
```

The plugin will be **auto-detected** by ng-core via `ng-plugin.json`.

## 🎮 How to Use

### Commands

#### Demo Commands

| Command | Description | Usage | Aliases |
|---------|-------------|-------|---------|
| `/demo` | Show plugin information | `/demo` | `/demoinfo` |
| `/demomoney` | Give yourself money | `/demomoney [amount]` | - |
| `/demoteleport` | Teleport to locations | `/demoteleport <location>` | `/dtp` |
| `/demovehicle` | Spawn vehicle | `/demovehicle [model]` | `/dv` |

#### Utility Commands

| Command | Description | Usage | Aliases | Permission |
|---------|-------------|-------|---------|------------|
| `/players` | List online players | `/players` | `/online`, `/list` | - |
| `/clear` | Clear your chat | `/clear` | `/cls` | - |
| `/perf` | Server performance stats | `/perf` | - | - |
| `/heal` | Heal yourself or player | `/heal [player_id]` | - | - |

#### Admin Commands

| Command | Description | Usage | Aliases | Permission |
|---------|-------------|-------|---------|------------|
| `/announce` | Broadcast message | `/announce <message>` | `/broadcast`, `/ann` | `command.announce` |
| `/goto` | Teleport to player | `/goto <player_id>` | `/tp` | `command.goto` |
| `/bring` | Bring player to you | `/bring <player_id>` | - | `command.bring` |
| `/weapon` | Give yourself weapon | `/weapon <name>` | `/gun` | `command.weapon` |

#### Whitelist Commands

| Command | Description | Usage | Aliases | Permission |
|---------|-------------|-------|---------|------------|
| `/wlme` | Add yourself to whitelist | `/wlme` | - | `command.whitelist` |
| `/wladd` | Add player to whitelist | `/wladd <identifier>` | - | `command.whitelist` |
| `/wlremove` | Remove player from whitelist | `/wlremove <identifier>` | `/wldel` | `command.whitelist` |
| `/wllist` | List whitelisted players | `/wllist` | - | `command.whitelist` |
| `/wltoggle` | Toggle whitelist on/off | `/wltoggle` | - | `command.whitelist` |

**Teleport Locations**:
- `ls` - Legion Square
- `airport` - Los Santos Airport
- `pier` - Del Perro Pier
- `mount` - Mount Chiliad

**Vehicle Models**:
- `adder`, `infernus`, `zentorno` (Supers)
- `police`, `taxi`, `bus` (Service)

### Key Bindings

| Key | Action |
|-----|--------|
| `F9` | Toggle Demo UI |
| `F10` | Toggle Performance Overlay |

### Demo UI Features

When pressing F9, you'll see:
- 💰 Current money balance
- ❤️ Health (out of 200)
- 🛡️ Armor
- 📍 Real-time position (X, Y, Z)

### Performance Overlay

When pressing F10, you'll see:
- 📊 FPS (color-coded)
- ⏱️ Frame time (ms)
- ❤️ Health percentage
- 🛡️ Armor value
- 📍 Position coordinates

## 📡 RPC Endpoints

### Server RPC (callable from client)

```javascript
// Get server information
const info = await framework.rpc.callServer('demo:getServerInfo');
// Returns: { serverName, players, maxPlayers, gametype, map }

// Give money to yourself
const result = await framework.rpc.callServer('demo:giveMoney', 1000);
// Returns: { success: true, newBalance: 6000 }

// Get your stats
const stats = await framework.rpc.callServer('demo:getPlayerStats');
// Returns: { source, name, money, stateBag }

// Teleport
const result = await framework.rpc.callServer('demo:teleportPlayer', x, y, z);
// Returns: { success: true, position: { x, y, z } }
```

### Client RPC (callable from server)

```javascript
// Get client information
const info = await framework.rpc.callClient('demo:getClientInfo', source);
// Returns: { playerId, serverId, name, position, health, armor, vehicle }

// Notify about money received
await framework.rpc.callClient('demo:receiveMoney', source, 500);
// Returns: { success: true, newBalance: 5500 }

// Notify about teleport
await framework.rpc.callClient('demo:onTeleport', source, 'Legion Square');
// Returns: { success: true }
```

## 🔧 Code Examples

### Using in Your Plugin/Module

**Call demo RPC from your code**:
```javascript
// Server-side
const framework = global.Framework;

// Give money via demo plugin
const result = await framework.rpc.callClient('demo:receiveMoney', source, 1000);

// Get client info
const clientInfo = await framework.rpc.callClient('demo:getClientInfo', source);
console.log('Player position:', clientInfo.position);
```

**Listen to demo events**:
```javascript
// Server-side
framework.eventBus.on('PLAYER_CONNECTED', (data) => {
  console.log('Demo plugin detected player:', data.name);
});

// Client-side
framework.eventBus.on('DEMO_UPDATE_STATS', (data) => {
  console.log('Stats updated:', data);
});
```

## 📊 Technical Details

### Plugin Metadata (ng-plugin.json)

```json
{
  "name": "ng-demo",
  "version": "1.0.0",
  "description": "Complete demonstration plugin",
  "priority": 100,
  "ngCoreVersion": "^1.0.0"
}
```

### Auto-Detection

The plugin is automatically detected by ng-core's plugin-manager because:
1. It has `ng-plugin.json` in the root
2. It's in the `resources/[ng]/` directory
3. It's started after ng-core

### Load Order

```
1. ng-core starts
2. ng-core loads modules (resource-monitor, plugin-manager, etc.)
3. plugin-manager scans for ng-plugin.json
4. ng-demo is detected and loaded
5. ng-demo.init() is called
```

## 🎓 Learning from the Demo

### EventBus Pattern
```javascript
// src/modules/ng-demo/server.js:57
this.framework.eventBus.on('PLAYER_CONNECTED', (data) => {
  console.log(`Player connected: ${data.name}`);
});
```

### RPC Pattern
```javascript
// src/modules/ng-demo/server.js:69
this.framework.rpc.register('demo:getServerInfo', (source) => {
  return {
    serverName: GetConvar('sv_hostname', 'Unknown'),
    players: GetNumPlayerIndices()
  };
});
```

### Chat Commands Pattern
```javascript
// src/modules/ng-demo/server.js:138
chatCommands.register('demo', (source) => {
  chatCommands.sendMessage(source, 'Hello!');
}, {
  description: 'Demo command',
  aliases: ['demoinfo']
});
```

### UI Drawing Pattern
```javascript
// src/modules/ng-demo/client.js:200
setTick(() => {
  if (this.showUI) {
    this.drawUI();
  }
});
```

## 🧪 Testing

### Quick Test Checklist

1. ✅ Plugin loads without errors
2. ✅ Commands work (`/demo`, `/demomoney`, etc.)
3. ✅ F9 toggles UI
4. ✅ F10 toggles performance overlay
5. ✅ Notifications appear
6. ✅ RPC calls work (check F8 console)
7. ✅ Money balance updates
8. ✅ Teleports work
9. ✅ Vehicles spawn

### Console Commands (F8)

```javascript
// Test RPC
await global.Framework.rpc.callServer('demo:getServerInfo')

// Test money
await global.Framework.rpc.callServer('demo:giveMoney', 5000)

// Test stats
await global.Framework.rpc.callServer('demo:getPlayerStats')

// Check if plugin is loaded
global.Framework.pluginLoader.has('ng-demo')

// Get plugin instance
global.Framework.pluginLoader.get('ng-demo')
```

## 🔍 Troubleshooting

### Plugin Not Loading

1. **Check ng-core is started first**:
```lua
-- In server.cfg, ng-core MUST be before ng-demo
ensure ng-core
ensure ng-demo
```

2. **Check console for errors**:
```
[ng-core] External plugin "ng-demo" loaded successfully
```

3. **Verify ng-plugin.json exists** in `resources/[ng]/ng-demo/`

### Commands Not Working

1. **Check chat-commands module is loaded**:
```javascript
global.Framework.getModule('chat-commands')
```

2. **Check permissions** (default: no permissions required)

### RPC Fails

1. **Check both sides are loaded** (server + client)
2. **Check F8 console for errors**
3. **Verify RPC handler names match exactly**

## 📚 Next Steps

After exploring ng-demo, try:

1. **Create your own module** based on the examples
2. **Extend ng-demo** with more features
3. **Create your own plugin** using ng-demo as template
4. **Read** [MODULES.md](../ng-core/MODULES.md) for API reference

## 📝 Notes

- Plugin is designed for **demonstration and learning**
- In production, implement proper:
  - Permission checks
  - Database integration
  - Anti-cheat measures
  - Rate limiting
- Use as **starting point**, not final product

## 💡 Tips

1. Study the code to understand patterns
2. Modify commands to learn RPC
3. Add new features to practice
4. Use as template for your plugins

---

**Version**: 1.0.0
**Framework**: NextGen Core v1.0.0
**Type**: Demonstration Plugin
**License**: Free to use and modify
