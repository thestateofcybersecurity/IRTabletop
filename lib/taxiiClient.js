import { Server } from 'taxii2-js';

const taxiiServerUrl = process.env.TAXII_SERVER_URL;
const enterpriseAttackId = process.env.ENTERPRISE_ATTACK_ID;

export async function fetchMitreData() {
  const server = new Server(taxiiServerUrl);
  const apiRoot = (await server.discovery()).api_roots[0];
  const collection = (await apiRoot.collections()).find(c => c.id === enterpriseAttackId);
  
  if (!collection) {
    throw new Error('Enterprise ATT&CK collection not found');
  }

  const objects = await collection.getObjects();
  return objects.objects;
}

export function categorizeMitreData(objects) {
  const tactics = objects.filter(obj => obj.type === 'x-mitre-tactic');
  const techniques = objects.filter(obj => obj.type === 'attack-pattern');
  const mitigations = objects.filter(obj => obj.type === 'course-of-action');

  return { tactics, techniques, mitigations };
}
