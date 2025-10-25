import { rest } from 'msw';
import db from './db';

let integrations = { esamHit: true, dnbHit: true };

export const handlers = [
  rest.get('/api/integrations', (req, res, ctx) => {
    return res(ctx.json(integrations));
  }),
  rest.post('/api/integrations', async (req, res, ctx) => {
    const body = await req.json();
    integrations = { ...integrations, ...body };
    return res(ctx.json(integrations));
  }),

  rest.get('/api/esam-lookup', (req, res, ctx) => {
    const url = new URL(req.url);
    const name = url.searchParams.get('name') || 'Unknown Co.';
    if (!integrations.esamHit) return res(ctx.json({ hit: false }));
    return res(
      ctx.json({
        hit: true,
        name,
        address: '1 Main St',
        city: 'LA',
        state: 'CA',
        zip: '90001',
        website: 'https://example.com',
      })
    );
  }),

  rest.get('/api/dnb-lookup', (req, res, ctx) => {
    const url = new URL(req.url);
    const name = url.searchParams.get('name') || 'Unknown Co.';
    if (!integrations.dnbHit) return res(ctx.json({ hit: false }));
    const ageYears = Math.floor(Math.random() * 8);
    const companyType = ageYears < 3 ? 'Startup' : 'Corporation';
    return res(ctx.json({ hit: true, name, ageYears, companyType }));
  }),

  rest.get('/api/applications', (req, res, ctx) => {
    return res(ctx.json(db.apps.all()));
  }),
  rest.post('/api/applications', async (req, res, ctx) => {
    const body = await req.json();
    const created = db.apps.createDraft(body);
    return res(ctx.json(created));
  }),
  rest.patch('/api/applications/:id', async (req, res, ctx) => {
    const patch = await req.json();
    const item = db.apps.update(req.params.id, patch);
    return res(ctx.json(item));
  }),
  rest.post('/api/applications/:id/transition', async (req, res, ctx) => {
    const { next, note } = await req.json();
    const item = db.apps.transition(req.params.id, next, note);
    return res(ctx.json(item));
  }),

  rest.get('/api/applications/:id/referrals', (req, res, ctx) => {
    return res(ctx.json(db.referrals.list(req.params.id)));
  }),
  rest.post('/api/applications/:id/referrals/send', (req, res, ctx) => {
    return res(ctx.json(db.referrals.send(req.params.id)));
  }),
  rest.post('/api/applications/:id/referrals/:rid/reply', async (req, res, ctx) => {
    const payload = await req.json();
    return res(ctx.json(db.referrals.reply(req.params.id, req.params.rid, payload)));
  }),

  rest.get('/api/i18n', (req, res, ctx) => {
    return res(ctx.json(db.i18n.getAll()));
  }),
  rest.patch('/api/i18n', async (req, res, ctx) => {
    return res(ctx.json(db.i18n.update(await req.json())));
  }),

  rest.post('/api/csv/import', async (req, res, ctx) => {
    return res(ctx.json(db.csv.import(await req.json())));
  }),
  rest.post('/api/csv/export', async (req, res, ctx) => {
    return res(ctx.json(db.csv.export(await req.json())));
  }),

  rest.post('/api/seeds/reset', (req, res, ctx) => {
    db.reset();
    return res(ctx.json({ ok: true }));
  }),
];
