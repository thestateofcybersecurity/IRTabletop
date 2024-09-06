// Define a list of potential injects that can randomly occur during the exercise
const injects = [
  { id: 1, description: "A key system goes down unexpectedly during containment, increasing downtime." },
  { id: 2, description: "Insider involvement suspected. An employee's credentials have been compromised." },
  { id: 3, description: "Critical communication line between departments fails, leading to delays." },
  { id: 4, description: "New malware variant detected during forensics. Team needs to adjust the mitigation plan." },
  { id: 5, description: "External threat intelligence indicates that the attacker group is known for ransom demands." },
  { id: 6, description: "Legal informs that there is a regulatory deadline approaching for breach disclosure." },
  { id: 7, description: "Third-party vendor was compromised, leading to a possible supply chain attack." },
  { id: 8, description: "Senior leadership requests real-time updates on the status, causing distractions." },
  { id: 9, description: "A DDoS attack begins targeting public-facing systems, adding to the pressure on the response team." },
  { id: 10, description: "A previously undetected backdoor is discovered, indicating persistence by the attacker." },
  { id: 11, description: "Sensitive data appears to have been exfiltrated to an external server." },
  { id: 12, description: "The press has learned of the breach, and the PR team must prepare a response immediately." },
  { id: 13, description: "A second, unrelated incident occurs simultaneously, stretching team resources thin." },
  { id: 14, description: "Regulatory authorities have reached out for immediate details regarding the breach." },
  { id: 15, description: "A key team member is unavailable, causing delays in responding to the incident." }
];

// Function to return a random inject
export function getRandomInject() {
  const randomIndex = Math.floor(Math.random() * injects.length);
  return injects[randomIndex];
}

// Example usage in the TabletopGuide.js
import { getRandomInject } from './Injects';

export default function TabletopGuide({ scenario, addAction }) {
  const inject = getRandomInject(); // Get a random inject when rendering the guide

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Tabletop Exercise Guide</h2>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-semibold mb-2">Random Inject: {inject.description}</h3>

        {/* Continue with the scenario walkthrough steps */}
        <ol className="mb-4 list-decimal pl-6">
          {/* Same steps as before, with random injects integrated */}
        </ol>
      </div>
    </div>
  );
}
