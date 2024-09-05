import jwt from 'jsonwebtoken';
import { findUserByEmail, validatePassword } from '../../../models/User';
import config from '../../../config';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await findUserByEmail(email);
    if (!user || !(await validatePassword(user, password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    res.status(200).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error during login' });
  }
}
