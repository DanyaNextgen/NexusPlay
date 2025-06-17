"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";

type Product = {
    id: string;
    image: string;
    translations: {
        name: string;
        description: string;
        language: string;
    }[];
};

type Props = {
    products: Product[];
};

export default function SmartSearch({ products }: Props) {
    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState<Product[]>([]);
    const t = useTranslations("header");
    const { data: session } = useSession();

    useEffect(() => {
        if (query.trim() === "") {
            setFiltered([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = products.filter((product) =>
            product.translations.some((t) =>
                t.name.toLowerCase().includes(lowerQuery) ||
                t.description.toLowerCase().includes(lowerQuery)
            )
        );

        setFiltered(results);
    }, [query, products]);

    return (
        <div className="sticky top-0 bg-[#101014]">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4 px-4 py-7">
                <div className="flex items-center gap-5">
                    <div className="relative w-full max-w-md">
                        <IoIosSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a9a9aa] text-xl" />
                        <Input
                            placeholder={t("searchPlaceholder")}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 rounded-3xl bg-[#27272a] text-white placeholder:text-[#a9a9aa] border-none"
                        />
                    </div>
                    <div className="hidden md:flex gap-6 text-white font-medium text-sm whitespace-nowrap">
                        <span className="cursor-pointer text-[#a9a9aa] hover:text-white transition-colors">{t("discover")}</span>
                        <span className="cursor-pointer text-[#a9a9aa] hover:text-white transition-colors">{t("browse")}</span>
                    </div>
                </div>

                {session && (
                    <div className="flex items-center gap-6 text-white font-medium text-sm whitespace-nowrap">
                        <Link href="/wishlist" className="hidden md:inline text-[#a9a9aa] hover:text-white transition-colors">
                            {t("wishlist")}
                        </Link>
                        <Link href="/cart" className="hidden md:inline text-[#a9a9aa] hover:text-white transition-colors">
                            {t("cart")}
                        </Link>

                        <Link href="/wishlist" className="md:hidden text-2xl text-[#a9a9aa] hover:text-white transition-colors">
                            <IoIosCheckmarkCircleOutline />
                        </Link>
                        <Link href="/cart" className="md:hidden text-2xl text-[#a9a9aa] hover:text-white transition-colors">
                            <MdOutlineShoppingCart />
                        </Link>
                    </div>
                )}
            </div>

            {query && filtered.length > 0 && (
                <div className="max-w-[1200px] mx-auto px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map((product) => (
                        <div key={product.id} className="bg-[#27272a] rounded-lg p-3 text-white">
                            <img src={product.image} alt="product" className="w-full h-40 object-cover rounded" />
                            <div className="mt-2 font-semibold">
                                {product.translations[0].name}
                            </div>
                            <p className="text-sm text-[#a9a9aa]">{product.translations[0].description}</p>
                        </div>
                    ))}
                </div>
            )}

            {query && filtered.length === 0 && (
                <div className="max-w-[1200px] mx-auto px-4 py-4 text-white text-sm">
                    {t("noResults")}: <strong>{query}</strong>
                </div>
            )}
        </div>
    );
}

// "use client";

// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { useTranslations } from "next-intl";
// import Link from "next/link";
// import { useSession } from "next-auth/react";
// import { MdOutlineShoppingCart } from "react-icons/md";
// import { IoIosCheckmarkCircleOutline, IoIosSearch } from "react-icons/io";

// type Product = {
//     id: string;
//     image: string;
//     translations: {
//         name: string;
//         description: string;
//         language: string;
//     }[];
// };

// type Props = {
//     products: Product[];
// };

// export default function SmartSearch({ products }: Props) {
//     const [query, setQuery] = useState("");
//     const [filtered, setFiltered] = useState<Product[]>([]);
//     const t = useTranslations("header");
//     const { data: session } = useSession();

//     useEffect(() => {
//         if (query.trim() === "") {
//             setFiltered([]);
//             return;
//         }

//         const lowerQuery = query.toLowerCase();
//         const results = products.filter((product) =>
//             product.translations.some((t) =>
//                 t.name.toLowerCase().includes(lowerQuery) ||
//                 t.description.toLowerCase().includes(lowerQuery)
//             )
//         );

//         setFiltered(results);
//     }, [query, products]);

//     return (
//         <>
//             {/* sticky-обёртка */}
//             <div className="sticky top-0 z-30 bg-[#1a1a1a]">
//                 {/* контент ограничен по ширине */}
//                 <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4 px-4 py-3">
//                     <div className="flex items-center gap-5">
//                         <div className="relative w-full max-w-md">
//                             <IoIosSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a9a9aa] text-xl" />
//                             <Input
//                                 placeholder={t("searchPlaceholder")}
//                                 value={query}
//                                 onChange={(e) => setQuery(e.target.value)}
//                                 className="w-full pl-10 rounded-3xl bg-[#27272a] text-white placeholder:text-[#a9a9aa] border-none"
//                             />
//                         </div>
//                         <div className="hidden md:flex gap-6 text-white font-medium text-sm whitespace-nowrap">
//                             <span className="cursor-pointer text-[#a9a9aa] hover:text-white transition-colors">{t("discover")}</span>
//                             <span className="cursor-pointer text-[#a9a9aa] hover:text-white transition-colors">{t("browse")}</span>
//                         </div>
//                     </div>

//                     {!session ? (
//                         <div className="flex items-center gap-6 text-white font-medium text-sm whitespace-nowrap">
//                             <span>{t("discover")}</span>
//                             <span>{t("browse")}</span>
//                         </div>
//                     ) : (
//                         <div className="flex items-center gap-6 text-white font-medium text-sm whitespace-nowrap">
//                             <Link href="/wishlist" className="hidden md:inline text-[#a9a9aa] hover:text-white transition-colors">
//                                 {t("wishlist")}
//                             </Link>
//                             <Link href="/cart" className="hidden md:inline text-[#a9a9aa] hover:text-white transition-colors">
//                                 {t("cart")}
//                             </Link>

//                             <Link href="/wishlist" className="md:hidden text-2xl text-[#a9a9aa] hover:text-white transition-colors">
//                                 <IoIosCheckmarkCircleOutline />
//                             </Link>
//                             <Link href="/cart" className="md:hidden text-2xl text-[#a9a9aa] hover:text-white transition-colors">
//                                 <MdOutlineShoppingCart />
//                             </Link>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Результаты поиска */}
//             {query && filtered.length > 0 && (
//                 <div className="max-w-[1200px] mx-auto px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                     {filtered.map((product) => (
//                         <div key={product.id} className="bg-[#27272a] rounded-lg p-3 text-white">
//                             <img src={product.image} alt="product" className="w-full h-40 object-cover rounded" />
//                             <div className="mt-2 font-semibold">
//                                 {product.translations[0].name}
//                             </div>
//                             <p className="text-sm text-[#a9a9aa]">{product.translations[0].description}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {query && filtered.length === 0 && (
//                 <div className="max-w-[1200px] mx-auto px-4 py-4 text-white text-sm">
//                     {t("noResults")}: <strong>{query}</strong>
//                 </div>
//             )}
//         </>
//     );
// }
