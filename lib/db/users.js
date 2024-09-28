// lib/db/users.js
import { connectToDatabase } from '../mongodb';
import { ObjectId } from 'mongodb';

export async function findUserById(id) {
  const { db } = await connectToDatabase();
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    return user;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    return null; // Or throw the error if you prefer
  }
}
