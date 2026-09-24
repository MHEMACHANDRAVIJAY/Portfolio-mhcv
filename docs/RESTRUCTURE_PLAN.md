# Portfolio MHCV — File Movement Plan

## Overview
Reorganize into `frontend/`, `backend/`, `docs/`, root `node_modules/`, and `README.md` without deleting, renaming, or removing any file or feature.

---

## 1. Documentation → `docs/`

| Source (root) | Destination |
|---------------|-------------|
| `ACADEMIC_SYSTEM_QUICK_START.md` | `docs/ACADEMIC_SYSTEM_QUICK_START.md` |
| `ACADEMIC_VAULT_SYSTEM.md` | `docs/ACADEMIC_VAULT_SYSTEM.md` |
| `CURSIVE_NAME_GUIDE.md` | `docs/CURSIVE_NAME_GUIDE.md` |
| `DeploymentInstructions.md` | `docs/DeploymentInstructions.md` |
| `EXECUTIVE_ACADEMIC_SYSTEM.md` | `docs/EXECUTIVE_ACADEMIC_SYSTEM.md` |
| `EXECUTIVE_VIEWER_UPDATE.md` | `docs/EXECUTIVE_VIEWER_UPDATE.md` |
| `EXECUTIVE_VISUAL_COMPARISON.md` | `docs/EXECUTIVE_VISUAL_COMPARISON.md` |
| `FUTURISTIC_BADGE_GUIDE.md` | `docs/FUTURISTIC_BADGE_GUIDE.md` |
| `GRADE_CARD_IMPLEMENTATION.md` | `docs/GRADE_CARD_IMPLEMENTATION.md` |
| `GRADE_CARD_QUICK_REF.md` | `docs/GRADE_CARD_QUICK_REF.md` |
| `GRADE_CARD_SETUP_GUIDE.md` | `docs/GRADE_CARD_SETUP_GUIDE.md` |
| `GRADE_CARD_VISUAL_GUIDE.md` | `docs/GRADE_CARD_VISUAL_GUIDE.md` |
| `IMPLEMENTATION_SUMMARY.md` | `docs/IMPLEMENTATION_SUMMARY.md` |
| `PROFESSIONAL_NAME_CARD.md` | `docs/PROFESSIONAL_NAME_CARD.md` |
| `PROFILE_UPLOAD_GUIDE.md` | `docs/PROFILE_UPLOAD_GUIDE.md` |
| `QUICK_START.md` | `docs/QUICK_START.md` |
| `ULTRA_FUTURISTIC_ACADEMIC_SYSTEM.md` | `docs/ULTRA_FUTURISTIC_ACADEMIC_SYSTEM.md` |

### Build / log artifacts → `docs/logs/`

| Source (root) | Destination |
|---------------|-------------|
| `build.log` | `docs/logs/build.log` |
| `build_debug.txt` | `docs/logs/build_debug.txt` |
| `build_err.txt` | `docs/logs/build_err.txt` |
| `build_output.txt` | `docs/logs/build_output.txt` |
| `error.log` | `docs/logs/error.log` |
| `output.log` | `docs/logs/output.log` |

---

## 2. Frontend → `frontend/`

| Source (root) | Destination |
|---------------|-------------|
| `src/` | `frontend/src/` |
| `public/` | `frontend/public/` |
| `dist/` | `frontend/dist/` |
| `index.html` | `frontend/index.html` |
| `package.json` | `frontend/package.json` |
| `package-lock.json` | `frontend/package-lock.json` |
| `vite.config.js` | `frontend/vite.config.js` |
| `tailwind.config.cjs` | `frontend/tailwind.config.cjs` |
| `postcss.config.cjs` | `frontend/postcss.config.cjs` |

---

## 3. Unchanged locations

| Path | Notes |
|------|-------|
| `backend/` | Stays at root; `server.js`, `portfolio_knowledge.js`, `.env`, etc. |
| `node_modules/` (root) | Hoisted via npm workspaces |
| `backend/node_modules/` | Backend dependencies unchanged |

---

## 4. New / updated configuration

| File | Change |
|------|--------|
| `package.json` (root) | Workspace orchestrator: `dev`, `build`, `backend` scripts |
| `frontend/vite.config.js` | `@backend` alias + `server.fs.allow` for cross-package import |
| `frontend/src/components/InteractiveResume.jsx` | Import `@backend/portfolio_knowledge` |
| `README.md` (root) | Project structure and run instructions |

---

## 5. Import / path updates

| File | Before | After |
|------|--------|-------|
| `InteractiveResume.jsx` | `../../backend/portfolio_knowledge` | `@backend/portfolio_knowledge` |
| API URLs | `http://localhost:5000/...` | Unchanged (backend port unchanged) |
| `tailwind.config.cjs` | `./index.html`, `./src/**` | Same (relative to `frontend/`) |
| `index.html` | `/src/main.jsx` | Unchanged |

---

## 6. Verification checklist

- [ ] `npm run dev` from root starts Vite on frontend
- [ ] `npm run build` from root builds frontend
- [ ] `npm run backend` from root starts Express on :5000
- [ ] Resume generator, profile upload, academic vault, grade cards, executive dashboard work
- [ ] No broken `@backend` or asset imports
