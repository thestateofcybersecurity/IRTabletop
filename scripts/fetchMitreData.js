import { Server, Collection } from 'taxii2-js';
import { MemoryStore } from 'stix2-js';
import { connectToDatabase } from '../lib/mongodb';

const TAXII_SERVER_URL = 'https://cti-taxii.mitre.org/taxii/';
const ENTERPRISE_ATTACK_ID = '95ecc380-afe9-11e4-9b6c-751b66dd541e';

async function fetchMitreData() {
  try {
    const server = new Server(TAXII_SERVER_URL);
    const apiRoot = (await server.discovery()).api_roots[0];
    const collection = new Collection(`${apiRoot.url}collections/${ENTERPRISE_ATTACK_ID}/`);
    
    const objects = await collection.getObjects();
    const memoryStore = new MemoryStore(objects);

    const tactics = memoryStore.query({type: 'x-mitre-tactic'});
    const techniques = memoryStore.query({type: 'attack-pattern'});
    const mitigations = memoryStore.query({type: 'course-of-action'});

    return { tactics, techniques, mitigations };
  } catch (error) {
    console.error('Error fetching MITRE data:', error);
    throw error;
  }
}

async function importMitreData() {
  try {
    const { db } = await connectToDatabase();
    const { tactics, techniques, mitigations } = await fetchMitreData();

    // Clear existing data
    await db.collection('tactics').deleteMany({});
    await db.collection('techniques').deleteMany({});
    await db.collection('mitigations').deleteMany({});

    // Import tactics
    if (tactics.length > 0) {
      await db.collection('tactics').insertMany(tactics);
      console.log(`Imported ${tactics.length} tactics`);
    }

    // Import techniques
    if (techniques.length > 0) {
      await db.collection('techniques').insertMany(techniques);
      console.log(`Imported ${techniques.length} techniques`);
    }

    // Import mitigations
    if (mitigations.length > 0) {
      await db.collection('mitigations').insertMany(mitigations);
      console.log(`Imported ${mitigations.length} mitigations`);
    }

    console.log('MITRE ATT&CK data import completed successfully');
  } catch (error) {
    console.error('Error importing MITRE ATT&CK data:', error);
  }
}

// Run the import function
importMitreData();
