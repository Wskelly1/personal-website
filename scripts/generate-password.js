const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('\nPlease provide a password as an argument:');
  console.error('node scripts/generate-password.js YOUR_PASSWORD\n');
  process.exit(1);
}

console.log('\nPassword you entered:', password);
bcrypt.hash(password, 10).then(hash => {
  console.log('\nYour hashed password is:');
  console.log(hash);
  console.log('\nAdd these to your .env.local file:');
  console.log(`ADMIN_USERNAME=admin`);
  console.log(`ADMIN_PASSWORD=${hash}\n`);
}); 