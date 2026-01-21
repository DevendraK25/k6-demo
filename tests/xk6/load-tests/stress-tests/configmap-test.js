import { Kubernetes } from 'k6/x/kubernetes';
import { sleep } from 'k6';

const k8s = new Kubernetes();

export const options = {
  stages: [
    { duration: '30s', target: 5 },   // Ramp up to 5 VUs
    { duration: '1m', target: 10 },   // Ramp up to 10 VUs
    { duration: '2m', target: 10 },   // Stay at 10 VUs
    { duration: '30s', target: 20 },  // Spike to 20 VUs
    { duration: '1m', target: 5 },    // Ramp down to 5 VUs
    { duration: '30s', target: 0 },   // Ramp down to 0
  ],
  thresholds: {
    'iteration_duration': ['p(95)<5000'], // 95% of iterations should complete in 5s
  },
};

export default function () {

  // Use VU and iteration number for unique names
  const cmName = `stress-cm-vu${__VU}-iter${__ITER}-${Date.now()}`;

  try {
    // Create ConfigMap
    k8s.create({
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {
        name: cmName,
        namespace: 'default'
      },
      data: {
        "vu": `${__VU}`,
        "iteration": `${__ITER}`,
        "timestamp": `${Date.now()}`
      }
    });

    // Small sleep to simulate processing
    sleep(1);

    // Delete ConfigMap
    k8s.delete('ConfigMap', cmName, 'default');

  } catch (e) {
    console.log(`❌ VU${__VU} Iter${__ITER} failed: ${e}`);
  }

  // Think time between operations
  sleep(Math.random() * 2 + 1);  // Random sleep 1-3 seconds
}