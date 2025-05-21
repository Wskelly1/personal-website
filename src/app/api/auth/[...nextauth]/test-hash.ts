import bcrypt from 'bcryptjs';

async function testHash(): Promise<void> {
  const password = 'admin123';
  // Generate a new hash
  const newHash = await bcrypt.hash(password, 10);
  console.log('New hash:', newHash);
  
  // Test the existing hash
  const existingHash = '$2b$10$KBJDC5dlPH7AOpQ6QB4B1eyo1y9heBx5xsVpoNURaK73pinnCKdP2';
  const isMatch = await bcrypt.compare(password, existingHash);
  console.log('Password matches existing hash:', isMatch);
}

testHash().catch(console.error); 