import axios from 'axios';

const MITRE_API_URL = 'https://cti-taxii.mitre.org/stix/collections/95ecc380-afe9-11e4-9b6c-751b66dd541e/objects';

export async function fetchMitreData() {
  try {
    const response = await axios.get(MITRE_API_URL, {
      headers: {
        'Accept': 'application/vnd.oasis.stix+json; version=2.0'
      }
    });
    return response.data.objects;
  } catch (error) {
    console.error('Error fetching MITRE data:', error);
    throw error;
  }
}

export function categorizeMitreData(objects) {
  const tactics = objects.filter(obj => obj.type === 'x-mitre-tactic');
  const techniques = objects.filter(obj => obj.type === 'attack-pattern');
  const mitigations = objects.filter(obj => obj.type === 'course-of-action');

  return { tactics, techniques, mitigations };
}
