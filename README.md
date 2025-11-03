# Yoca-OnChain-Analytics

## Backend (Node.js + Express)

Yêu cầu:
- Node.js >= 18
- npm >= 8

Thiết lập nhanh:
- `cd backend`
- `cp .env.example .env`
- `npm install`
- Dev: `npm run dev`
- Prod: `npm start`

Endpoints:
- GET / => { message: "OK" }
- GET /api/health
- CRUD in-memory: /api/users