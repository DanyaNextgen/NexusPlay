"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoIosCheckmarkCircleOutline, IoIosSearch } from "react-icons/io";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

type Product = {
    id: string;
    image: string;
    name: string | null;
    description: string | null;
};

type Props = {
    products: Product[];
};

export default function SmartSearch({ products }: Props) {
    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [isSticky, setIsSticky] = useState(false);
    const stickyRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();

    const t = useTranslations("header");
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            if (!stickyRef.current) return;
            const { top } = stickyRef.current.getBoundingClientRect();
            setIsSticky(top <= 0);
        };

        window.onscroll = handleScroll;
        return () => {
            window.onscroll = null;
        };
    }, []);

    useEffect(() => {
        if (query.trim() === "") {
            setFiltered([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = products.filter(
            (product) =>
                (product.name?.toLowerCase() ?? "").includes(lowerQuery) ||
                (product.description?.toLowerCase() ?? "").includes(lowerQuery)
        );

        setFiltered(results);
    }, [query, products]);

    return (
        <div
            ref={stickyRef}
            className={`sticky top-0 bg-[#101014] transition-all duration-200 ${isSticky ? "z-[1000]" : "z-0"
                }`}
        >
            <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4 px-4 py-7">
                <div className="flex items-center gap-5 w-full">
                    <div className="relative w-full sm:max-w-[220px] md:max-w-[260px]">
                        <IoIosSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a9a9aa] text-xl" />
                        <Input
                            placeholder={t("searchPlaceholder")}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 rounded-3xl bg-[#27272a] text-white placeholder:text-[#a9a9aa] border-none"
                        />
                    </div>


                    <div className="hidden md:flex gap-6 text-white font-medium text-sm whitespace-nowrap">
                        <Link
                            href="/"
                            className={`transition-colors ${pathname === "/" ? "text-white" : "text-[#a9a9aa] hover:text-white"
                                }`}
                        >
                            {t("discover")}
                        </Link>
                        <Link
                            href="/browse"
                            className={`transition-colors ${pathname === "/browse"
                                ? "text-white"
                                : "text-[#a9a9aa] hover:text-white"
                                }`}
                        >
                            {t("browse")}
                        </Link>
                    </div>

                    <div className="flex md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="text-white text-sm font-medium gap-1 px-2 py-1"
                                >
                                    {pathname === "/browse" ? t("browse") : t("discover")}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40 bg-[#27272a] border border-[#3a3a3a] text-white" sideOffset={8}>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/"
                                        className={`w-full px-2 py-1 ${pathname === "/"
                                            ? "text-white font-semibold"
                                            : "text-[#a9a9aa] hover:text-white"
                                            }`}
                                    >
                                        {t("discover")}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/browse"
                                        className={`w-full px-2 py-1 ${pathname === "/browse"
                                            ? "text-white font-semibold"
                                            : "text-[#a9a9aa] hover:text-white"
                                            }`}
                                    >
                                        {t("browse")}
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {session && (
                    <div className="flex items-center gap-6 text-white font-medium text-sm whitespace-nowrap">
                        <Link
                            href="/wishlist"
                            className="hidden md:inline text-[#a9a9aa] hover:text-white transition-colors"
                        >
                            {t("wishlist")}
                        </Link>
                        <Link
                            href="/cart"
                            className="hidden md:inline text-[#a9a9aa] hover:text-white transition-colors"
                        >
                            {t("cart")}
                        </Link>
                        <Link
                            href="/wishlist"
                            className="md:hidden text-2xl text-[#a9a9aa] hover:text-white transition-colors"
                        >
                            <IoIosCheckmarkCircleOutline />
                        </Link>
                        <Link
                            href="/cart"
                            className="md:hidden text-2xl text-[#a9a9aa] hover:text-white transition-colors"
                        >
                            <MdOutlineShoppingCart />
                        </Link>
                    </div>
                )}
            </div>

            {query && (
                <div className="max-w-[1200px] mx-auto px-4 pb-2">
                    {filtered.length > 0 ? (
                        <div className="bg-[#1a1a1a] rounded-xl p-3">
                            <div className="grid grid-cols-1 gap-3">
                                {filtered.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => router.push(`/product/${product.id}`)}
                                        className="flex items-center gap-4 cursor-pointer transition-colors rounded-lg px-3 py-2 bg-[#27272a] hover:bg-[#3a3a3a]"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name ?? "product"}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="font-semibold text-base text-white">
                                            {product.name ?? "Без названия"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-white text-sm">
                            {t("noResults")}: <strong>{query}</strong>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
