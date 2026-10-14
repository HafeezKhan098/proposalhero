// Prints your Lemon Squeezy Store ID and Variant IDs. Reads the key from .env.local on YOUR computer.
// Run:  node --env-file=.env.local scripts/ls-ids.mjs
// It never prints your API key.
const key = process.env.LEMONSQUEEZY_API_KEY;
if (!key) { console.log('LEMONSQUEEZY_API_KEY not found in .env.local'); process.exit(1); }
const headers = { Accept: 'application/vnd.api+json', Authorization: `Bearer ${key}` };
async function get(path) {
  const r = await fetch('https://api.lemonsqueezy.com/v1' + path, { headers });
  if (!r.ok) throw new Error(`${path} failed with status ${r.status}` + (r.status === 401 ? ' (API key rejected: re-copy it)' : ''));
  return r.json();
}
try {
  const stores = await get('/stores');
  console.log('\nSTORES  (use the id as LEMONSQUEEZY_STORE_ID)');
  for (const s of stores.data) console.log(`  id: ${s.id}   name: ${s.attributes.name}`);
  const variants = await get('/variants');
  console.log('\nVARIANTS  (use the id of your Pro monthly one as LEMONSQUEEZY_VARIANT_ID)');
  for (const v of variants.data) {
    const a = v.attributes;
    console.log(`  id: ${v.id}   name: ${a.name}   price: ${(a.price ?? 0) / 100}   subscription: ${a.is_subscription}   interval: ${a.interval ?? '-'}   status: ${a.status}   product: ${a.product_id}`);
  }
  console.log('');
} catch (e) { console.log('Error:', e.message); }
