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
    console.log('Connected to database'); // Log successful database connection

    const { 
      irExperience, 
      securityMaturity, 
      industrySector, 
      complianceRequirements, 
      stakeholderInvolvement 
    } = req.body;

    console.log('Received request body:', req.body); // Log the received request body

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

    console.log('Fetched random tactic, technique, and mitigation'); // Log successful data fetch

    if (!tactic || !technique || !mitigation) {
      throw new Error('Failed to fetch required data from database');
    }

    const scenario = {
      title: `${tactic.name} Tactic with ${technique.name} Technique and ${mitigation.name} Mitigation`,
      description: `A ${securityMaturity} security maturity ${industrySector} organization with ${irExperience} incident response (IR) experience faces a security incident where the attacker employed the ${tactic.name} tactic and leveraged the ${technique.name} technique. In response, the team must implement ${mitigation.name} as part of the remediation efforts. ${
    complianceRequirements ? `Compliance with ${complianceRequirements} is required, adding further complexity.` : ''
  } ${stakeholderInvolvement ? `Key stakeholders involved in this scenario: ${stakeholderInvolvement}.` : ''} The team must address the situation while minimizing business impact and ensuring recovery and continuity.`,
      //businessImpact: "High",  // New field for business impact
      //attackVector: "Spearphishing",  // New field for attack vector
      tactic,  // Randomized tactic
      technique,  // Randomized technique
      mitigation,  // Randomized mitigation
      irExperience,
      securityMaturity,
      industrySector,
      complianceRequirements,
      stakeholderInvolvement,
      steps: [
        {
          title: 'Detection',
          question: `How would your team detect this ${incidentType} incident using your current tools and processes?`
        },
        {
          title: 'Analysis',
          question: `What steps would your team take to analyze the extent of the ${technique.name} technique used in this incident?`
        },
        {
          title: 'Containment',
          question: `How would your team contain the spread of this incident, considering the ${tactic.name} tactic employed?`
        },
        {
          title: 'Eradication',
          question: `What steps would your team take to eradicate the threat, considering the ${mitigation.name} mitigation strategy?`
        },
        {
          title: 'Recovery',
          question: 'How would your team ensure that systems are securely restored and normal operations resumed?'
        },
        {
          title: 'Lessons Learned',
          question: 'What key lessons can be drawn from this incident to improve your organization\'s security posture?'
        }
      ]
    };
    
    console.log('Generated scenario:', scenario); // Log the generated scenario
    res.status(200).json(scenario);
  } catch (error) {
    console.error('Error generating scenario:', error);
    if (error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: 'Error generating scenario', details: error.message });
  }
}
