import axios from 'axios';
import { connectToDatabase } from '../../lib/mongodb';

const MITRE_DATA_URL = 'https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic security check - you should replace this with proper authentication
  if (req.headers['x-api-key'] !== process.env.MITRE_LOAD_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { db } = await connectToDatabase();

    // Fetch MITRE ATT&CK data
    const response = await axios.get(MITRE_DATA_URL);
    const mitreData = response.data.objects;

    // Define collections to populate
    const collections = [
      { name: 'tactics', type: 'x-mitre-tactic' },
      { name: 'techniques', type: 'attack-pattern' },
      { name: 'mitigations', type: 'course-of-action' },
      { name: 'groups', type: 'intrusion-set' },
      { name: 'software', type: 'malware' }, // Note: 'tool' type should also be included here
      { name: 'relationships', type: 'relationship' }
    ];

    // Process and insert data
    for (const collection of collections) {
      const data = mitreData.filter(item => item.type === collection.type);
      if (data.length > 0) {
        await db.collection(collection.name).deleteMany({}); // Clear existing data
        await db.collection(collection.name).insertMany(data);
        console.log(`Inserted ${data.length} items into ${collection.name}`);
      }
    }

    // Handle 'tool' type for software collection separately
    const toolData = mitreData.filter(item => item.type === 'tool');
    if (toolData.length > 0) {
      await db.collection('software').insertMany(toolData);
      console.log(`Inserted ${toolData.length} tools into software collection`);
    }

    res.status(200).json({ message: 'MITRE ATT&CK data loaded successfully' });
  } catch (error) {
    console.error('Error loading MITRE ATT&CK data:', error);
    res.status(500).json({ error: 'Failed to load MITRE ATT&CK data' });
  }
}
