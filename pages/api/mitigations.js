import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const mitigations = await db.collection('mitigations').find({}).toArray();
    res.status(200).json(mitigations);
  } catch (error) {
    console.error('Error fetching mitigations:', error);
    res.status(500).json({ error: 'Failed to fetch mitigations' });
  }
}
