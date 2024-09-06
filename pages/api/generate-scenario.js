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
    const { 
      irExperience, 
      securityMaturity, 
      industrySector, 
      incidentType, 
      attackTarget, 
      complianceRequirements, 
      stakeholderInvolvement 
    } = req.body;

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

    const [tactic] = await db.collection('tactics').aggregate([{ $sample: { size: 1 } }]).toArray();
    const [technique] = await db.collection('techniques').aggregate([{ $sample: { size: 1 } }]).toArray();
    const [mitigation] = await db.collection('mitigations').aggregate([{ $sample: { size: 1 } }]).toArray();

    if (!tactic || !technique || !mitigation) {
      throw new Error('Failed to fetch required data from database');
    }

    const scenario = {
      title: `${incidentSeverity} ${incidentType} Incident`,
      description: `A ${securityMaturity} security maturity ${industrySector} organization with ${irExperience} IR experience faces a ${incidentType} targeting their ${attackTarget}. ${complianceRequirements ? `Compliance with ${complianceRequirements} is required.` : ''} ${stakeholderInvolvement ? `Key stakeholders involved: ${stakeholderInvolvement}.` : ''}`,
      businessImpact: "High",  // New field for business impact
      attackVector: "Spearphishing",  // New field for attack vector
      tactic,  // Randomized tactic
      technique,  // Randomized technique
      mitigation,  // Randomized mitigation
      irExperience,
      securityMaturity,
      industrySector,
      incidentType,
      incidentSeverity,
      attackTarget,
      complianceRequirements,
      stakeholderInvolvement
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
