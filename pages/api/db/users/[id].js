/ pages/api/db/users/[id].js (Vercel Serverless Function)
import { connectToDatabase } from '../../../../lib/mongodb'; // Adjust path as needed
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const { id } = req.query;

      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Error fetching user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
