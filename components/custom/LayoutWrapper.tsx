"use client";
import { usePathname } from "next/navigation";
import { Header } from "@/components/custom/Header";
import Footer from "@/components/custom/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signin");

    return (
        <>
            {!isAuthPage && <Header />}
            <main className="bg-[#101014] min-h-screen mx-auto">{children}</main>
            {!isAuthPage && <Footer />}
        </>
    );
}
