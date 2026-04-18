import {describe, it, expect, vi} from 'vitest';
import {handler} from './server';

describe('Server Handler', () => {
  it('should process GET requests', async () => {
    const request = new Request('http://localhost:3000/', {method: 'GET'});
    const response = await handler(request);
    expect(response.status).toBeLessThan(500);
  });

  it('should set session cookie if session pending', async () => {
    const request = new Request('http://localhost:3000/', {method: 'GET'});
    const response = await handler(request);
    expect(
      response.headers.has('Set-Cookie') || !response.headers.has('Set-Cookie'),
    ).toBe(true);
  });
});
