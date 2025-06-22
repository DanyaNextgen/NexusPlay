import createIntlMiddleware from "next-intl/middleware";
import { withAuth } from "next-auth/middleware";

const intlMiddleware = createIntlMiddleware({
    locales: ["en", "ru", "uz", "de", "es", "fr", "it", "tr", "pt", "pl"],
    defaultLocale: "ru",
    localePrefix: "never"
});

const protectedPaths = ["/posts/new", "/admin"];

const protectedMiddleware = withAuth(intlMiddleware, {
    callbacks: {
        authorized: ({ req, token }) => {
            const pathname = req.nextUrl.pathname;

            if (!protectedPaths.some((path) => pathname.startsWith(path))) {
                return true;
            }

            if (pathname.startsWith("/admin")) {
                return token?.role === "ADMIN";
            }

            return !!token;
        },
    },
});

export default protectedMiddleware;

export const config = {
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"], 
};


