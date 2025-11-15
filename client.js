/**
 * NextGen Demo Plugin - Client Side
 * Complete demonstration of all client-side framework features
 */

class DemoPlugin {
  constructor(framework, metadata) {
    this.framework = framework;
    this.metadata = metadata;
    this.showUI = false;
    this.stats = {
      money: 0,
      position: { x: 0, y: 0, z: 0 }
    };
  }

  /**
   * Initialize the demo plugin
   */
  async init(framework, options) {
    console.log('');
    console.log('========================================');
    console.log('  NextGen Demo Plugin - Client');
    console.log('  Version:', this.metadata.version);
    console.log('========================================');
    console.log('');

    // Demo 1: EventBus
    this.demoEventBus();

    // Demo 2: RPC System
    this.demoRPC();

    // Demo 3: Notifications
    this.demoNotifications();

    // Demo 4: Performance Monitor
    this.demoPerformanceMonitor();

    // Demo 5: Key bindings
    this.demoKeyBindings();

    // Demo 6: UI Display
    this.demoUIDisplay();

    console.log('[Demo Plugin] ✅ All client features initialized');
  }

  /**
   * Demo 1: EventBus Usage
   */
  demoEventBus() {
    console.log('[Demo] Setting up EventBus demonstrations...');

    // Listen to custom events
    this.framework.eventBus.on('DEMO_UPDATE_STATS', (data) => {
      console.log('[Demo EventBus] Stats updated:', data);
      this.stats = { ...this.stats, ...data };
    });

    // Listen to notifications
    this.framework.eventBus.on('NOTIFICATION', (data) => {
      console.log('[Demo EventBus] Notification received:', data.message);
    });

    console.log('[Demo] ✅ EventBus setup complete');
  }

  /**
   * Demo 2: RPC System
   */
  demoRPC() {
    console.log('[Demo] Setting up RPC demonstrations...');

    // RPC 1: Get client info
    this.framework.rpc.register('demo:getClientInfo', () => {
      const ped = PlayerPedId();
      const [x, y, z] = GetEntityCoords(ped, false);

      return {
        playerId: PlayerId(),
        serverId: GetPlayerServerId(PlayerId()),
        name: GetPlayerName(PlayerId()),
        position: { x, y, z },
        health: GetEntityHealth(ped),
        armor: GetPedArmour(ped),
        vehicle: IsPedInAnyVehicle(ped, false) ? GetVehiclePedIsIn(ped, false) : null
      };
    });

    // RPC 2: Receive money
    this.framework.rpc.register('demo:receiveMoney', (amount) => {
      this.stats.money += amount;

      // Show notification
      const notifications = this.framework.getModule('notifications');
      if (notifications) {
        notifications.success(`Received $${amount}`);
      }

      return { success: true, newBalance: this.stats.money };
    });

    // RPC 3: Teleport confirmation
    this.framework.rpc.register('demo:onTeleport', (location) => {
      const notifications = this.framework.getModule('notifications');
      if (notifications) {
        notifications.info(`Teleported to ${location}`);
      }

      return { success: true };
    });

    // Test server RPC after 3 seconds
    setTimeout(async () => {
      try {
        const serverInfo = await this.framework.rpc.callServer('demo:getServerInfo');
        console.log('[Demo RPC] Server info:', serverInfo);

        const notifications = this.framework.getModule('notifications');
        if (notifications) {
          notifications.info(`Server: ${serverInfo.serverName}`);
          notifications.info(`Players: ${serverInfo.players}/${serverInfo.maxPlayers}`);
        }
      } catch (error) {
        console.error('[Demo RPC] Failed to get server info:', error.message);
      }
    }, 3000);

    console.log('[Demo] ✅ RPC handlers registered');
  }

  /**
   * Demo 3: Notifications
   */
  demoNotifications() {
    const notifications = this.framework.getModule('notifications');
    if (!notifications) {
      console.log('[Demo] ⚠️ Notifications module not loaded');
      return;
    }

    console.log('[Demo] Testing notifications...');

    // Test different notification types
    setTimeout(() => {
      notifications.info('Demo plugin loaded successfully!');
    }, 1000);

    setTimeout(() => {
      notifications.success('All features are working!');
    }, 3000);

    setTimeout(() => {
      notifications.advanced('NextGen Framework', 'Welcome to the demo!', 'info');
    }, 5000);

    console.log('[Demo] ✅ Notifications setup complete');
  }

