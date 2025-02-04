const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = '12345678'; // Change this to the password you want to hash
  const hashedPassword = await bcrypt.hash(password, 12);
  console.log("🔑 Hashed Password:", hashedPassword);
}

hashPassword();
