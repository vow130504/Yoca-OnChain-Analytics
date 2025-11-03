#!/usr/bin/env node
/**
 * ensure-frameworks.js
 *
 * Cách dùng:
 * - Mặc định (frontend=./frontend, backend=./backend):
 *   node scripts/ensure-frameworks.js
 *
 * - Tùy chỉnh đường dẫn:
 *   node scripts/ensure-frameworks.js --frontend ./apps/web --backend ./backend
 *
 * - Bỏ qua cài đặt package (chỉ tạo file nếu thiếu):
 *   node scripts/ensure-frameworks.js --no-install
 *
 * - Xem trợ giúp:
 *   node scripts/ensure-frameworks.js --help
 *
 * - Windows (PowerShell/CMD):
 *   node scripts/ensure-frameworks.js
 *
 * - Unix/macOS (có thể chạy trực tiếp sau khi cấp quyền):
 *   chmod +x scripts/ensure-frameworks.js && ./scripts/ensure-frameworks.js
 *
 * Kết quả & mã thoát:
 * - Tạo/cập nhật Next.js + TypeScript (frontend) và Express (backend) nếu thiếu.
 * - Exit code 0 khi hoàn tất (kể cả khi phải tạo mới).
 */

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const args = process.argv.slice(2);
const getArg = (name, def) => {
  const flag = args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!flag) return def;
  if (flag.includes('=')) return flag.split('=')[1];
  const idx = args.indexOf(flag);
  return args[idx + 1] && !args[idx + 1].startsWith('--') ? args[idx + 1] : def;
};
const FRONTEND_DIR = path.resolve(process.cwd(), getArg('frontend', './frontend'));
const BACKEND_DIR = path.resolve(process.cwd(), getArg('backend', './backend'));
const DO_INSTALL = !args.includes('--no-install');

// Hiển thị trợ giúp
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage:
  Windows (PowerShell/CMD):
    node scripts/ensure-frameworks.js [options]

  Unix/macOS:
    node scripts/ensure-frameworks.js [options]
    # hoặc:
    chmod +x scripts/ensure-frameworks.js
    ./scripts/ensure-frameworks.js [options]

Options:
  --frontend <path>   Đường dẫn thư mục frontend (mặc định: ./frontend)
  --backend <path>    Đường dẫn thư mục backend (mặc định: ./backend)
  --no-install        Không chạy 'npm install' sau khi tạo/cập nhật
  -h, --help          Hiển thị trợ giúp

Ví dụ:
  node scripts/ensure-frameworks.js
  node scripts/ensure-frameworks.js --frontend ./apps/web --backend ./services/api
  node scripts/ensure-frameworks.js --no-install
