import { findUserByEmail, validatePassword } from '../../../models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      const user = await findUserByEmail(email);
      if (!user || !(await validatePassword(user, password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(200).json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Error during login' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
