import { connectToDatabase } from '../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { db } = await connectToDatabase();
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user
      const result = await db.collection('users').insertOne({
        username,
        email,
        password: hashedPassword,
        createdAt: new Date()
      });

      res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Error registering user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
