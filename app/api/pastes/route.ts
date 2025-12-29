import kv from "@/lib/kv";

export async function POST(req: Request) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string") {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return Response.json({ error: "Invalid ttl_seconds" }, { status: 400 });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return Response.json({ error: "Invalid max_views" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const expiresAt = ttl_seconds ? Date.now() + ttl_seconds * 1000 : null;

  await kv.set(`paste:${id}`, {
    content,
    expiresAt,
    remainingViews: max_views ?? null,
  });

  return Response.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
  });
}
