import { proxyLearningItems } from "../proxy";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxyLearningItems(request, `/api/admin/learning-items/${encodeURIComponent(id)}`, "PATCH");
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxyLearningItems(request, `/api/admin/learning-items/${encodeURIComponent(id)}`, "DELETE");
}