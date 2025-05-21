require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Please provide a password as an argument');
  process.exit(1);
}

async function updatePassword() {
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

    // Generate new password hash
    const passwordHash = await bcrypt.hash(password, 10);

    // Update the admin config
    const result = await AdminConfig.findOneAndUpdate(
      { key: 'credentials' },
      { 
        passwordHash,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (result) {
      console.log('Password updated successfully');
      console.log('Admin email:', result.email);
      console.log('New password hash length:', result.passwordHash.length);
    } else {
      console.log('No admin configuration found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updatePassword(); 