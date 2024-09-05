import clientPromise from '../../lib/mongodb';
import { fetchMitreData, categorizeMitreData } from '../../lib/taxiiClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db('mitre_cache');

      const mitreData = await fetchMitreData();
      if (!mitreData || mitreData.length === 0) {
        throw new Error('No data received from MITRE ATT&CK');
      }

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
      res.status(500).json({ error: 'Failed to synchronize data', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
