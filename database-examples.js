/**
 * NextGen Framework - Database Module Examples
 * Shows how to use the database module in external plugins
 */

class DatabaseExamples {
  constructor(framework) {
    this.framework = framework;
    this.db = framework.database; // Or framework.db (alias)
  }

  /**
   * Example 1: Basic CRUD operations with Collections
   */
  async example1_basicCRUD() {
    console.log('\n=== Example 1: Basic CRUD Operations ===\n');

    // Get a collection (auto-creates table if doesn't exist)
    const users = this.db.collection('demo_users');

    // Insert a document
    const userId = await users.insert({
      username: 'john_doe',
      email: 'john@example.com',
      level: 1,
      money: 5000
    });
    console.log(`Inserted user with ID: ${userId}`);

    // Find document by ID
    const user = await users.findById(userId);
    console.log('Found user:', user);

    // Update document
    await users.updateById(userId, {
      $set: { level: 2 },
      $inc: { money: 1000 } // Increment money by 1000
    });
    console.log('User updated');

    // Find with query
    const richUsers = await users.find({ money: { $gte: 5000 } });
    console.log(`Found ${richUsers.length} rich users`);

    // Delete document
    await users.deleteById(userId);
    console.log('User deleted');
  }

  /**
   * Example 2: Advanced queries and sorting
   */
  async example2_advancedQueries() {
    console.log('\n=== Example 2: Advanced Queries ===\n');

    const vehicles = this.db.collection('demo_vehicles');

    // Insert multiple vehicles
    await vehicles.insertMany([
      { plate: 'ABC123', model: 'adder', price: 1000000, garage: 'central' },
      { plate: 'XYZ789', model: 'zentorno', price: 725000, garage: 'central' },
      { plate: 'DEF456', model: 't20', price: 2200000, garage: 'north' }
    ]);

    // Find with sorting and limit
    const expensiveCars = await vehicles.find(
      { price: { $gte: 500000 } },
      { sort: { price: -1 }, limit: 2 }
    );
    console.log('Top 2 expensive cars:', expensiveCars);

    // Count documents
    const centralGarageCount = await vehicles.count({ garage: 'central' });
    console.log(`Central garage has ${centralGarageCount} vehicles`);

    // Check if exists
    const hasExpensive = await vehicles.exists({ price: { $gt: 2000000 } });
    console.log('Has expensive cars:', hasExpensive);

    // Clean up
    await vehicles.deleteAll();
  }

  /**
   * Example 3: Using raw SQL for complex queries
   */
  async example3_rawSQL() {
    console.log('\n=== Example 3: Raw SQL Queries ===\n');

    // Execute raw SQL query
    const results = await this.db.query(
      'SELECT * FROM demo_users WHERE level > ? ORDER BY money DESC LIMIT ?',
      [5, 10]
    );
    console.log(`Found ${results.length} high-level users`);

    // Get single result
    const topUser = await this.db.scalar(
      'SELECT * FROM demo_users ORDER BY money DESC LIMIT 1'
    );
    console.log('Richest user:', topUser);

    // Execute statement (no result)
    const result = await this.db.execute(
      'UPDATE demo_users SET level = level + 1 WHERE money > ?',
      [100000]
    );
    console.log(`Updated ${result.affectedRows} users`);
  }

  /**
   * Example 4: Transactions for atomic operations
   */
  async example4_transactions() {
    console.log('\n=== Example 4: Database Transactions ===\n');

    const users = this.db.collection('demo_users');

    try {
      // Start transaction
      await this.db.transaction(async (connection) => {
        // Transfer money between users
        const sender = await users.findOne({ username: 'sender' });
        const receiver = await users.findOne({ username: 'receiver' });

        if (sender.money < 1000) {
          throw new Error('Insufficient funds');
        }

        // Deduct from sender
        await users.updateById(sender._id, { $inc: { money: -1000 } });

        // Add to receiver
        await users.updateById(receiver._id, { $inc: { money: 1000 } });

        console.log('Transaction completed successfully');
      });
    } catch (error) {
      console.error('Transaction failed:', error.message);
      // Transaction automatically rolled back on error
    }
  }

  /**
   * Example 5: Creating indexes for performance
   */
  async example5_indexes() {
    console.log('\n=== Example 5: Database Indexes ===\n');

    const items = this.db.collection('demo_items');

    // Create index on frequently queried field
    await items.createIndex('name');
    await items.createIndex('category');

    // Create unique index
    await items.createIndex('identifier', { unique: true });

    console.log('Indexes created for better query performance');
  }

  /**
   * Example 6: Working with traditional SQL tables
   */
  async example6_traditionalTables() {
    console.log('\n=== Example 6: Traditional SQL Tables ===\n');

    // You can still use traditional SQL table structure
    // Collections are great for flexible/dynamic data
    // Traditional tables are great for structured data with relations

    // Query from traditional table (created by migration)
    const players = await this.db.query('SELECT * FROM players LIMIT 5');
    console.log(`Found ${players.length} players`);

    // Query with JOIN
    const characters = await this.db.query(`
      SELECT c.*, p.name as player_name
      FROM characters c
      JOIN players p ON c.player_id = p.id
      LIMIT 5
    `);
    console.log(`Found ${characters.length} characters with player info`);
  }

  /**
   * Example 7: Plugin-specific collections
   */
  async example7_pluginCollections() {
    console.log('\n=== Example 7: Plugin-Specific Collections ===\n');

    // Each plugin can have its own collections
    // Collections are automatically namespaced by collection name

    // Police plugin might use:
    const arrests = this.db.collection('police_arrests');
    const evidence = this.db.collection('police_evidence');

    // Hospital plugin might use:
    const medicalRecords = this.db.collection('hospital_records');
    const prescriptions = this.db.collection('hospital_prescriptions');

    // Housing plugin might use:
    const properties = this.db.collection('housing_properties');
    const furniture = this.db.collection('housing_furniture');

    console.log('Plugin-specific collections created');
  }

  /**
   * Run all examples
   */
  async runAll() {
    try {
      await this.example1_basicCRUD();
      await this.example2_advancedQueries();
      await this.example3_rawSQL();
      // await this.example4_transactions(); // Requires setup
      await this.example5_indexes();
      await this.example6_traditionalTables();
      await this.example7_pluginCollections();

      console.log('\n=== All examples completed! ===\n');
    } catch (error) {
      console.error('Example failed:', error);
    }
  }
}

// Export for use in ng-demo plugin
module.exports = DatabaseExamples;
