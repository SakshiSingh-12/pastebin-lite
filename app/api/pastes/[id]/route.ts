import { NextRequest } from "next/server";
import { kv } from "@/lib/kv";
import { getNow } from "@/lib/time";
import type { Paste } from "@/lib/types";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await context.params; // ✅ THIS IS THE KEY LINE

  const paste = (await kv.get(`paste:${id}`)) as Paste | null;

  if (!paste) {
    return Response.json({ error: "Paste not found" }, { status: 404 });
  }

  if (paste.expiresAt && getNow() > paste.expiresAt) {
    await kv.del(`paste:${id}`);
    return Response.json({ error: "Paste expired" }, { status: 404 });
  }

  if (paste.remainingViews !== null) {
    if (paste.remainingViews <= 0) {
      await kv.del(`paste:${id}`);
      return Response.json({ error: "View limit exceeded" }, { status: 404 });
    }

    await kv.set(`paste:${id}`, {
      ...paste,
      remainingViews: paste.remainingViews - 1,
    });
  }

  return Response.json({
    content: paste.content,
    remaining_views: paste.remainingViews,
    expires_at: paste.expiresAt
      ? new Date(paste.expiresAt).toISOString()
      : null,
  });
}
