import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const PROTECTED_ROUTES = ["/"];

const isProtectedRoute = createRouteMatcher(PROTECTED_ROUTES);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
