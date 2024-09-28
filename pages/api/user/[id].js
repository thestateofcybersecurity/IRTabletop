// pages/api/user/[id].js (Serverless function)
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    const { db } = await connectToDatabase();
    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      res.status(200).json(user);
    } catch (error) {
      // ... error handling ...
    }
  }
}
