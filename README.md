# Trade Credit Approval — Pure Frontend Prototype

Tech: Vue 3 + Vite + Pinia + Vue Router + Element-Plus + MSW + vee-validate.  
Local-only, no backend.

## Install / Run
```bash
pnpm i
pnpm dev            # starts Vite and MSW
pnpm seed:reset     # optional: reseed mock data (Diagnostics page has a Reset button)
pnpm lint
```

## Test accounts
- admin/demo1234
- station/demo1234
- l1/demo1234
- l2/demo1234
- accounting/demo1234
- sales/demo1234

## Key decisions (agreed)
1. Credit amount calculation -> **manual input** in approval letter.
2. Customer auth/signature -> **anonymous link + SMS OTP** for MVP.
3. Attachments -> **≤ 5MB; pdf/jpg/png** only (frontend-validated).
4. Rejection flow -> **any stage reject => Rejected** (reason required).
5. Referral sanity -> **AvgDays ≤ 120; PastDue ≤ OpenAR** (admin-adjustable later).
6. i18n admin -> **editable & reset-to-default** allowed.
7. Notifications -> **UI + AuditLog** in prototype; event bus later.
8. CSV merge key -> **TaxIdNo**; optional **update blank-only** mode.
9. Privacy -> **store masked values only**; in production only keep **hash+salt fingerprints**, never raw.
10. Review comments -> **plain text** for MVP.

## Routes
- /login
- /applications (list)
- /applications/new, /applications/:id/edit (form)
- /applications/:id (detail + audit)
- /applications/:id/referrals (accounting)
- /reviews/l1, /reviews/l2, /reviews/station
- /letters/preview?applicationId=...
- /diagnostics
- /settings/i18n
