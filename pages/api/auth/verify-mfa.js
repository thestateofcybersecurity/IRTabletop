// pages/api/auth/verify-mfa.js (New API route)
import { connectToDatabase } from '../../../lib/mongodb';
import speakeasy from 'speakeasy';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const { email, code } = req.body;

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: code,
      window: 1, // Allow for a slight time drift
    });

    if (verified) {
      // Generate JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(200).json({
        message: 'MFA verified',
        token,
      });
    } else {
      res.status(400).json({ error: 'Invalid MFA code' });
    }
  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({ error: 'Error verifying MFA' });
  }
}
