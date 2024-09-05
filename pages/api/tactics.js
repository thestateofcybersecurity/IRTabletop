import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('mitre_cache');
    const tactics = await db.collection('tactics').find({}).toArray();
    res.status(200).json(tactics);
  } catch (error) {
    console.error('Error fetching tactics:', error);
    res.status(500).json({ error: 'Failed to fetch tactics' });
  }
}
