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

            // Разрешаем всё, кроме защищённых путей
            if (!protectedPaths.some((path) => pathname.startsWith(path))) {
                return true;
            }

            // Для админки — только если роль ADMIN
            if (pathname.startsWith("/admin")) {
                return token?.role === "ADMIN";
            }

            // Для других защищённых путей — просто вход
            return !!token;
        },
    },
});

export default protectedMiddleware;

export const config = {
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"], // все страницы кроме исключений
};



