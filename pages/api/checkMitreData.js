
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const collections = ['tactics', 'techniques', 'mitigations', 'groups', 'software', 'relationships'];
    const counts = {};

    for (const collection of collections) {
      counts[collection] = await db.collection(collection).countDocuments();
    }

    res.status(200).json(counts);
  } catch (error) {
    console.error('Error checking MITRE data:', error);
    res.status(500).json({ error: 'Failed to check MITRE data' });
  }
}