`);
  process.exit(0);
}

const exists = (p) => fs.existsSync(p);
const ensureDir = (p) => { if (!exists(p)) fs.mkdirSync(p, { recursive: true }); };
const readJSON = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };
const writeJSON = (p, obj) => fs.writeFileSync(p, JSON.stringify(obj, null, 2));
const writeIfMissing = (file, content) => {
  if (!exists(file)) fs.writeFileSync(file, content);
};
const run = (cmd, cwd) => {
  console.log(`> ${cmd} (cwd=${cwd})`);
  cp.execSync(cmd, { cwd, stdio: 'inherit' });
};

/* ---- Frontend (Next.js + TypeScript) ---- */
function hasNextTs(dir) {
  const pkg = readJSON(path.join(dir, 'package.json'));
  if (!pkg) return false;
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const hasCore = deps.next && deps.react && deps['react-dom'];
  const hasTs = deps.typescript && exists(path.join(dir, 'tsconfig.json'));
  return !!(hasCore && hasTs);
}

function ensureNextTs(dir) {
  ensureDir(dir);
  const pkgPath = path.join(dir, 'package.json');
  let pkg = readJSON(pkgPath);
  if (!pkg) {
    pkg = {
      name: 'frontend',
      private: true,
      version: '1.0.0',
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
      dependencies: {
        next: '^14.2.9',
        react: '^18.2.0',
        'react-dom': '^18.2.0'
      },
      devDependencies: {
        typescript: '^5.4.0',
        '@types/react': '^18.2.45',
        '@types/node': '^18.19.0',
        eslint: '^8.57.0',
        'eslint-config-next': '^14.2.9'
      }
    };
  } else {
    pkg.dependencies = { ...(pkg.dependencies || {}), next: pkg.dependencies?.next || '^14.2.9', react: pkg.dependencies?.react || '^18.2.0', 'react-dom': pkg.dependencies?.['react-dom'] || '^18.2.0' };
    pkg.devDependencies = { ...(pkg.devDependencies || {}), typescript: pkg.devDependencies?.typescript || '^5.4.0', '@types/react': pkg.devDependencies?.['@types/react'] || '^18.2.45', '@types/node': pkg.devDependencies?.['@types/node'] || '^18.19.0', eslint: pkg.devDependencies?.eslint || '^8.57.0', 'eslint-config-next': pkg.devDependencies?.['eslint-config-next'] || '^14.2.9' };
    pkg.scripts = { dev: pkg.scripts?.dev || 'next dev', build: pkg.scripts?.build || 'next build', start: pkg.scripts?.start || 'next start', lint: pkg.scripts?.lint || 'next lint' };
  }
  writeJSON(pkgPath, pkg);

  // tsconfig + next-env
  writeIfMissing(path.join(dir, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      target: 'es5',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: false,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
    exclude: ['node_modules']
  }, null, 2));

  writeIfMissing(path.join(dir, 'next-env.d.ts'),
    '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n// NOTE: This file should not be edited\n');

  // app router
  const appDir = path.join(dir, 'app');
  ensureDir(appDir);
  writeIfMissing(path.join(appDir, 'layout.tsx'),
`export const metadata = { title: 'Frontend', description: 'Next.js + TS' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
`);
  writeIfMissing(path.join(appDir, 'page.tsx'),
`export default function Page() {
  return <main><h1>Next.js + TypeScript ready</h1></main>;
}
`);

  // next.config (optional)
  writeIfMissing(path.join(dir, 'next.config.mjs'),
`/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
`);

  if (DO_INSTALL) {
    run('npm install', dir);
  }
}

/* ---- Backend (Express) ---- */
function hasExpress(dir) {
  const pkg = readJSON(path.join(dir, 'package.json'));
  if (!pkg) return false;
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const hasCore = !!deps.express;
  const hasEntry =
    exists(path.join(dir, 'src', 'server.js')) ||
    exists(path.join(dir, 'src', 'app.js')) ||
    exists(path.join(dir, 'server.js')) ||
    exists(path.join(dir, 'app.js'));
  return hasCore && hasEntry;
}

function ensureExpress(dir) {
  ensureDir(dir);
  const pkgPath = path.join(dir, 'package.json');
  let pkg = readJSON(pkgPath);
  if (!pkg) {
    pkg = {
      name: 'backend',
      private: true,
      version: '1.0.0',
      main: 'src/server.js',
      scripts: { start: 'node src/server.js', dev: 'nodemon src/server.js' },
      dependencies: { express: '^4.19.2', cors: '^2.8.5', helmet: '^7.1.0', compression: '^1.7.4', morgan: '^1.10.0', dotenv: '^16.4.5' },
      devDependencies: { nodemon: '^3.1.4' },
      engines: { node: '>=18' }
    };
  } else {
    pkg.dependencies = { ...(pkg.dependencies || {}), express: pkg.dependencies?.express || '^4.19.2' };
    pkg.scripts = { ...pkg.scripts, start: pkg.scripts?.start || 'node src/server.js', dev: pkg.scripts?.dev || 'nodemon src/server.js' };
  }
  writeJSON(pkgPath, pkg);

  const srcDir = path.join(dir, 'src');
  ensureDir(srcDir);

  writeIfMissing(path.join(srcDir, 'app.js'),
`const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ message: 'OK' }));

app.use((req, res) => res.status(404).json({ message: 'Not Found' }));
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
`);

  writeIfMissing(path.join(srcDir, 'server.js'),
`const http = require('http');
const app = require('./app');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const server = http.createServer(app);

server.listen(PORT, () => console.log(\`Server listening on port \${PORT}\`));

process.on('unhandledRejection', (r) => console.error('Unhandled Rejection:', r));
process.on('uncaughtException', (e) => { console.error('Uncaught Exception:', e); process.exit(1); });
process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
`);

  if (DO_INSTALL) {
    run('npm install', dir);
  }
}

/* ---- Execute ---- */
console.log('Checking frameworks...');
if (!hasNextTs(FRONTEND_DIR)) {
  console.log(`Frontend missing or incomplete. Setting up Next.js + TypeScript in: ${FRONTEND_DIR}`);
  ensureNextTs(FRONTEND_DIR);
} else {
  console.log(`Frontend OK: ${FRONTEND_DIR}`);
}

if (!hasExpress(BACKEND_DIR)) {
  console.log(`Backend missing or incomplete. Setting up Express in: ${BACKEND_DIR}`);
  ensureExpress(BACKEND_DIR);
} else {
  console.log(`Backend OK: ${BACKEND_DIR}`);
}

console.log('Done.');
