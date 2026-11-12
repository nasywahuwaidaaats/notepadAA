
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/document") {
      const headers = {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      };

      try {
        if (request.method === "GET") {
          await env.DB.prepare(
            "INSERT OR IGNORE INTO documents (id, content, updated_at) VALUES ('main', '', ?)"
          ).bind(Date.now()).run();

          const document = await env.DB.prepare(
            "SELECT content, updated_at FROM documents WHERE id = 'main'"
          ).first();

          return Response.json(document, { headers });
        }

        if (request.method === "PUT") {
          const body = await request.json();

          if (typeof body.content !== "string") {
            return Response.json(
              { error: "Content harus berupa teks" },
              { status: 400, headers }
            );
          }

          if (body.content.length > 1000000) {
            return Response.json(
              { error: "Dokumen terlalu besar (maksimal 1 MB)" },
              { status: 413, headers }
            );
          }

          await env.DB.prepare(
            `INSERT INTO documents (id, content, updated_at)
             VALUES ('main', ?, ?)
             ON CONFLICT(id) DO UPDATE SET
             content = excluded.content,
             updated_at = excluded.updated_at`
          ).bind(body.content, Date.now()).run();

          return Response.json(
            { success: true },
            { headers }
          );
        }

        return new Response("Method Not Allowed", {
          status: 405,
          headers
        });

      } catch (error) {
        return Response.json(
          { error: "Database error" },
          { status: 500, headers }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
