import axios from 'axios';
import config from '../config';

export async function getMitreTactics(tacticIds) {
  try {
    const response = await axios.get(`${config.mitre.apiUrl}/tactics`, {
      params: {
        ids: tacticIds.join(','),
      },
      timeout: 5000, // 5 seconds timeout
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching MITRE ATT&CK tactics:', error);
    throw new Error('Failed to fetch MITRE ATT&CK tactics');
  }
}
