import appModule from './dist/arecofix/server/main.server.mjs';

const port = process.env.PORT || 4000;
const app = appModule;

app.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
