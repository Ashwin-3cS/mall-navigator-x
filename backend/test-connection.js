const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.log('❌ MONGODB_URI not found in environment variables');
    console.log('Please create a .env file with your MongoDB connection string');
    return;
  }

  console.log('🔌 Testing MongoDB connection...');
  console.log('URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials

  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    console.log('✅ MongoDB connection successful!');
    
    // Test database operations
    const db = client.db();
    const collections = await db.listCollections().toArray();
    
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    // Test if we can read from database
    try {
      const adminDb = client.db('admin');
      const result = await adminDb.command({ ping: 1 });
      console.log('🏓 Database ping successful:', result);
    } catch (error) {
      console.log('⚠️ Admin database access restricted (this is normal)');
    }
    
    await client.close();
    console.log('🔌 Connection closed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if MongoDB is running');
    console.log('2. Verify connection string format');
    console.log('3. Check network connectivity');
    console.log('4. Verify username/password');
    console.log('5. Check IP whitelist (for Atlas)');
  }
}

testConnection(); 