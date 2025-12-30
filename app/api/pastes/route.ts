import { kv } from "@/lib/kv";

export async function POST(req: Request) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string") {
    return new Response(JSON.stringify({ error: "Content is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const id = crypto.randomUUID();
  const expiresAt = ttl_seconds ? Date.now() + ttl_seconds * 1000 : null;

  await kv.set(`paste:${id}`, {
    content,
    expiresAt,
    remainingViews: max_views ?? null,
  });

  return new Response(
    JSON.stringify({
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
