import { proxyPortalBlog } from "../blog-proxy";

export function GET(request: Request) {
  return proxyPortalBlog(request, "/api/admin/blog", "GET");
}

export function POST(request: Request) {
  return proxyPortalBlog(request, "/api/admin/blog", "POST");
}