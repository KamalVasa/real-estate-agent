# Dombivli Property AI

A lean, conversion-focused property website for Dombivli and Thakurli. The first release prioritizes searchable listings, WhatsApp enquiries, lead capture, local SEO basics, and reusable AI marketing copy.

## What is included

- Responsive Next.js storefront with home, listings, property detail, about and contact pages
- Area, BHK and budget filtering
- Pre-filled WhatsApp conversations on high-intent pages
- FastAPI CRUD APIs for properties and leads
- Gemini 2.5 Flash marketing generator for Instagram, Facebook, WhatsApp, reels and listing copy
- PostgreSQL-ready SQLAlchemy models; SQLite works out of the box
- Demo inventory fallback so the frontend can be previewed before the API is deployed

## Start the frontend

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. Replace the placeholder business phone, WhatsApp number, email and name in `.env.local` before publishing.

## Start the API

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python seed.py
uvicorn app.main:app --reload
```

API docs are available at `http://localhost:8000/docs`.

For Supabase/PostgreSQL, set `DATABASE_URL` to the provided PostgreSQL connection string. If the provider gives a `postgres://` URL, change the prefix to `postgresql+psycopg://`.

## AI marketing endpoint

Add a Gemini API key to `backend/.env`, then call:

```text
POST /properties/{property_id}/marketing
```

The response has stable keys for `instagram_caption`, `facebook_post`, `whatsapp_status`, `reel_script`, and `property_description`.

## Before launch

1. Replace all demo properties with genuine inventory and approved photos.
2. Replace placeholder contact details in `.env.local`.
3. Connect the frontend to the deployed API with `NEXT_PUBLIC_API_URL`.
4. Set the live domain in `NEXT_PUBLIC_SITE_URL` for the sitemap.
5. Create and verify the Google Business Profile separately; it requires the business owner and cannot be automated from this repository.

Do not expose lead list or property write endpoints publicly without authentication. For the first private demo this keeps setup fast; add a simple admin login before sharing operational API credentials.
