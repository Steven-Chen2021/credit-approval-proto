# Trade Credit Approval Prototype

This project is a Vue 3 + Vite single-page application that prototypes Dimerco's end-to-end trade credit approval workflow. It focuses on coordinating the sales, customer, accounting, and managerial review tasks inside eSAM while supporting Traditional Chinese, Simplified Chinese, and English UI flows.

## Platform overview
- **Frontend stack**: Vue 3 (Composition API with `<script setup>`), TypeScript, Vite, Pinia stores, Vue Router, Element Plus, vee-validate.
- **Mock services**: Mock Service Worker (MSW) emulates APIs, authentication, referrals, and notification hooks so that the entire flow runs without a backend.
- **Localization**: The application ships with tri-language resources (EN/ZH-TW/ZH-CN) and includes an i18n admin console for runtime edits and resets.

## Credit application lifecycle
The prototype models the required status changes, emails, and hand-offs:

1. **Draft** – Sales creates the application in eSAM after completing basic checks. D&B EDI data can be pulled before submission.
2. **Pending-StationMgr** – Auto-triggered for companies younger than three years. The station manager receives an email; rejection ends the process.
3. **Pending-CustomerInput** – For companies operating more than three years, the customer is invited to complete the online application and upload documents.
4. **Referral-Sent / Referral-Received** – Accounting sends the referral check form and captures responses. Each referral is reviewed and marked positive or negative before advancing.
5. **Pending-L1ManagerApproval** – First-level manager review. Rejection immediately moves the application to **Rejected**.
6. **Pending-L2ManagerApproval** – Second-level manager review with identical approval/reject rules.
7. **Approved** – All approvals completed. The system generates and emails the Credit Approval Letter to the customer, copying Sales and Accounting.
8. **Rejected** – Any rejection in the chain terminates the application.

Every transition triggers the expected notification (station manager alerts, customer invitation, referral emails, approval letter dispatch, etc.). Audit trails are displayed inside the application detail view.

## Credit application form
Sales previews the full form before submission; customers later complete the same structure online. Key sections include:

- **Company profile** – Company name, address, city, state, ZIP, website (all sourced from eSAM), estimated annual revenue, sales area, company type (Corporation/Partnership/LLC/S Corporation/Proprietorship/Other), bankruptcy flag, date organized, tax ID, employee count, years at current location, landlord information.
- **Owners / Principals / Officers** – Up to three sets of name, title, address, phone, email, SSN.
- **Shipping information** – Import frequency per ton/TEU/FEU/CBM and estimated freightage amounts.
- **Trade references** – Up to three companies with name, contact, address, phone, fax, website, and required email for verification.
- **Bank references** – Bank details, contact information, checking and savings account numbers, and account tenure.
- **Authorized representative** – Name, title, signature, submission date (auto-filled), optional driver’s license number, plus captured IP for online signing.

Attachments can be uploaded alongside the online submission.

## Referral checks
Accounting can generate the credit referral form, track responses, and record whether each reply is positive. At least two positive referrals are required before managerial reviews can proceed. Consistency checks help flag anomalies (e.g., invoice history shorter than company age).

## Approval letter
Once approvals finish, the system composes the "Credit Approval" letter (based on the provided template) and emails it to the customer with CCs to Sales and Accounting. The letter records the approved terms, credit limit, and advisory notes about ACH setup and credit maintenance expectations.

## Routes
- `/` → redirects to `/applications`
- `/login`
- `/applications` – Application list
- `/applications/new`, `/applications/:id/edit` – Drafting and editing
- `/applications/:id` – Detail view with audit and status history
- `/applications/:id/referrals` – Accounting review workspace
- `/reviews/l1`, `/reviews/l2`, `/reviews/station` – Manager queues
- `/letters/preview?applicationId=...` – Approval letter preview
- `/diagnostics` – MSW data seeding/reset tools
- `/settings/i18n` – Localization editor

## Getting started
```bash
pnpm install
pnpm dev            # start Vite with MSW worker
pnpm seed:reset     # reseed mock data (can also be done via Diagnostics page)
pnpm lint
```

Development runs at http://localhost:5173 with MSW registering automatically so authentication and mocked APIs work out-of-the-box.

## Future extensions
- Replace MSW mocks with live backend services and unified identity.
- Automate D&B EDI pulls and referral email delivery through server-side workflows.
- Add richer analytics for approval turnaround, referral quality, and SLA tracking.
