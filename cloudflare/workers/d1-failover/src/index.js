export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info, X-Client-Info, Origin",
        },
      });
    }

    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const url = new URL(request.url);
      const pathname = url.pathname.replace(/^\/+|\/+$/g, ''); // Remove leading/trailing slashes
      
      if (!pathname) {
          return new Response("OK", { status: 200 }); // Health check
      }

      // Basic protection against SQL injection on table name
      if (!/^[a-zA-Z0-9_]+$/.test(pathname)) {
        return new Response("Invalid table name", { status: 400 });
      }

      let query = `SELECT * FROM ${pathname}`;
      const params = [];
      const conditions = [];

      for (const [key, value] of url.searchParams.entries()) {
        if (key === 'select') continue;
        
        // Parse PostgREST eq. operators
        if (value.startsWith('eq.')) {
          conditions.push(`${key} = ?`);
          // Si el valor es uuid o string puro
          params.push(value.replace('eq.', ''));
        }
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
      }

      const stmt = env.DB.prepare(query);
      const result = await stmt.bind(...params).all();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return new Response(JSON.stringify(result.results), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info, X-Client-Info, Origin",
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { 
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }
  },
};
