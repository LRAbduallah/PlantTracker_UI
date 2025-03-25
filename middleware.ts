import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the user is authenticated
  const isLoggedIn = Boolean(request.cookies.get('authToken')); // Check for the authToken cookie

  // Define the paths for logged in and logged out users
  const loggedInPaths = ['/plants/[id]/edit','/plants/add'];
  const loggedOutPaths = ['/login','/dashboard','/plants']; // Paths accessible to logged out users

  // Check if the user is trying to access a path that requires authentication
  const isProtectedRoute = loggedInPaths.some(path => {
    // Replace dynamic segment with a regex pattern
    const pathRegex = path.replace(/\[([^\]]+)\]/g, '([^/]+)');
    const regex = new RegExp(`^${pathRegex}$`);
    return regex.test(request.nextUrl.pathname);
  });

  if (isProtectedRoute && !isLoggedIn) {
    // Redirect to login if trying to access a protected route while logged out
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to continue if no redirects are needed
  return NextResponse.next();
}

// Specify the paths to apply the middleware to
export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)'], // Exclude API routes and static files
};