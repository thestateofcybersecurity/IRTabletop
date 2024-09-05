import axios from 'axios';
import { connectToDatabase } from '../../lib/mongodb';

const MITRE_DATA_URL = 'https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json';

export default async function handler(req, res) {
  // Ensure this is a POST request and has the correct secret to prevent unauthorized access
  if (req.method !== 'POST' || req.headers['x-api-key'] !== process.env.UPDATE_SECRET) {
    return res.status(405).json({ error: 'Method not allowed or unauthorized' });
  }

  try {
    // Fetch data from MITRE's GitHub
    const response = await axios.get(MITRE_DATA_URL);
    const mitreData = response.data;

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Process and store the data
    const result = await processMitreData(db, mitreData);

    res.status(200).json({ message: 'MITRE ATT&CK data updated successfully', result });
  } catch (error) {
    console.error('Error updating MITRE ATT&CK data:', error);
    res.status(500).json({ error: 'Failed to update MITRE ATT&CK data' });
  }
}

async function processMitreData(db, mitreData) {
  const collections = {
    'attack-pattern': db.collection('techniques'),
    'course-of-action': db.collection('mitigations'),
    'intrusion-set': db.collection('groups'),
    'malware': db.collection('software'),
    'tool': db.collection('software'),
    'x-mitre-tactic': db.collection('tactics'),
    'x-mitre-matrix': db.collection('matrices'),
    'relationship': db.collection('relationships')
  };

  const results = {};

  for (const [type, collection] of Object.entries(collections)) {
    const objects = mitreData.objects.filter(obj => obj.type === type);
    
    // Remove existing data
    await collection.deleteMany({});
    
    // Insert new data
    if (objects.length > 0) {
      const result = await collection.insertMany(objects);
      results[type] = `Inserted ${result.insertedCount} objects`;
    } else {
      results[type] = 'No objects to insert';
    }
  }

  return results;
}
