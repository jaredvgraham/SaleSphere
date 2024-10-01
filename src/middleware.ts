import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublic = createRouteMatcher(["/sign-in", "/sign-up", "/landing"]);

const isPublicApi = createRouteMatcher(["/api/auth", "/api/webhooks/clerk"]);

export default clerkMiddleware((auth, req) => {
  console.log("at middleware");

  const { userId } = auth();
  const currentRoute = new URL(req.url);
  const isLanding = currentRoute.pathname === "/landing";

  // If user is authenticated and accessing a public route (except landing)
  if (
    userId &&
    isPublic(req) &&
    !isLanding &&
    !currentRoute.pathname.includes("/sign-up")
  ) {
    return NextResponse.redirect(new URL("/landing", req.url));
  }

  // Skip redirection if on sign-up or sign-in page, or during API requests
  if (
    !userId &&
    (isPublic(req) ||
      isPublicApi(req) ||
      req.url.includes("/sign-up") ||
      req.url.includes("clerk"))
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to sign-in for protected routes
  if (!userId && !isPublic(req) && !isPublicApi(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
