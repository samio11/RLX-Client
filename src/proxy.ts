import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/user";

const authRoutes = ["/login", "/register"];
const roleBaseRoutes = {
  admin: [/^\/admin/],
  user: [/^\/user/],
};
type TRole = keyof typeof roleBaseRoutes;
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userData = await getCurrentUser();
  if (userData && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!userData) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (userData.role && roleBaseRoutes[userData.role as TRole]) {
    const validRoutes = roleBaseRoutes[userData.role as TRole];
    if (validRoutes.some((x) => x.test(pathname))) {
      return NextResponse.next();
    }
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/login", "/register", "/admin/:path*", "/user/:path*"],
};
