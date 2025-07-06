const { connectDB, healthCheck, closeConnection } = require('./database');

async function checkDatabaseConnection() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Connect to database
    await connectDB();
    
    // Perform health check
    const health = await healthCheck();
    
    if (health.status === 'healthy') {
      console.log('✅ Database connection is healthy!');
      console.log(`📊 Connection Details:
- Status: ${health.status}
- Database: ${health.database}
- Host: ${health.host}
- Port: ${health.port}
- Connection State: ${health.connection}`);
    } else {
      console.log('❌ Database connection is unhealthy!');
      console.log(`Error: ${health.error}`);
      console.log(`Connection State: ${health.connection}`);
    }
    
  } catch (error) {
    console.error('❌ Failed to check database connection:', error.message);
    process.exit(1);
  } finally {
    await closeConnection();
  }
}

// Run check if this file is executed directly
if (require.main === module) {
  checkDatabaseConnection();
}

module.exports = { checkDatabaseConnection };
