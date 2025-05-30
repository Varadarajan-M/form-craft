import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/landing(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/form/(.*)',
  '/api/refresh(.*)',
  '/api/webhook(.*)',
  '/api/form/cloudinary(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users hitting the root `/` to `/landing`
  if (pathname === '/') {
    const token = await auth().getToken();
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/landing';
      return NextResponse.redirect(url);
    }
  }

  // Protect private routes
  if (!isPublicRoute(request)) {
    auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static assets
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
