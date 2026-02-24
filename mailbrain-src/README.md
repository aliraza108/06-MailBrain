# MailMind Frontend

Production-ready React frontend for the MailBrain FastAPI backend.

## Stack
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- React Query + React Router
- Recharts + Sonner toasts

## Run locally
```sh
npm install
npm run dev
```

## Deploy URLs
- Frontend: `https://07-mailbrain.vercel.app`
- API: `https://07-mailbrain-api.vercel.app`

## Environment variables
Create `.env` in the frontend root:

```env
VITE_API_URL=http://localhost:8000
```

Notes:
- `VITE_API_URL` is preferred.
- `VITE_API_BASE_URL` and `NEXT_PUBLIC_API_URL` are also supported as fallback.

## Features wired to backend
- Core health/debug endpoints
- Profile get/update
- Inbox list/detail/sync/approve/reply/process/batch
- AI generation flows (reply, generic, job, proposal, follow-up, subjects, improve)
- Send and generate+send workflows
- Analytics overview/intent/priority/trends/automation/escalations
- Auto-sync toggle with intervals: `5s`, `1m`, `5m`, `1h`, `1d`

## Security behavior
- JWT is stored in session/local storage and sent as `Authorization: Bearer <token>`.
- On `401`, token is cleared and user is redirected to `/login`.
- Frontend never scrapes inboxes directly; sync is only through backend API endpoints.
