This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

RepoMind is a frontend workspace for exploring repositories, starting indexing jobs, and chatting with code context from a connected backend.

## Features

- Connect GitHub repositories for indexing.
- Track repository processing status from the dashboard.
- Ask questions against indexed code context.

## Project Notes

Use the dashboard to connect a repository, follow indexing progress, and review chat responses alongside repo context.

Dashboard chat works best after indexing has completed for the selected repository branch.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint checks.

## Requirements

Use Node.js with the package manager already locked in this repository before running local scripts.

## Local Development

Keep the frontend and backend services running together when testing repository indexing or chat flows.

Use `npm run lint` before sharing changes that touch UI or routing behavior.

## Environment

Set `NEXT_PUBLIC_API_URL` when the frontend should call a deployed backend instead of a local service.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
