# Alex-Hou-2024-test-5

## Environment variables

This app reads Vite-exposed environment variables from `.env` files.

1. Copy `.env.example` to `.env`.
2. Set `VITE_APP_TITLE` to the application title you want displayed.
3. Start the dev server with `npm run dev`.

`VITE_APP_TITLE` is used for the browser page title and the title rendered in the app.

## Docker

Build the production image:

```bash
docker build -t alex-hou-2024-test-5 .
```

Run the container on `0.0.0.0:8080`:

```bash
docker run --rm -p 8080:8080 alex-hou-2024-test-5
```

The container uses a multi-stage build:
- `node:22-alpine` builds the Vite app.
- `nginx:alpine` serves the static assets.

The nginx configuration includes an SPA fallback so client-side routes resolve to `index.html`.
