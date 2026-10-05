import { proxyLearningItems } from "../learning-items/proxy";

export async function GET(request: Request) {
  return proxyLearningItems(request, "/api/admin/learning-assignments", "GET");
}