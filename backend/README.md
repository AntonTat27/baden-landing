# Baden backend

Go (stdlib only) API + admin panel for the landing's listings.

```bash
cd backend
ADMIN_PASSWORD=change-me go run ./cmd/server
```

- Admin panel: http://localhost:8080/admin (user `admin`, or set `ADMIN_USER`)
- Public API: `GET /api/listings`, used by the landing
- Data lives in `DATA_DIR` (default `./data`): `listings.json` + `uploads/`.
  On first run it is seeded with the original five listings.
- `ADDR` sets the listen address (default `:8080`).

The landing reads `REACT_APP_API_URL` (see `baden-landing/.env.development`).
If it is unset or the API is down, the landing falls back to the bundled
listings in `src/data/units.js`.

Admin uses HTTP Basic auth, so run it behind HTTPS in production.

## Layout

```
cmd/server/          entry point: config from env, wiring, ListenAndServe
internal/router/     URL → handler mapping, which routes need auth
internal/handler/    HTTP handlers (listings, uploads, admin page)
internal/middleware/ Basic auth
internal/model/      Listing type + validation
internal/storage/    JSON-file store (seeded from seed.json)
```
