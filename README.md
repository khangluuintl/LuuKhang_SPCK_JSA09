# Demand API Integration (local dev)

This project includes a small frontend and an optional local proxy to help integrate with the Booking.com Demand API (sandbox) during development.

Files of interest
- `JS/script.js` — lightweight API helper (base URL, affiliate id, token storage, and search helper).
- `login.html` — configure `api_base_url`, `affiliate_id`, and `api_token` stored in `localStorage`.
- `products.html` — example page that POSTs to `/accommodations/search` and renders results.
- `server/proxy.js` and `server/package.json` — local Express proxy to forward `/api/*` to the Booking Demand API sandbox and inject CORS headers for browser development.

Why the proxy?
- The Booking Demand API sandbox does not return CORS headers for arbitrary local origins. Browsers block cross-origin requests when preflight responses don't include `Access-Control-Allow-Origin`. The proxy performs server-to-server requests (no CORS) and returns the response to your browser with permissive CORS headers for development.

Run the proxy (PowerShell)
1. Open a PowerShell terminal at the repository root.
2. Install dependencies and start the proxy:

```powershell
cd server
npm install
npm start
```

3. The proxy listens on `http://localhost:3000` by default and forwards `/api/*` to the sandbox target `https://demandapi-sandbox.booking.com/3.2`.

Environment variables
- `AFFILIATE_ID` — optional: set a default `X-Affiliate-Id` the proxy will attach when forwarding. Example PowerShell command to set the variable for the current session:

```powershell
$env:AFFILIATE_ID = '123456'
node proxy.js
```

- `TARGET` — optional: change the Booking API target (e.g. production) like this:

```powershell
$env:TARGET = 'https://demandapi.booking.com/3.2'
node proxy.js
```

Frontend configuration
- Open `login.html` in your browser (serve via a local static server, see below). The default `API Base URL` is prefilled with `http://localhost:3000/api`.
- Enter your `Affiliate ID` and `Bearer token` (or set `AFFILIATE_ID` on the proxy to avoid exposing the affiliate id in the browser).

Serve frontend files from a local static server (do NOT use `file://`):

Node (http-server):
```powershell
npx http-server -p 8080
# open http://localhost:8080/login.html
```

Python 3:
```powershell
python -m http.server 8000
# open http://localhost:8000/login.html
```

How to use the proxy from the frontend
- Set `API Base URL` to `http://localhost:3000/api` (this is the default in `login.html`).
- The frontend makes calls like `POST /api/accommodations/search` which the proxy forwards to `/accommodations/search` on the Booking sandbox.

Troubleshooting CORS errors
- If you still see `No 'Access-Control-Allow-Origin' header`:
  - Confirm you're calling `http://localhost:3000/api/...` not `https://demandapi-sandbox...` directly.
  - Check proxy is running and reachable: open `http://localhost:3000/health`.
  - Review browser DevTools → Network → OPTIONS preflight for the request; the proxy should respond and not return errors.
- For production: do not rely on this proxy. Either request CORS support from the API provider or make server-to-server calls from your backend.

Security notes
- The proxy is intended for local development only. It sets permissive CORS headers (`*`) to make testing easy — do not expose this to the public internet.
- Keep your bearer token and affiliate id secure. For production, perform API requests from a trusted server and avoid storing long-lived tokens in `localStorage`.

Optional: generate a typed client
- If you prefer a generated SDK, use `openapi-generator`:

```powershell
npm i -g @openapitools/openapi-generator-cli
openapi-generator generate -i demand-api.json -g javascript -o ./generated-api-client
```

If you want, I can add a small README section showing example requests and update scripts — tell me.
