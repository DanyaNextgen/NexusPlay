import "./globals.css";
import { Inter } from "next/font/google";
import { getLocale, getMessages } from "next-intl/server";
import Providers from "@/components/custom/Providers";
import LayoutWrapper from "@/components/custom/LayoutWrapper";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
    subsets: ["latin"],
    display: "swap"
});

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} className={inter.className}>
            <head>
                <link rel="icon" href="/NexusPlay.png" />
            </head>
            <body>
                <Providers locale={locale} messages={messages}>
                    <LayoutWrapper>{children}</LayoutWrapper>
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
