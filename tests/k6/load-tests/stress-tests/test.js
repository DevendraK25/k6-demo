import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 50 }, // Ramp up to 50 users to spike CPU
        { duration: '1m', target: 50 },
    ],
};

export default function () {
    const url = 'http://blog-api:8002/blog/';
    const res = http.get(url, {
        headers: { 'Connection': 'close' },
    });

    // 3. Functional check
    check(res, {
        'is status 200': (r) => r.status === 200,
        'body contains blog': (r) => r.body && r.body.includes('blog'),
    });

    sleep(1);
}