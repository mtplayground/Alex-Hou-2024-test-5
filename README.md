# Alex-Hou-2024-test-5

## Local development

Install dependencies and start the Vite dev server:

```bash
npm install
npm run dev
```

## Environment variables

This app reads Vite-exposed environment variables from `.env` files.

1. Copy `.env.example` to `.env`.
2. Set `VITE_APP_TITLE` to the application title you want displayed.
3. Start the dev server with `npm run dev`.

`VITE_APP_TITLE` is used for the browser page title and the title rendered in the app.

## Manual smoke-test checklist

Run the checklist in both Chrome and Firefox against a local `npm run dev` session.

1. Start at the landing screen and confirm the title, Start Run button, View Leaderboard button, controls panel, and leaderboard panel render without layout overlap.
2. Resize the browser to a typical desktop width and confirm the board area and side panels stay readable without horizontal scrolling.
3. Start a new run and confirm the board, HUD, next-piece preview, and controls panel appear on one screen.
4. Verify keyboard controls:
   `Left`/`Right` move the active piece, `Up` rotates, `Down` soft-drops, `Space` hard-drops, `P` pauses, and `R` restarts.
5. Press `P` during play and confirm the pause overlay appears; press `P` again and confirm play resumes.
6. Force a game over and confirm the modal appears above the board, shows the final score, and the Play Again button restarts without reloading the page.
7. From the game-over modal, open High Scores and confirm the app routes to the leaderboard screen without a reload.
8. Trigger a qualifying score and confirm the initials form appears, accepts only three letters, saves successfully, and updates the local top-10 table.
9. Trigger a non-qualifying score after the leaderboard is full and confirm the initials form does not appear.
10. From the High Scores screen, verify both Start New Run and Back To Start work without reloading the page.

Support checks performed in this VM:

1. `npm run build`
2. `npm run lint`
3. `npm run test -- --run`

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
