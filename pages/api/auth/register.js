import { connectToDatabase } from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists using a secure query
    const existingUser = await db.collection('users').findOne({ $or: [
      { email: email },
      { username: username }
    ]});
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user using a secure insertion method
    const result = await db.collection('users').insertOne({
      username: username,
      email: email,
      password: hashedPassword,
      createdAt: new Date()
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: result.insertedId, email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { id: result.insertedId, username, email },
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
}
