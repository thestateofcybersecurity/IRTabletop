import { connectToDatabase } from '../../lib/mongodb';
import { getMitreTactics } from '../../lib/mitre-api';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { irExperience, securityMaturity } = req.body;
      const { db } = await connectToDatabase();

      // Fetch a random scenario from MongoDB based on input criteria
      const scenario = await db.collection('scenarios').aggregate([
        { $match: { experience: irExperience, maturity: securityMaturity } },
        { $sample: { size: 1 } }
      ]).toArray();

      if (scenario.length === 0) {
        return res.status(404).json({ error: 'No matching scenario found' });
      }

      // Fetch relevant MITRE ATT&CK tactics
      const mitreTactics = await getMitreTactics(scenario[0].tactics);

      // Combine scenario with MITRE tactics
      const fullScenario = {
        ...scenario[0],
        mitreTactics,
      };

      res.status(200).json(fullScenario);
    } catch (error) {
      res.status(500).json({ error: 'Error generating scenario' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
