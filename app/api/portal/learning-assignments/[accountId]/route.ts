import { proxyLearningItems } from "../../learning-items/proxy";

type RouteContext = { params: Promise<{ accountId: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const { accountId } = await params;
  return proxyLearningItems(request, `/api/admin/learning-assignments/${encodeURIComponent(accountId)}`, "PATCH");
}