import http from 'http';
import app from './app';
import config from './config';

const server = http.createServer(app);

server.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${config.port}`);
});

process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

const shutdown = (signal: string) => {
  // eslint-disable-next-line no-console
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(() => process.exit(0));
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
