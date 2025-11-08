# FuelEU Compliance Dashboard
A full-stack web application that calculates and visualizes maritime fuel GHG compliance based on FuelEU Maritime Regulation (EU 2023/1805).
---
## 🚢 Overview
This tool allows users to:
- View vessel route emissions
- Compare GHG Intensity values against baseline routes
- Compute yearly **Compliance Balance (CB)**
- Perform **Banking** of surplus CB
- Create **Pooling** groups to reassign surplus between ships

Built according to **Hexagonal Architecture**:
core (domain + logic)
↑ ↓
ports (interfaces)
↑ ↓
adapters (Express + React UI, Prisma ORM)
---
## 🧱 Tech Stack
| Layer | Technology |
|------|------------|
| Frontend | React + TypeScript + Vite + Tailwind |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma ORM |
| State & Data Fetching | TanStack React Query |
---
## 📦 Setup Instructions
### 1. Clone repository
git clone <your_repo_url>
cd project-root
### 2. Backend Setup
cd backend
cp .env.example .env # ensure DATABASE_URL is correct
npm install
npx prisma migrate dev
npm run seed
npm run dev

Backend will run at:
http://localhost:3000

### 3. Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs at:
http://localhost:5173
---
## 🔌 API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/routes` | List routes |
| POST | `/routes/:id/baseline` | Set baseline |
| GET | `/routes/comparison` | Baseline vs others |
| GET | `/compliance/cb` | Compute Compliance Balance |
| POST | `/banking/bank` | Bank surplus |
| POST | `/banking/apply` | Apply bank |
| POST | `/pools` | Create pooling allocation |
---

[Routes page](./assets/routes.png)
[Comparision page](./assets/compare_page.png)
[Comparision pchartage](./assets/compare.png)
[Banking page](./assets/banking.png)
[Pooling page](./assets/pooling.png)