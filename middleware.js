import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host');

  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  let subdomain;
  if (isLocalhost) {
    return NextResponse.next();
  } else {
    const subdomainMatch = hostname.match(/^(?:([a-zA-Z0-9-]+)\.)?sprojects\.live$/);
    subdomain = subdomainMatch ? subdomainMatch[1] : null;
  }
  if (!subdomain || subdomain === 'www') {
    return NextResponse.next();
  }
  if (url.pathname === '/') {
    url.pathname = `/subdomains/${subdomain}`;
    return NextResponse.rewrite(url);
    
  } else if (url.pathname.match(/^\/[^\/]+$/)) {
    const projectTitle = url.pathname.slice(1); // Remove leading slash
    url.pathname = `/subdomains/${subdomain}/projects/${projectTitle}`;
    return NextResponse.rewrite(url);
  }
  return new NextResponse('Not Found', { status: 404 });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};