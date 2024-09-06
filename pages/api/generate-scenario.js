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
    const collections = ['tactics', 'techniques', 'mitigations', 'groups', 'software', 'relationships'];
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
    const [groups] = await db.collection('groups').aggregate([{ $sample: { size: 1 } }]).toArray();
    const [software] = await db.collection('software').aggregate([{ $sample: { size: 1 } }]).toArray();
    const [relationships] = await db.collection('relationships').aggregate([{ $sample: { size: 1 } }]).toArray();

    console.log('Fetched random tactic, technique, groups, software, relationships, and mitigation'); // Log successful data fetch

    if (!tactic || !technique || !mitigation || !groups || !software || !relationships) {
      throw new Error('Failed to fetch required data from database');
    }

    const scenario = {
      title: `${group.name} Attack Using ${tactic.name} and ${technique.name}`,
      description: `An adversary group known as ${group.name} (aliases: ${group.aliases.join(', ')}) has launched an attack against a ${securityMaturity} security maturity ${industrySector} organization with ${irExperience} incident response experience. The group is known for targeting industries such as ${group.description}. In this scenario, the attackers have employed the ${tactic.name} tactic to achieve ${tactic.description}. The specific technique being used is ${technique.name}, which involves ${technique.description}. ${software.name} malware is being used in this attack. Mitigation efforts will require the organization to apply ${mitigation.name}, which involves ${mitigation.description}. The attack may impact key business operations and require urgent attention to contain and remediate.`,
      //businessImpact: "High",  // New field for business impact
      //attackVector: "Spearphishing",  // New field for attack vector
      // MITRE-related data: Key elements for scenario realism
      group,  // Attack group responsible
      tactic,  // Tactic describing the attack phase
      technique,  // Technique used to carry out the attack
      software,  // Malware or tool involved in the attack
      mitigation,  // Mitigation measure to counter the attack
      irExperience,
      securityMaturity,
      industrySector,
      complianceRequirements,
      stakeholderInvolvement,
      steps: [
        {
          title: 'Initial Access',
          question: `How would your team detect an attacker gaining initial access through the ${technique.name} technique? What tools (e.g., SIEM, EDR) would help you detect this activity?`
        },
        {
          title: 'Lateral Movement',
          question: `What steps would your team take to detect and contain lateral movement within the network? How would you stop the adversary from accessing additional systems via ${tactic.name}?`
        },
        {
          title: 'Persistence',
          question: `What actions would your team take to prevent the adversary from establishing persistence? The technique employed is ${technique.name}.`
        },
        {
          title: 'Containment',
          question: `Given the ${software.name} malware is active, what containment steps would your team take? How would you isolate the infected systems and prevent further spread of the attack?`
        },
        {
          title: 'Eradication',
          question: `What eradication methods would your team use to remove ${software.name} malware? How does the ${mitigation.name} mitigation strategy assist in fully removing the attack?`
        },
        {
          title: 'Recovery',
          question: 'How would your team ensure that systems are securely restored and business operations can safely resume after the attack? What steps would be taken to verify no residual malware exists?'
        },
        {
          title: 'Lessons Learned',
          question: `What key lessons can your team draw from this incident? How can your organization improve its defenses against ${technique.name}?`
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
