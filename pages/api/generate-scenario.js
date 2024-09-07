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
    const [group] = await db.collection('groups').aggregate([{ $sample: { size: 1 } }]).toArray();
    const [software] = await db.collection('software').aggregate([{ $sample: { size: 1 } }]).toArray();
    const [relationship] = await db.collection('relationships').aggregate([{ $sample: { size: 1 } }]).toArray();

    console.log('Fetched random tactic, technique, groups, software, relationships, and mitigation'); // Log successful data fetch

    if (!tactic || !technique || !mitigation || !group || !software || !relationship) {
      throw new Error('Failed to fetch required data from database');
    }

    const scenario = {
      title: `${group.name} Attack Using ${tactic.name} and ${technique.name}`,
      description: `An adversary group known as ${group.name} has launched an attack against a ${securityMaturity} security maturity ${industrySector} organization with ${irExperience} incident response experience. The group is known for ${group.description}. In this scenario, the attackers have employed the ${tactic.name} tactic to ${tactic.description}. The specific technique being used is ${technique.name}, which involves ${technique.description}. ${software.name} is being used in this attack. Mitigation efforts will require the organization to apply ${mitigation.name}, which involves ${mitigation.description}. The attack may impact key business operations and require urgent attention to contain and remediate.`,
      //businessImpact: "High",  // New field for business impact
      //attackVector: "Spearphishing",  // New field for attack vector
      // MITRE-related data: Key elements for scenario realism
      group,  // Attack group responsible
      tactic,  // Tactic describing the attack phase
      technique,  // Technique used to carry out the attack
      software,  // Malware or tool involved in the attack
      relationship,
      mitigation,  // Mitigation measure to counter the attack
      irExperience,
      securityMaturity,
      industrySector,
      complianceRequirements,
      stakeholderInvolvement,
      steps: [
    {
      title: 'Step 1: Detection',
      initialQuestion: 'How was the attack detected?',
      content: 'What monitoring systems provided the first alert? Was the detection internal or external? How long after the compromise was the attack detected? What indicators of compromise (IoCs) were observed? Could earlier detection have prevented the breach?',
      recommendations: 'Enhance monitoring and detection tools. Increase network visibility. Regularly update threat intelligence feeds. Deploy endpoint detection and response (EDR) across critical systems.',
      discussionPrompts: 'What were the initial indicators of compromise (IoCs)? How did the team determine the severity of the incident?'
    },
    {
      title: 'Step 2: Initial Evaluation',
      initialQuestion: 'What was the initial response after detection?',
      content: 'Who was notified first? What criteria were used to classify the incident? Was there any immediate triage or analysis done before escalation? What priority level was assigned to the incident?',
      recommendations: 'Review and enhance the incident classification process. Ensure clear ownership and responsibility for decision-making. Ensure prompt communication with key stakeholders.',
      discussionPrompts: 'How well did the communication flow during the incident? Did the team follow established processes, or were any processes missed?'
    },
    {
      title: 'Step 3: Containment',
      initialQuestion: 'What actions were taken to contain the incident?',
      content: 'Which systems were isolated to prevent the spread of the attack? What communication channels were used to coordinate containment? Were backup or redundant systems engaged? Was there a decision to monitor the attacker further before containment, and why? Was the containment fully successful, or were there breaches after the containment was applied?',
      recommendations: 'Test and improve containment procedures regularly through tabletop exercises. Ensure that communication protocols between teams are optimized for efficiency. Document all containment actions for forensic and legal purposes.',
      discussionPrompts: 'Were the containment measures effective in preventing further spread? Did any communication issues delay or complicate containment? Were additional vulnerabilities discovered during containment?'
    },
    {
      title: 'Step 4: Forensics and Evidence Gathering',
      initialQuestion: 'What data and logs were collected for forensic analysis?',
      content: 'Were memory snapshots, disk images, or log files collected? What forensic tools were used (e.g., FTK, EnCase, open-source tools)? Was evidence collected in a forensically sound manner to preserve integrity (chain of custody)? What artifacts were prioritized for collection (network traffic, file changes, etc.)?',
      recommendations: 'Conduct additional training on forensics tools and evidence collection. Ensure all team members know how to maintain the chain of custody for evidence. Simulate forensic analysis during tabletop exercises to enhance team proficiency.',
      discussionPrompts: 'What challenges did the team face during forensics? Were any critical data sources (logs, system snapshots) missing or corrupted? Was there enough documentation and tracking of forensic processes?'
    },
    {
      title: 'Step 5: Notification and Stakeholder Involvement',
      initialQuestion: 'Who was notified about the incident, and when?',
      content: 'Which internal and external stakeholders were notified (e.g., Legal, PR, C-Suite)? Were customers or partners impacted, and were they notified? Was there a regulatory requirement to disclose the breach (GDPR, HIPAA, etc.)? Were law enforcement agencies involved in the response?',
      recommendations: 'Strengthen communication channels for better coordination between internal teams and external stakeholders. Ensure legal and compliance teams are actively involved in notification processes.',
      discussionPrompts: 'How well did communication flow during the notification process? Were any key stakeholders unaware of the incident until later stages?'
    },
    {
      title: 'Step 6: Mitigation and Eradication',
      initialQuestion: 'How was the attack vector mitigated?',
      content: 'What mitigation steps were taken (e.g., patching, reconfiguration, removing malware)? Was a fix tested in a non-production environment before deployment? Were any bypasses attempted or successful against the mitigation? How was the success of the mitigation verified? Was there any residual risk after mitigation, and how was it addressed?',
      recommendations: 'Regularly review mitigation techniques and test them in simulated environments. Ensure backup strategies are resilient to malware attacks and tested regularly. Perform post-mitigation testing to confirm all vulnerabilities have been closed.',
      discussionPrompts: 'Were any mitigation bypass attempts discovered? How were they handled? Did the mitigation create any further vulnerabilities or issues? Were the mitigation steps sufficient to prevent further exploitation?'
    },
    {
      title: 'Step 7: Recovery',
      initialQuestion: 'What steps were taken to recover systems and restore business operations?',
      content: 'Were systems restored from backups, or were new systems built? What was the time required for full recovery? Were there challenges in restoring services (e.g., data corruption, configuration issues)? Was there any communication with customers about the recovery process?',
      recommendations: 'Review recovery workflows to ensure minimal downtime and test regularly. Ensure that backups are regularly tested for integrity and ease of use in real incidents. Strengthen disaster recovery and business continuity plans (BCP) to minimize business disruption.',
      discussionPrompts: 'What obstacles were faced during recovery? Were there any delays in restoring systems due to untested backups? Were recovery efforts prioritized based on business impact?'
    },
    {
      title: 'Step 8: Post-Incident Review',
      initialQuestion: 'Conduct a blameless post-incident review (retrospective).',
      content: 'What worked well during the response? What areas need improvement? Were there any major communication breakdowns? Did the tools and processes in place meet the team\'s needs? What gaps were identified in detection, response, or recovery?',
      recommendations: 'Ensure post-incident reviews focus on process improvement, not blame. Document lessons learned and update the incident response plan accordingly. Incorporate feedback from the team to improve future incident responses.',
      discussionPrompts: 'What lessons were learned from this incident? What gaps were identified in the incident response playbook? How can the response process be improved for future incidents?'
    }
  ];
}
}
}  
