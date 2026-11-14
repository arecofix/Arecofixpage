import { app } from './dist/arecofix/server/server.mjs';

const port = process.env.PORT || 4000;
const server = app();

server.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});
