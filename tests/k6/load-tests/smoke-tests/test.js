import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // 1. Static, minimal load
  vus: 3, 
  duration: '30s', 

  // 2. Fail the test if infrastructure is slow or broken
  thresholds: {
    http_req_duration: ['p(99)<50'], // 99% of requests must be under 50ms (no load!)
    http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
  },
};

export default function () {
  const url = 'http://blog-api:8002/blog/'; 
  const res = http.get(url);

  // 3. Functional check
  check(res, {
    'is status 200': (r) => r.status === 200,
    'body contains blog': (r) => r.body && r.body.includes('blog'),
  });

  sleep(1);
}