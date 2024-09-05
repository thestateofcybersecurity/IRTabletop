import axios from 'axios';

const MITRE_API_URL = 'https://api.mitre.org/att&ck/v1';

export async function getMitreTactics(tacticIds) {
  try {
    const response = await axios.get(`${MITRE_API_URL}/tactics`, {
      params: {
        ids: tacticIds.join(','),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching MITRE ATT&CK tactics:', error);
    return [];
  }
}
