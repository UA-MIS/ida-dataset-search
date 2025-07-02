import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/dataset_tags/:path*",
    "/api/datasets/:path*",
    "/api/datasets",
    "/api/tags/:path*",
    "/api/tags",
    "/api/users/:path*",
    "/api/users",
  ],
};
