import { connectToDatabase } from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import checkAuth from '../../../middleware/checkAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const user = await db.collection('users').findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (user.mfaEnabled) {
      return res.status(200).json({ mfaRequired: true }); // Use return here
    } else {
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.status(200).json({ // Use return here as well
        message: 'Login successful',
        user: { id: user._id, username: user.username, email: user.email },
        token,
      });
    }
  } catch (error) { // Added catch block
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error during login' });
  }
}
