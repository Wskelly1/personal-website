require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Set these values for your admin account
const adminEmail = 'skelly.william036@gmail.com';
const adminPassword = 'Admin123!'; // This will be hashed

async function setupAdmin() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully');

    // First, drop the existing AdminConfig collection
    await mongoose.connection.dropCollection('adminconfigs').catch(() => {
      console.log('No existing admin collection to drop');
    });

    // Create fresh AdminConfig model
    const AdminConfigSchema = new mongoose.Schema({
      key: {
        type: String,
        required: true,
        unique: true
      },
      passwordHash: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    });

    const AdminConfig = mongoose.models.AdminConfig || mongoose.model('AdminConfig', AdminConfigSchema);

    // Generate password hash
    console.log('Generating password hash...');
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create new admin config
    console.log('Creating new admin user...');
    const adminConfig = await AdminConfig.create({
      key: 'credentials',
      passwordHash,
      email: adminEmail,
      updatedAt: new Date()
    });

    console.log('\nAdmin user created successfully:');
    console.log('Email:', adminConfig.email);
    console.log('Password Hash:', adminConfig.passwordHash);
    console.log('Created at:', adminConfig.updatedAt);
    
    // Verify the password
    const isValid = await bcrypt.compare(adminPassword, adminConfig.passwordHash);
    console.log('\nPassword verification test:', isValid ? '✓ Passed' : '✗ Failed');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
  }
}

setupAdmin(); 