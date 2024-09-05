import { connectToDatabase } from '../lib/mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function createUser(userData) {
  const { db } = await connectToDatabase();
  const { email, password, name } = userData;

  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.collection('users').insertOne({
    email,
    password: hashedPassword,
    name,
    createdAt: new Date(),
  });

  return { id: result.insertedId, email, name };
}

export async function findUserByEmail(email) {
  const { db } = await connectToDatabase();
  return db.collection('users').findOne({ email });
}

export async function findUserById(id) {
  const { db } = await connectToDatabase();
  return db.collection('users').findOne({ _id: ObjectId(id) });
}

export async function validatePassword(user, inputPassword) {
  return bcrypt.compare(inputPassword, user.password);
}
