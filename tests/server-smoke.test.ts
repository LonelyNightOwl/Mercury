import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from 'node:http';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { app, stringifyError, withGeminiTimeout } from '../server';
import { MerchantProvider } from '../src/context/MerchantContext';
import { MercuryCopilot } from '../src/components/copilot/MercuryCopilot';

test('withGeminiTimeout rejects after the configured delay', async () => {
  await assert.rejects(
    () => withGeminiTimeout(new Promise(() => undefined), 25),
    /timed out/i,
  );
});

test('stringifyError extracts upstream API messages', () => {
  const message = stringifyError({
    error: {
      code: 503,
      message: 'This model is currently experiencing high demand.',
      status: 'UNAVAILABLE',
    },
  });

  assert.match(message, /high demand/i);
});

test('MercuryCopilot renders safely with its provider state initialized', () => {
  const markup = renderToStaticMarkup(
    React.createElement(
      MerchantProvider,
      null,
      React.createElement(MercuryCopilot)
    )
  );

  assert.match(markup, /MERCURY Copilot/i);
});

test('health endpoint responds and AI route returns fallback payload', async () => {
  const server = createServer(app);
  server.listen(0);
  await once(server, 'listening');

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Server did not bind to a TCP port');
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;

  const healthResponse = await fetch(`${baseUrl}/api/health`);
  const healthBody = await healthResponse.json();
  assert.equal(healthResponse.status, 200);
  assert.equal(healthBody.status, 'ok');

  const aiResponse = await fetch(`${baseUrl}/api/copilot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Why did my revenue fall yesterday?',
      contextSnapshot: { module: 'revenue' },
    }),
  });
  const aiBody = await aiResponse.json();

  assert.equal(aiResponse.status, 200);
  assert.match(aiBody.content, /Revenue Specialist|MERCURY Command Centre/i);

  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve(undefined)));
  });
});
