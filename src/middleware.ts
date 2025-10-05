import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request);

  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRes;
  }

  const { origin } = new URL(request.url);
  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }
  return authRes;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|images|favicon.[ico|png]|sitemap.xml|robots.txt|$).*)",
  ],
};
