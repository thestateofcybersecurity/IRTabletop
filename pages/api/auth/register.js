// pages/api/auth/register.js
import { connectToDatabase } from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isEmail } from 'validator';
import speakeasy from 'speakeasy';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const { username, email, password } = req.body;

    // Validate email format
    if (!isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
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

 // Generate secret for MFA
    const secret = speakeasy.generateSecret({ length: 20 });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user using a secure insertion method
    const result = await db.collection('users').insertOne({
      username: username,
      email: email,
      password: hashedPassword,
      createdAt: new Date(),
      mfaEnabled: false, // Initially MFA is disabled
      mfaSecret: secret.base32, // Store the MFA secret
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
      token,
      mfaQR: secret.otpauth_url, // Send the QR code URL for MFA setup
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
}
