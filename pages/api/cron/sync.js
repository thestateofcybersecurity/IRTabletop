import { fetchMitreData, categorizeMitreData } from '../../../lib/taxiiClient';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  // Verify that this is a cron job request
  if (req.headers['x-vercel-cron'] !== 'true') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('mitre_cache');

    const mitreData = await fetchMitreData();
    const { tactics, techniques, mitigations } = categorizeMitreData(mitreData);

    await db.collection('tactics').deleteMany({});
    await db.collection('techniques').deleteMany({});
    await db.collection('mitigations').deleteMany({});

    if (tactics.length) await db.collection('tactics').insertMany(tactics);
    if (techniques.length) await db.collection('techniques').insertMany(techniques);
    if (mitigations.length) await db.collection('mitigations').insertMany(mitigations);

    res.status(200).json({ message: 'Data synchronized successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to synchronize data' });
  }
}
