const bcrypt = require('bcryptjs');

// Using a simple password for testing
const password = 'admin123';

bcrypt.hash(password, 10).then(hash => {
  console.log('\n=== Use these values in your .env.local file ===\n');
  console.log(`ADMIN_USERNAME=admin`);
  console.log(`ADMIN_PASSWORD=${hash}`);
  console.log(`NEXTAUTH_SECRET=${require('crypto').randomBytes(32).toString('hex')}`);
  console.log('\nUse this to login:');
  console.log('Username: admin');
  console.log(`Password: ${password}\n`);
}); 