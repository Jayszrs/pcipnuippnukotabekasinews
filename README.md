# PC IPNU IPPNU Kota Bekasi News

Vite + React application for the PC IPNU IPPNU Kota Bekasi news site.

## Environment

Copy `.env.example` to `.env` for local development and fill in the Firebase values locally.
Do not commit `.env` or any other file containing real secrets.

Required Vercel environment variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Optional:

- `VITE_FIREBASE_FUNCTIONS_REGION`
- `VITE_CHATBOT_FUNCTION_URL`
- `VITE_FIREBASE_DATACONNECT_LOCATION`
- `VITE_FIREBASE_DATACONNECT_SERVICE_ID`
- `VITE_FIREBASE_DATACONNECT_CONNECTOR_ID`
- `VITE_FIREBASE_DATACONNECT_EMULATOR_HOST`
- `VITE_FIREBASE_DATACONNECT_EMULATOR_PORT`

## Firebase Collections

The app reads and writes these Firestore collections:

- `news`
- `profiles`
- `user_roles`
- `featured_events`
- `cadres`
- `service_ratings`
- `newsletter_subscriptions`

Firebase Storage folders used by the app:

- `avatars`
- `news-media`
- `cadres`

## Firebase Data Connect

The project includes generic helpers for Firebase Data Connect in `src/integrations/firebase/data.ts`:

- `callDataConnectQuery(operationName, variables)`
- `callDataConnectMutation(operationName, variables)`

Use these when your Firebase Data Connect service and connector are deployed. Data Connect operations must already exist in the connector because Firebase calls deployed SQL-backed operations by name.

## Deploy To Vercel

The project includes `vercel.json` with:

- install command: `npm ci`
- build command: `npm run build`
- output directory: `dist`
- SPA rewrite to `index.html`
