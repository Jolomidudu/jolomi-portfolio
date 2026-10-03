import { proxyPortalBlog } from "../../blog-proxy";

type BlogPostRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: BlogPostRouteContext) {
  const { id } = await params;
  return proxyPortalBlog(request, `/api/admin/blog/${encodeURIComponent(id)}`, "PATCH");
}

export async function DELETE(request: Request, { params }: BlogPostRouteContext) {
  const { id } = await params;
  return proxyPortalBlog(request, `/api/admin/blog/${encodeURIComponent(id)}`, "DELETE");
}