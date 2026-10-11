import { proxyLearningItems } from "../../learning-items/proxy";

export async function POST(request: Request) {
  return proxyLearningItems(request, "/api/admin/learning-enrollments/delete", "POST");
}
