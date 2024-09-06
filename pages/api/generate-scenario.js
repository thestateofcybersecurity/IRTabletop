import { connectToDatabase } from '../../lib/mongodb';
import { authenticateUser } from '../../middleware/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate the user
    await new Promise((resolve, reject) => {
      authenticateUser(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        resolve(result);
      });
    });

    const { db } = await connectToDatabase();
    const { irExperience, securityMaturity } = req.body;

    if (!irExperience || !securityMaturity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if collections exist and have data
    const collections = ['tactics', 'techniques', 'mitigations'];
    for (const collection of collections) {
      const count = await db.collection(collection).countDocuments();
      console.log(`${collection} count:`, count);
      if (count === 0) {
        throw new Error(`${collection} collection is empty`);
      }
    }

    // Fetch random tactic, technique, and mitigation
    const [tactic] = await db.collection('tactics').aggregate([{ $sample: { size: 1 } }]).toArray();
    console.log('Fetched tactic:', tactic ? tactic.name : 'None');

    const [technique] = await db.collection('techniques').aggregate([{ $sample: { size: 1 } }]).toArray();
    console.log('Fetched technique:', technique ? technique.name : 'None');

    const [mitigation] = await db.collection('mitigations').aggregate([{ $sample: { size: 1 } }]).toArray();
    console.log('Fetched mitigation:', mitigation ? mitigation.name : 'None');

    if (!tactic || !technique || !mitigation) {
      throw new Error('Failed to fetch required data from database');
    }

    // Generate scenario
    const scenario = {
      title: `${irExperience} level scenario for ${securityMaturity} maturity`,
      description: `An attacker is using the ${technique.name} technique, which is part of the ${tactic.name} tactic. Your team needs to respond and implement the ${mitigation.name} mitigation.`,
      tactic: tactic,
      technique: technique,
      mitigation: mitigation,
      irExperience: irExperience,
      securityMaturity: securityMaturity
    };

    res.status(200).json(scenario);
  } catch (error) {
    console.error('Error generating scenario:', error);
    if (error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: 'Error generating scenario' });
  }
}
