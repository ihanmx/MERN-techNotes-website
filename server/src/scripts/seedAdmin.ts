import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.error("Usage: node dist/scripts/seedAdmin.js <username> <password>");
  process.exit(1);
}

const uri = process.env.DATABASE_URI;
if (!uri) {
  console.error("DATABASE_URI not set");
  process.exit(1);
}

await mongoose.connect(uri);

const existing = await User.findOne({ username: username.toLowerCase() });
if (existing) {
  console.log(`User "${username}" already exists. Doing nothing.`);
  await mongoose.disconnect();
  process.exit(0);
}

const hashed = await bcrypt.hash(password, 10);

await User.create({
  username: username.toLowerCase(),
  password: hashed,
  roles: ["Admin", "Manager", "Employee"],
  active: true,
});

console.log(`✔ Admin user "${username}" created.`);
await mongoose.disconnect();
