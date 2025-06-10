import { Header } from "@/components/custom/Header";
import "./globals.css";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();

    return (
        <html lang={locale} className={inter.className}>
            <body>
                <NextIntlClientProvider>
                    <Header />
                    <div className="bg-[#101014] min-h-screen mx-auto">
                        {children}
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