  /**
   * Demo 4: Performance Monitor
   */
  demoPerformanceMonitor() {
    const performance = this.framework.getModule('performance');
    if (!performance) {
      console.log('[Demo] ⚠️ Performance module not loaded');
      return;
    }

    console.log('[Demo] Performance monitor available');
    console.log('[Demo] Press F10 to toggle performance overlay');
  }

  /**
   * Demo 5: Key Bindings
   */
  demoKeyBindings() {
    console.log('[Demo] Setting up key bindings...');

    // F9: Toggle demo UI
    RegisterCommand('+demo_toggle_ui', () => {
      this.toggleUI();
    }, false);

    RegisterCommand('-demo_toggle_ui', () => {}, false);

    RegisterKeyMapping('+demo_toggle_ui', 'Toggle Demo UI', 'keyboard', 'F9');

    // F10: Toggle performance overlay
    RegisterCommand('+demo_toggle_perf', () => {
      const performance = this.framework.getModule('performance');
      if (performance) {
        const showing = performance.toggle();
        const notifications = this.framework.getModule('notifications');
        if (notifications) {
          notifications.info(showing ? 'Performance overlay enabled' : 'Performance overlay disabled');
        }
      }
    }, false);

    RegisterCommand('-demo_toggle_perf', () => {}, false);

    RegisterKeyMapping('+demo_toggle_perf', 'Toggle Performance Overlay', 'keyboard', 'F10');

    console.log('[Demo] ✅ Key bindings registered');
    console.log('[Demo] F9 = Toggle Demo UI | F10 = Toggle Performance');
  }

  /**
   * Demo 6: UI Display
   */
  demoUIDisplay() {
    console.log('[Demo] Setting up UI display...');

    // Update position every second
    setInterval(() => {
      const ped = PlayerPedId();
      const [x, y, z] = GetEntityCoords(ped, false);
      this.stats.position = { x, y, z };
    }, 1000);

    // Draw UI
    setTick(() => {
      if (this.showUI) {
        this.drawUI();
      }
    });

    console.log('[Demo] ✅ UI setup complete');
  }

  /**
   * Toggle UI
   */
  toggleUI() {
    this.showUI = !this.showUI;

    const notifications = this.framework.getModule('notifications');
    if (notifications) {
      notifications.info(this.showUI ? 'Demo UI enabled' : 'Demo UI disabled');
    }
  }

  /**
   * Draw UI
   */
  drawUI() {
    const ped = PlayerPedId();
    const health = GetEntityHealth(ped);
    const armor = GetPedArmour(ped);

    // Draw background
    DrawRect(0.85, 0.1, 0.2, 0.2, 0, 0, 0, 150);

    // Draw title
    this.drawText('~b~NextGen Demo', 0.85, 0.02);

    // Draw stats
    this.drawText(`~g~Money: ~w~$${this.stats.money}`, 0.85, 0.05);
    this.drawText(`~r~Health: ~w~${health}/200`, 0.85, 0.07);
    this.drawText(`~b~Armor: ~w~${armor}`, 0.85, 0.09);

    // Draw position
    this.drawText('~y~Position:', 0.85, 0.12);
    this.drawText(`~w~X: ${this.stats.position.x.toFixed(1)}`, 0.85, 0.14);
    this.drawText(`~w~Y: ${this.stats.position.y.toFixed(1)}`, 0.85, 0.16);
    this.drawText(`~w~Z: ${this.stats.position.z.toFixed(1)}`, 0.85, 0.18);

    // Draw help
    this.drawText('~w~F9: Toggle UI', 0.85, 0.22);
  }

  /**
   * Draw text helper
   */
  drawText(text, x, y) {
    SetTextFont(4);
    SetTextProportional(false);
    SetTextScale(0.35, 0.35);
    SetTextColour(255, 255, 255, 255);
    SetTextDropshadow(0, 0, 0, 0, 255);
    SetTextEdge(1, 0, 0, 0, 255);
    SetTextDropShadow();
    SetTextOutline();
    SetTextEntry('STRING');
    AddTextComponentString(text);
    DrawText(x, y);
  }

  /**
   * Cleanup
   */
  async destroy() {
    console.log('[Demo Plugin] Shutting down...');
    this.showUI = false;
  }
}

// Export for client
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DemoPlugin;
}
