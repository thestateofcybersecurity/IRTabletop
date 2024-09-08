import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const software = await db.collection('software').find({}).toArray();
    res.status(200).json(software);
  } catch (error) {
    console.error('Error fetching software:', error);
    res.status(500).json({ error: 'Failed to fetch software' });
  }
}
