# RepoMind Frontend

RepoMind is a Next.js frontend for connecting GitHub repositories, starting indexing jobs, and chatting with code context from a connected backend.

## Features

- Connect GitHub repositories for indexing.
- Choose the branch that contains the code context you want to explore.
- Review repository details before launching an indexing run.
- Track repository processing status from the dashboard.
- Ask questions against indexed code context.

## Requirements

- Node.js
- The package manager already locked in this repository
- Backend, database, and Redis services for indexing and chat workflows

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm run lint` runs ESLint checks.
- `npm run worker:indexing` starts the indexing worker.

## Local Development

Run commands from the repository root so the configured environment and scripts resolve consistently.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

Keep the frontend and backend services running together when testing repository indexing or chat flows. Dashboard chat works best after indexing has completed for the selected repository branch.

## Environment

Set `NEXT_PUBLIC_API_URL` when the frontend should call a deployed backend instead of a local service.

Server-side routes and workers also use service, database, auth, and Redis environment variables. Keep local secrets in `.env`.

## Troubleshooting

If indexing status does not update, confirm the backend, database, Redis, and worker services are running.

If chat has no useful context, verify that indexing completed for the selected branch.

If authentication callbacks fail locally, confirm the auth base URL matches the dev server URL.

## Before Sharing Changes

Run lint checks before sharing changes that touch UI, routing, server handlers, or worker behavior.

```bash
npm run lint
```
