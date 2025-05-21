require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Check environment variables
console.log('\nChecking environment variables:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Missing');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Missing');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✓ Set' : '✗ Missing');

// Test database connection
async function checkSetup() {
  try {
    console.log('\nTesting database connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Database connected successfully');

    // Define AdminConfig schema
    const AdminConfigSchema = new mongoose.Schema({
      key: String,
      passwordHash: String,
      email: String,
      updatedAt: Date
    });

    // Get or create model
    const AdminConfig = mongoose.models.AdminConfig || mongoose.model('AdminConfig', AdminConfigSchema);

    // Check for existing admin config
    const adminConfig = await AdminConfig.findOne({ key: 'credentials' });
    
    if (adminConfig) {
      console.log('\nExisting admin configuration found:');
      console.log('Email:', adminConfig.email);
      console.log('Password hash length:', adminConfig.passwordHash.length);
      console.log('Last updated:', adminConfig.updatedAt);
    } else {
      console.log('\n✗ No admin configuration found in database');
      console.log('Please run setup-new-admin.js to configure an admin account');
    }

  } catch (error) {
    console.error('\nError during verification:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkSetup(); 