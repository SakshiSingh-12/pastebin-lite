import kv from "@/lib/kv";
import { nowMs } from "@/lib/time";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const data = await kv.get<any>(`paste:${params.id}`);
  if (!data) return Response.json({}, { status: 404 });

  const now = nowMs(req.headers);

  if (data.expiresAt && now > data.expiresAt) {
    await kv.del(`paste:${params.id}`);
    return Response.json({}, { status: 404 });
  }

  if (data.remainingViews !== null) {
    if (data.remainingViews <= 0) {
      return Response.json({}, { status: 404 });
    }
    data.remainingViews -= 1;
    await kv.set(`paste:${params.id}`, data);
  }

  return Response.json({
    content: data.content,
    remaining_views: data.remainingViews,
    expires_at: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
  });
}
