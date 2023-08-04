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
    "/categories/:path*",
    "/products/:path*",
    "/additionalCategories/:path*",
    "/additionalItems/:path*",
    "/settings/:path*",

    "/api/category/:path*",
    "/api/product/:path*",
    "/api/additionalItemCategory/:path*",
    "/api/additionalItem/:path*",
    "/api/restaurant/:path*",
  ]
}