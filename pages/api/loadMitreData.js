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
    console.log('Starting MITRE data load process');
    const { db } = await connectToDatabase();
    console.log('Connected to database');

    // Fetch MITRE ATT&CK data
    console.log('Fetching MITRE ATT&CK data');
    const response = await axios.get(MITRE_DATA_URL);
    const mitreData = response.data.objects;
    console.log(`Fetched ${mitreData.length} objects`);

    // Define collections to populate
    const collections = [
      { name: 'tactics', type: 'x-mitre-tactic' },
      { name: 'techniques', type: 'attack-pattern' },
      { name: 'mitigations', type: 'course-of-action' },
      { name: 'groups', type: 'intrusion-set' },
      { name: 'software', type: 'malware' },
      { name: 'relationships', type: 'relationship' }
    ];

    // Process and insert data
    for (const collection of collections) {
      console.log(`Processing ${collection.name}`);
      const data = mitreData.filter(item => item.type === collection.type);
      if (data.length > 0) {
        await db.collection(collection.name).deleteMany({}); // Clear existing data
        const result = await db.collection(collection.name).insertMany(data);
        console.log(`Inserted ${result.insertedCount} items into ${collection.name}`);
      } else {
        console.log(`No data to insert for ${collection.name}`);
      }
    }

    // Handle 'tool' type for software collection separately
    console.log('Processing tools');
    const toolData = mitreData.filter(item => item.type === 'tool');
    if (toolData.length > 0) {
      const result = await db.collection('software').insertMany(toolData);
      console.log(`Inserted ${result.insertedCount} tools into software collection`);
    } else {
      console.log('No tool data to insert');
    }

    console.log('MITRE data load process completed');
    res.status(200).json({ message: 'MITRE ATT&CK data loaded successfully' });
  } catch (error) {
    console.error('Error loading MITRE ATT&CK data:', error);
    res.status(500).json({ error: 'Failed to load MITRE ATT&CK data', details: error.message });
  }
}
