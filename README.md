# Portfolio MHCV — Full Stack

Professional portfolio for **M. Hemachandravijay** (Data Analytics & Solutions Architect), organized as a monorepo.

## Project structure

```
portfolio-mhcv/
├── frontend/          # React + Vite + Tailwind UI
│   ├── src/
│   ├── public/
│   ├── dist/
│   └── …config files
├── backend/           # Express API (resume, email, assistant)
├── docs/              # Guides & implementation notes
├── node_modules/      # Hoisted workspace dependencies
└── package.json       # Root scripts (dev, build, backend)
```

## Quick start

From the **repository root**:

```bash
# Install all workspace dependencies (first time or after clone)
npm install

# Frontend dev server (Vite, default http://localhost:5173)
npm run dev

# Production build
npm run build

# Backend API (default http://localhost:5000)
npm run backend
```

Run **both** frontend and backend in separate terminals for full features (resume upload, contact email, AI assistant).

## Features

- Interactive resume generator (visual, ATS, executive modes)
- Portfolio builder with multiple themes
- Profile photo upload (local storage)
- Academic vault & grade card system
- Executive grade card viewer
- Certificates, projects, skills, education pages
- Portfolio AI assistant & contact gateway

## Documentation

All guides live in [`docs/`](docs/), including:

- `QUICK_START.md`, `PROFILE_UPLOAD_GUIDE.md`
- `GRADE_CARD_*`, `ACADEMIC_*`, `EXECUTIVE_*`
- `DeploymentInstructions.md`, `IMPLEMENTATION_SUMMARY.md`

See [`docs/RESTRUCTURE_PLAN.md`](docs/RESTRUCTURE_PLAN.md) for the file layout migration reference.

## Backend environment

Copy `backend/.env.example` to `backend/.env` and configure SMTP/OpenAI keys as needed. See `docs/DeploymentInstructions.md`.
