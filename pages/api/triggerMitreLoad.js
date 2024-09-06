import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.headers['x-vercel-signature'] !== process.env.VERCEL_DEPLOY_HOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Trigger the loadMitreData endpoint
    await axios.post(`${process.env.VERCEL_URL}/api/loadMitreData`, null, {
      headers: { 'x-api-key': process.env.MITRE_LOAD_SECRET }
    });

    res.status(200).json({ message: 'MITRE data load triggered successfully' });
  } catch (error) {
    console.error('Error triggering MITRE data load:', error);
    res.status(500).json({ error: 'Failed to trigger MITRE data load' });
  }
}
