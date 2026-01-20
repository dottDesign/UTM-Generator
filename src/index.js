export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    // Lock this down to your GitHub Pages origin when ready
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Vary": "Origin",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: { "Content-Type": "application/json", ...cors },
      });

    if (url.pathname === "/api/links" && request.method === "POST") {
      const body = await request.json();

      const email = String(body.email || "").trim().toLowerCase();
      const generatedUrl = String(body.generatedUrl || "").trim();

      if (!email) return json({ ok: false, error: "email is required" }, 400);
      if (!generatedUrl) return json({ ok: false, error: "generatedUrl is required" }, 400);

      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();

      await env.DB.prepare(
        `INSERT INTO generated_links
         (id, email, generated_url, kind, payload_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(
        id,
        email,
        generatedUrl,
        body.kind || "utm",
        body.payload ? JSON.stringify(body.payload) : null,
        createdAt
      ).run();

      return json({ ok: true, id, createdAt });
    }

    if (url.pathname === "/api/links" && request.method === "GET") {
      const email = (url.searchParams.get("email") || "").trim().toLowerCase();
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 100);

      if (!email) return json({ ok: false, error: "email is required" }, 400);

      const { results } = await env.DB.prepare(
        `SELECT id, generated_url, payload_json, created_at
         FROM generated_links
         WHERE email = ?
         ORDER BY created_at DESC
         LIMIT ?`
      ).bind(email, limit).all();

      return json({
        ok: true,
        rows: results.map(r => ({
          id: r.id,
          url: r.generated_url,
          createdAt: r.created_at,
          payload: r.payload_json ? JSON.parse(r.payload_json) : null,
        }))
      });
    }

    return new Response("Not found", { status: 404, headers: cors });
  },
};