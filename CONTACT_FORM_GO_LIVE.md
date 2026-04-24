# Contact form & inquiry API — go-live checklist

Use this before and after deploying the inquiry flow to production (`brantsimpson.com` + Railway API + Vercel frontend).

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

- [ ] Route `brant@brantsimpson.com` → your Gmail (or inbox of choice)
- [ ] Send a test to `brant@brantsimpson.com` and confirm delivery

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
