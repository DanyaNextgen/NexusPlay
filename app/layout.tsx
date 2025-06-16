// import "./globals.css";
// import { getLocale } from "next-intl/server";
// import { NextIntlClientProvider } from "next-intl";
// import { Inter } from "next/font/google";
// import { Header } from "@/components/custom/Header";
// import Footer from "@/components/custom/Footer";

// const inter = Inter({
//     subsets: ["latin"],
//     display: "swap",
// });

// export default async function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     const locale = await getLocale();

//     return (
//         <html lang={locale} className={inter.className}>
//             <body>
//                 <NextIntlClientProvider>
//                     <Header />
//                     <div className="bg-[#101014] min-h-screen mx-auto">
//                         {children}
//                     </div>
//                     <Footer />
//                 </NextIntlClientProvider>
//             </body>
//         </html>
//     );
// }
import "./globals.css";
import { Inter } from "next/font/google";
import { getLocale, getMessages } from "next-intl/server";
import Providers from "@/components/custom/Providers";
import LayoutWrapper from "@/components/custom/LayoutWrapper";

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
                </Providers>
            </body>
        </html>
    );
}
