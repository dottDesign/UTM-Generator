const BUILD_ID = "history-public-get-2026-01-20-01"; // change this any time you deploy
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS: public endpoint for GitHub Pages
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json", ...cors },
      });

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // Version endpoint to prove what code is live
    if (url.pathname === "/__version") {
      return new Response(BUILD_ID, { status: 200, headers: cors });
    }

    // Simple health check
    if (url.pathname === "/") {
      return new Response("OK: utm-link-api is running", { status: 200, headers: cors });
    }

    // API route
    if (url.pathname === "/api/links") {
      // ---------------------------
      // GET /api/links  (PUBLIC)
      // - /api/links?limit=150            -> all recent links
      // - /api/links?email=x&limit=150    -> filter by email (optional)
      // ---------------------------
      if (request.method === "GET") {
        const email = (url.searchParams.get("email") || "").trim().toLowerCase();
        const limit = clampInt(url.searchParams.get("limit"), 150, 1, 250);

        try {
          let stmt;

          if (email) {
            stmt = env.DB.prepare(
              `SELECT id, email, generated_url, payload_json, created_at
               FROM generated_links
               WHERE email = ?
               ORDER BY created_at DESC
               LIMIT ?`
            ).bind(email, limit);
          } else {
            stmt = env.DB.prepare(
              `SELECT id, email, generated_url, payload_json, created_at
               FROM generated_links
               ORDER BY created_at DESC
               LIMIT ?`
            ).bind(limit);
          }

          const { results } = await stmt.all();

          return json({
            ok: true,
            rows: (results || []).map((r) => ({
              id: r.id,
              email: r.email,
              url: r.generated_url,
              createdAt: r.created_at,
              payload: r.payload_json ? safeJsonParse(r.payload_json) : null,
            })),
          });
        } catch (err) {
          return json({ ok: false, error: "Database read failed", detail: String(err) }, 500);
        }
      }

      // ---------------------------
      // POST /api/links (SAVE)
      // email is required here
      // ---------------------------
      if (request.method === "POST") {
        let body;
        try {
          body = await request.json();
        } catch {
          return json({ ok: false, error: "Invalid JSON body" }, 400);
        }

        const email = String(body.email || "").trim().toLowerCase();
        const generatedUrl = String(body.generatedUrl || "").trim();
        const kind = String(body.kind || "utm").trim();
        const payloadJson = body.payload ? JSON.stringify(body.payload) : null;

        if (!email) return json({ ok: false, error: "email is required" }, 400);
        if (!isValidEmail(email)) return json({ ok: false, error: "email must be valid" }, 400);

        if (!generatedUrl) return json({ ok: false, error: "generatedUrl is required" }, 400);
        if (!/^https?:\/\//i.test(generatedUrl)) {
          return json({ ok: false, error: "generatedUrl must start with http:// or https://" }, 400);
        }

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        try {
          await env.DB.prepare(
            `INSERT INTO generated_links
             (id, email, generated_url, kind, payload_json, created_at)
             VALUES (?, ?, ?, ?, ?, ?)`
          )
            .bind(id, email, generatedUrl, kind, payloadJson, createdAt)
            .run();
        } catch (err) {
          return json({ ok: false, error: "Database insert failed", detail: String(err) }, 500);
        }

        return json({ ok: true, id, createdAt });
      }

      return json({ ok: false, error: "Method not allowed" }, 405);
    }

    return json({ ok: false, error: "Not found" }, 404);
  },
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clampInt(value, fallback, min, max) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function safeJsonParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}