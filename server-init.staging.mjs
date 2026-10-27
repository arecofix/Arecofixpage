import express from "express";

process.env.PORT = process.env.PORT || 4001;
process.env.NODE_ENV = "staging";
process.env.SUPABASE_URL = process.env.SUPABASE_URL || "http://localhost:8002";
process.env.NG_ALLOWED_HOSTS = "arecofix.com.ar,www.arecofix.com.ar,staging.arecofix.com.ar,137.131.131.98,localhost,127.0.0.1";

import { app } from "./dist/arecofix/server/server.mjs";

const port = process.env.PORT;
const wrapper = express();

wrapper.use(app());

wrapper.listen(port, () => {
  console.log(`Node Express staging server listening on http://localhost:${port}`);
});
