// scripts/generateHash.js
import bcrypt from "bcrypt";

const hashPassword = async () => {
  const password = "12345678";
  const hashed = await bcrypt.hash(password, 10);
  console.log("✅ Hashed password for '123456':", hashed);
};

hashPassword();
