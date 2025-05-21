require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Please provide a password to verify');
  process.exit(1);
}

async function verifyPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    const AdminConfigSchema = new mongoose.Schema({
      key: String,
      passwordHash: String,
      email: String,
      updatedAt: Date
    });

    const AdminConfig = mongoose.models.AdminConfig || mongoose.model('AdminConfig', AdminConfigSchema);
    
    const adminConfig = await AdminConfig.findOne({ key: 'credentials' });
    
    if (!adminConfig) {
      console.log('No admin configuration found in database');
      return;
    }

    console.log('\nAdmin Configuration:');
    console.log('Email:', adminConfig.email);
    console.log('Stored hash:', adminConfig.passwordHash);
    console.log('Last updated:', adminConfig.updatedAt);

    const isMatch = await bcrypt.compare(password, adminConfig.passwordHash);
    console.log('\nPassword verification:');
    console.log('Password matches:', isMatch ? '✓ Yes' : '✗ No');

    // Generate a new hash of the provided password for comparison
    const newHash = await bcrypt.hash(password, 10);
    console.log('\nNew hash of provided password:', newHash);
    console.log('Hash length:', newHash.length);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

verifyPassword(); 