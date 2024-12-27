import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Define public routes
  const publicRoutes = ['/login', '/signup'];
  
  // Define private routes
  const privateRoutes = ['/', '/profile', '/my-order', '/search', '/book-details','/add-book','/cart','/checkout','/home','/order'];

  const path = request.nextUrl.pathname;

  if (!token) {
    if (publicRoutes.some(route => path.startsWith(route))) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    if (publicRoutes.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

