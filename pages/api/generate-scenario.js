import { connectToDatabase } from '../../lib/mongodb';
import { getMitreTactics } from '../../lib/mitre-api';
import { authenticateUser } from '../../middleware/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await authenticateUser(req, res, async () => {
      const { irExperience, securityMaturity } = req.body;

      if (!irExperience || !securityMaturity) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { db } = await connectToDatabase();

      const scenario = await db.collection('scenarios').aggregate([
        { $match: { experience: irExperience, maturity: securityMaturity } },
        { $sample: { size: 1 } }
      ]).toArray();

      if (scenario.length === 0) {
        return res.status(404).json({ error: 'No matching scenario found' });
      }

      const mitreTactics = await getMitreTactics(scenario[0].tactics);

      const fullScenario = {
        ...scenario[0],
        mitreTactics,
      };

      res.status(200).json(fullScenario);
    });
  } catch (error) {
    console.error('Error generating scenario:', error);
    res.status(500).json({ error: 'Error generating scenario' });
  }
}
