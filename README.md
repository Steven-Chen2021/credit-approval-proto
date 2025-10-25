# Trade Credit Approval Prototype

A Vue 3 + Vite single-page application that models the full front-office flow of trade credit approvals. It is deliberately frontend-only and relies on MSW mocks to emulate backend calls, allowing the product team to iterate on UX and domain rules rapidly.

## Stack
- Vue 3 with the `<script setup>` composition API
- Vite build tooling with TypeScript support
- Pinia for application stores (authentication, applications, diagnostics, etc.)
- Vue Router with role-aware navigation guards (the root path now redirects to `/applications`)
- Element Plus component library and vee-validate form validation
- MSW for realistic API mocks and seed/reset utilities

## Getting started
```bash
pnpm install
pnpm dev            # starts Vite with the MSW worker
pnpm seed:reset     # optional: reseed mock data (can also be done via Diagnostics page)
pnpm lint
```

The development server runs at http://localhost:5173 by default. MSW is automatically registered so that the mocked APIs and authentication flow work without extra setup.

## Test accounts
| Role        | Credentials     |
| ----------- | --------------- |
| Admin       | admin/demo1234  |
| Station Mgr | station/demo1234|
| L1 Reviewer | l1/demo1234     |
| L2 Reviewer | l2/demo1234     |
| Accounting  | accounting/demo1234 |
| Sales       | sales/demo1234  |

## Functional highlights
1. **Applications lifecycle** — create, edit, review, and audit application records with mock data sources.
2. **Role-based access** — navigation guards gate each route to the roles defined in `src/router/index.ts`; unauthorized users are redirected to `/applications`.
3. **Referral checks** — diagnostic helpers ensure referral sanity (AvgDays ≤ 120; PastDue ≤ OpenAR) while remaining adjustable for future iterations.
4. **Letter generation** — preview approval/rejection letters with manual credit amount input, ready for future integrations.
5. **Localization tools** — an i18n admin section allows editing translations with the ability to reset to defaults.

## Routes
- `/` → redirects to `/applications`
- `/login`
- `/applications` — list view
- `/applications/new`, `/applications/:id/edit` — creation/editing form
- `/applications/:id` — detail view with audit log
- `/applications/:id/referrals` — accounting referral checks
- `/reviews/l1`, `/reviews/l2`, `/reviews/station` — manager work queues
- `/letters/preview?applicationId=...`
- `/diagnostics`
- `/settings/i18n`

## Future considerations
- Replace MSW mocks with backend APIs and shared authentication.
- Harden file attachment validation server-side.
- Extend notification system beyond UI/audit logs once event infrastructure is available.
