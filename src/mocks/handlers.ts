import { HttpResponse, http } from 'msw';
import db from './db';

let integrations = { esamHit: true, dnbHit: true };

export const handlers = [
  http.get('/api/integrations', () => {
    return HttpResponse.json(integrations);
  }),
  http.post('/api/integrations', async ({ request }) => {
    const body = await request.json();
    integrations = { ...integrations, ...body };
    return HttpResponse.json(integrations);
  }),

  http.get('/api/esam-lookup', ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name') || 'Unknown Co.';
    if (!integrations.esamHit) return HttpResponse.json({ hit: false });
    return HttpResponse.json({
      hit: true,
      name,
      address: '1 Main St',
      city: 'LA',
      state: 'CA',
      zip: '90001',
      website: 'https://example.com',
    });
  }),

  http.get('/api/dnb-lookup', ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name') || 'Unknown Co.';
    if (!integrations.dnbHit) return HttpResponse.json({ hit: false });
    const ageYears = Math.floor(Math.random() * 8);
    const companyType = ageYears < 3 ? 'Startup' : 'Corporation';
    return HttpResponse.json({ hit: true, name, ageYears, companyType });
  }),

  http.get('/api/applications', () => {
    return HttpResponse.json(db.apps.all());
  }),
  http.post('/api/applications', async ({ request }) => {
    const body = await request.json();
    const created = db.apps.createDraft(body);
    return HttpResponse.json(created);
  }),
  http.patch('/api/applications/:id', async ({ request, params }) => {
    const patch = await request.json();
    const item = db.apps.update(params.id!, patch);
    return HttpResponse.json(item);
  }),
  http.post('/api/applications/:id/transition', async ({ request, params }) => {
    const { next, note } = await request.json();
    const item = db.apps.transition(params.id!, next, note);
    return HttpResponse.json(item);
  }),

  http.get('/api/applications/:id/referrals', ({ params }) => {
    return HttpResponse.json(db.referrals.list(params.id!));
  }),
  http.post('/api/applications/:id/referrals/send', ({ params }) => {
    return HttpResponse.json(db.referrals.send(params.id!));
  }),
  http.post('/api/applications/:id/referrals/:rid/reply', async ({ request, params }) => {
    const payload = await request.json();
    return HttpResponse.json(db.referrals.reply(params.id!, params.rid!, payload));
  }),

  http.get('/api/i18n', () => {
    return HttpResponse.json(db.i18n.getAll());
  }),
  http.patch('/api/i18n', async ({ request }) => {
    return HttpResponse.json(db.i18n.update(await request.json()));
  }),

  http.post('/api/csv/import', async ({ request }) => {
    return HttpResponse.json(db.csv.import(await request.json()));
  }),
  http.post('/api/csv/export', async ({ request }) => {
    return HttpResponse.json(db.csv.export(await request.json()));
  }),

  http.post('/api/seeds/reset', () => {
    db.reset();
    return HttpResponse.json({ ok: true });
  }),
];
