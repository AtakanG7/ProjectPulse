import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host');

  // Check if we're in a local environment
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  // Extract the subdomain
  let subdomain;
  if (isLocalhost) {
    // For localhost, we can't test real subdomains, so we'll skip subdomain logic
    return NextResponse.next();
  } else {
    // This regex extracts the subdomain from the hostname
    const subdomainMatch = hostname.match(/^(?:([a-zA-Z0-9-]+)\.)?sprojects\.live$/);
    subdomain = subdomainMatch ? subdomainMatch[1] : null;
  }

  // Log the request for debugging
  console.log(`Request received: ${hostname}${url.pathname}, Subdomain: ${subdomain}`);

  // If there's no subdomain, or it's 'www', proceed normally
  if (!subdomain || subdomain === 'www') {
    return NextResponse.next();
  }

  // Handle subdomain routes
  if (url.pathname === '/') {
    // Root path for profile showcase
    url.pathname = `/subdomains/${subdomain}`;
    return NextResponse.rewrite(url);
  } else if (url.pathname.match(/^\/[^\/]+$/)) {
    // Single segment path for project showcase
    const projectTitle = url.pathname.slice(1); // Remove leading slash
    url.pathname = `/subdomains/${subdomain}/projects/${projectTitle}`;
    return NextResponse.rewrite(url);
  }

  // For any other path on subdomains, return 404
  return new NextResponse('Not Found', { status: 404 });
}

export const config = {
  matcher: [
    // Match all paths except those starting with api, _next, static, or favicon.ico
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};