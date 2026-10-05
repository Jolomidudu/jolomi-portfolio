import { proxyLearningItems } from "./proxy";

export async function GET(request: Request) {
  return proxyLearningItems(request, "/api/admin/learning-items", "GET");
}

export async function POST(request: Request) {
  return proxyLearningItems(request, "/api/admin/learning-items", "POST");
}