import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const relationships = await db.collection('relationships').find({}).toArray();
    res.status(200).json(relationships);
  } catch (error) {
    console.error('Error fetching relationships:', error);
    res.status(500).json({ error: 'Failed to fetch relationships' });
  }
}
