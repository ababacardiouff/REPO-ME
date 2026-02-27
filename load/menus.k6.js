import http from 'k6/http';
import { check } from 'k6';

export const options = { vus: 200, duration: '2m' };

export default function () {
  const res = http.get('https://eats.molam/api/eats/items?vendor=0000');
  check(res, { 'status 200': (r) => r.status === 200 });
}
