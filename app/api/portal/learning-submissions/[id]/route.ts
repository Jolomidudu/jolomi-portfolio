import { proxyLearningItems } from "../../learning-items/proxy";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxyLearningItems(request, `/api/admin/learning-submissions/${encodeURIComponent(id)}`, "PATCH");
}