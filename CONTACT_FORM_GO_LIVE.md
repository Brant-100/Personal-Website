# Contact form & inquiry API — go-live checklist

Use this before and after deploying the inquiry flow to production (`brantsimpson.com` + Railway API + Vercel frontend).

## How email is split (read this once)

Three different paths are involved; mixing them up is the usual source of confusion.

| Channel | Role |
|--------|------|
| **Cloudflare Email Routing** | **Inbound only.** Someone emails `you@yourdomain.com` → forwarded to Gmail (or another inbox). It does **not** let you send new mail or change the **From** address in Gmail by itself. |
| **Resend (API)** | **Outbound from the website.** The FastAPI app sends the inquiry notification and the auto-reply using `CONTACT_FROM_EMAIL` (e.g. `contact@…`). You do not use your personal Gmail for those. |
| **Your mail client (Gmail, etc.)** | **Manual replies and new threads.** If you want messages you type to show **From** `brant@brantsimpson.com`, you must configure **Send mail as** (below) with SMTP—usually Resend SMTP on the same verified domain. |

**Replying to a form notification:** The API sets `reply_to` to the submitter’s address, so **Reply** in your inbox targets them. Whether your reply shows as `@gmail.com` or `@brantsimpson.com` depends on **Send mail as** and which identity Gmail uses for that message.

## Third-party setup

### Resend

- [ ] Sign up at [resend.com](https://resend.com)
- [ ] Add and verify domain `brantsimpson.com` (DNS records in Cloudflare)
- [ ] Create an API key
- [ ] Set `RESEND_API_KEY` on **Railway** (backend)

### Cloudflare Turnstile

- [ ] Cloudflare Dashboard → Turnstile → Add site → hostname `brantsimpson.com`
- [ ] Widget mode: **Managed** (recommended)
- [ ] Copy **Site key** → Vercel env `VITE_TURNSTILE_SITE_KEY` (Production + Preview)
- [ ] Copy **Secret key** → Railway env `TURNSTILE_SECRET_KEY`
- [ ] Do **not** set `TURNSTILE_BYPASS` in production

### Cloudflare Email Routing

- [ ] Cloudflare Dashboard → **Email** → **Email Routing** → enable routing for the zone
- [ ] Create a **rule**: custom address `brant@brantsimpson.com` (or catch-all, if you prefer) → **Send to an email** → your Gmail (or inbox of choice)
- [ ] Complete any DNS / activation steps Cloudflare shows for the domain
- [ ] Send a test **to** `brant@brantsimpson.com` from an external account and confirm it arrives in your real inbox

### Send and reply as your domain from Gmail (optional but recommended)

Use this so **new mail** and **replies** you write show **From** `brant@brantsimpson.com` (or another address on the same domain), not your `@gmail.com` address. You already verified the domain in **Resend** for the API; Resend can also act as the **SMTP server** for Gmail.

**Prerequisites**

- [ ] Domain verified in Resend (same as API setup)
- [ ] The address you want to send as (e.g. `brant@brantsimpson.com`) is allowed by Resend for that domain (create/enable it in Resend if required)

**Resend SMTP (for Gmail “Send mail as”)**

- [ ] In [Resend](https://resend.com): use your existing API key, or create a dedicated key for SMTP if you prefer
- [ ] SMTP settings (see Resend docs for any updates): host `smtp.resend.com`, port **465** (SSL) or **587** (STARTTLS), username `resend`, password = your **Resend API key**

**Gmail**

- [ ] Gmail → **Settings** (gear) → **See all settings** → **Accounts and Import**
- [ ] **Send mail as** → **Add another email address**
- [ ] Enter the name you want recipients to see and `brant@brantsimpson.com` (or your chosen address)
- [ ] Choose **Treat as an alias** (typical for same domain)
- [ ] When Gmail asks for SMTP: **SMTP Server** `smtp.resend.com`, **Port** `465`, **Username** `resend`, **Password** your Resend API key, **Secured connection** SSL
- [ ] Complete verification (Gmail may send a code **to** `brant@…`; with Email Routing, that code lands in the same Gmail inbox)
- [ ] Set **brant@brantsimpson.com** as the default **Send mail as** address if you want every outgoing message to use it by default

**Check**

- [ ] Compose a new message **From** `brant@brantsimpson.com` to a test address; confirm delivery and that headers look correct
- [ ] Reply to a real inquiry notification; confirm the reply goes to the submitter and the **From** address is what you expect

**Other clients**

- [ ] Apple Mail, Outlook, etc. can use the same Resend SMTP settings for an account/identity on your domain

**Alternative: Google Workspace (or Microsoft 365)**

- [ ] If you pay for **Google Workspace** on `brantsimpson.com`, you get a real hosted mailbox for `brant@…`; you sign in to Gmail with that account (or use MX records for Google) and do **not** need Resend SMTP for day-to-day sending. You can still use **Cloudflare Email Routing** *or* Workspace—not both for the same address without careful DNS planning; for Workspace, follow Google’s MX setup and skip forward-to-Gmail routing for that mailbox.

## Environment variables

### Railway (API)

- [ ] `RESEND_API_KEY`
- [ ] `TURNSTILE_SECRET_KEY`
- [ ] `CONTACT_TO_EMAIL=brant@brantsimpson.com`
- [ ] `CONTACT_FROM_EMAIL=contact@brantsimpson.com` (must be on Resend-verified domain)
- [ ] Remove `TURNSTILE_BYPASS` if it was ever set

Optional:

- [ ] `CORS_EXTRA_ORIGINS` — comma-separated extra origins if needed

### Vercel (client)

- [ ] `VITE_API_BASE_URL` — public Railway URL (no trailing slash), e.g. `https://your-api.up.railway.app`
- [ ] `VITE_TURNSTILE_SITE_KEY` — Turnstile site key (public; safe in client bundle)

Set for **Production** and **Preview**, then redeploy.

## Live verification (from a real device, not only localhost)

### Happy path

- [ ] Submit valid form → success UI
- [ ] Notification arrives at `brant@brantsimpson.com` within ~30s
- [ ] Confirmation arrives at submitter’s inbox within ~30s
- [ ] Reply to the notification email goes to the submitter (`reply_to`)

### Validation & UX

- [ ] Empty / invalid fields show inline errors
- [ ] Message under min length rejected client-side
- [ ] Submit disabled (or blocked) without Turnstile token when site key is set

### Abuse / spam controls

- [ ] Honeypot field filled (devtools) → **422** from API (no silent “success” for bots on `/api/inquiry`)
- [ ] Sixth submission within an hour from same IP → **429**
- [ ] Tampered / invalid Turnstile token → **400**

### Cross-browser & themes

- [ ] Chrome, Firefox, Safari, Edge
- [ ] Mobile Safari / Android Chrome
- [ ] Dark (cyber) and light (pop-art) themes — form readable and on-brand

### Failure modes

- [ ] API unreachable → user sees a clear error; form data not wiped unexpectedly
- [ ] Resend failure → **500** with message to email directly (no raw provider errors in UI)

## Local dev notes

- API default port: **8765** (see [LOCAL.md](./LOCAL.md))
- Client: `client/.env.development` or `VITE_API_BASE_URL` for API URL
- API tests can use `TURNSTILE_BYPASS=1` — see [api/README.md](api/README.md)

## Reference

- Endpoint implementation: [api/main.py](api/main.py) (`POST /api/inquiry`)
- Client form: [client/src/components/forms/ContactForm.jsx](client/src/components/forms/ContactForm.jsx)
