import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
    error: "/error",
    // signOut: "/login"
  },
});

export const config = { 
  matcher: [
    "/",
    "/consultation",
    "/consultation/:path*",
    "/consultation/register",
  ]
}