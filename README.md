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

## Scripts

Chạy kiểm tra/khởi tạo framework (Next.js + TS cho frontend, Express cho backend):

- Windows (PowerShell/CMD):
  - `node scripts/ensure-frameworks.js`
  - `node scripts/ensure-frameworks.js --frontend ./apps/web --backend ./backend`
  - `node scripts/ensure-frameworks.js --no-install`

- Unix/macOS:
  - `node scripts/ensure-frameworks.js`
  - hoặc cấp quyền chạy trực tiếp:
    - `chmod +x scripts/ensure-frameworks.js`
    - `./scripts/ensure-frameworks.js`

Tùy chọn:
- `--frontend <path>`: đặt đường dẫn frontend (mặc định ./frontend)
- `--backend <path>`: đặt đường dẫn backend (mặc định ./backend)
- `--no-install`: không tự chạy npm install
- `--help`: xem trợ giúp