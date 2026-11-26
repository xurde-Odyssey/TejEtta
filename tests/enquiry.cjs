const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
function load(file, mocks = {}) {
  const model = new Module(file, module);
  model.paths = module.paths;
  model.require = name => name in mocks ? mocks[name] : require(name);
  model._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, file);
  return model.exports;
}
const { buildWhatsAppEnquiry } = load('lib/enquiry-message.ts', { './contact': { contact: { whatsappUrl: 'https://wa.me/123' } } });
const data = new FormData();
data.set('name', 'Test Customer');
data.set('location', 'Kathmandu');
const message = new URL(buildWhatsAppEnquiry(data, [
  { product: { name: 'First Class', grade: 'No. 1', unit: 'piece' }, quantity: 2500 },
  { product: { name: 'Tukra', grade: 'Broken', unit: 'tractor' }, quantity: 2 },
])).searchParams.get('text');
assert.match(message, /Product 1: First Class/);
assert.match(message, /Quantity: 2,500 pcs/);
assert.match(message, /Product 2: Tukra/);
assert.match(message, /Quantity: 2 full loaded tractors/);
const { POST } = load('app/api/enquiry/route.ts');
const payload = { name: 'Test Customer', phone: '9800000000', location: 'Kathmandu', consent: true, items: [{ grade: 'first', quantity: 2500 }, { grade: 'tukra', quantity: 2 }] };
const request = body => new Request('https://example.com/api/enquiry', { method: 'POST', headers: { origin: 'https://example.com' }, body: JSON.stringify(body) });
(async () => {
  const originalFetch = global.fetch;
  const originalDestination = process.env.ENQUIRY_WEBHOOK_URL;
  process.env.ENQUIRY_WEBHOOK_URL = 'https://example.com/webhook';
  let delivered;
  global.fetch = async (_, options) => { delivered = JSON.parse(options.body); return new Response('{}'); };
  try {
    assert.equal((await POST(request(payload))).status, 200);
    assert.deepEqual(delivered.items, payload.items);
    for (const items of [[], [{ grade: 'first', quantity: 0 }], [{ grade: 'tukra', quantity: 1.5 }], [{ grade: 'unknown', quantity: 1 }], [payload.items[0], payload.items[0]]]) {
      assert.equal((await POST(request({ ...payload, items }))).status, 400);
    }
  } finally {
    global.fetch = originalFetch;
    if (originalDestination === undefined) delete process.env.ENQUIRY_WEBHOOK_URL;
    else process.env.ENQUIRY_WEBHOOK_URL = originalDestination;
  }
  console.log('Multi-product enquiry message, delivery and validation checks passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
