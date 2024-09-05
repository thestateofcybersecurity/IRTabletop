import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const techniques = await db.collection('techniques').find({}).toArray();
    res.status(200).json(techniques);
  } catch (error) {
    console.error('Error fetching techniques:', error);
    res.status(500).json({ error: 'Failed to fetch techniques' });
  }
}
