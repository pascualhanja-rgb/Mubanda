import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Segurança: todas as rotas exigem sessão Clerk, exceto o login ("/") e o registo ("/auth").
 * As chamadas à API usam Authorization: Bearer <Clerk JWT> (ver app/lib/api.ts).
 */
const isPublicRoute = createRouteMatcher(["/", "/auth"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
