export default {
  async fetch(request, env, ctx) {
    // Manejar preflight CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const data = await request.json();
      const { tableName, payload, operation } = data;

      if (!tableName || !payload) {
        return new Response("Missing parameters", { status: 400 });
      }

      if (operation === "INSERT") {
        // Ejemplo genérico para inserción en base a objeto plano
        const columns = Object.keys(payload).join(", ");
        const placeholders = Object.keys(payload).map(() => "?").join(", ");
        const values = Object.values(payload);

        const stmt = env.DB.prepare(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`);
        
        const result = await stmt.bind(...values).run();
        
        return new Response(JSON.stringify({ success: true, result }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
      
      return new Response(JSON.stringify({ error: "Operation not supported" }), { status: 400 });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { 
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }
  },
};
