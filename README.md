# PC IPNU IPPNU Kota Bekasi News

Vite + React application for the PC IPNU IPPNU Kota Bekasi news site.

## Environment

Copy `.env.example` to `.env` for local development and fill in the values locally.
Do not commit `.env` or any other file containing real secrets.

Required Vercel environment variables:

- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

`LOVABLE_API_KEY` is used by the Supabase Edge Function and should be configured as a Supabase function secret, not as a public frontend variable.

## Deploy To Vercel

The project includes `vercel.json` with:

- install command: `npm ci`
- build command: `npm run build`
- output directory: `dist`
- SPA rewrite to `index.html`
