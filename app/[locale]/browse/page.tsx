"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import GameCard from "@/components/custom/GameCard";
import SmartSearch from "@/components/custom/SmartSearch"; 
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

type Category = {
    id: string;
    name: string;
};

type Product = {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    categories: Category[];
};

export default function BrowsePage() {
    const t = useTranslations("browse");
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [priceFilter, setPriceFilter] = useState<string | null>(null);
    const [genreFilter, setGenreFilter] = useState<string | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [loading, setLoading] = useState(true); // для Skeleton

    useEffect(() => {
        setLoading(true);
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setFiltered(data);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = products;

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q)
            );
        }

        if (priceFilter) {
            const priceMap: Record<string, (price: number) => boolean> = {
                free: (p) => p === 0,
                lt10: (p) => p < 10,
                lt20: (p) => p < 20,
                lt30: (p) => p < 30,
                gt15: (p) => p >= 15,
            };
            result = result.filter((p) => priceMap[priceFilter](p.price));
        }

        if (genreFilter) {
            result = result.filter((p) =>
                p.categories?.some((c) => c.name === genreFilter)
            );
        }

        setFiltered(result);
    }, [search, priceFilter, genreFilter, products]);

    const handleGenreClick = (genre: string) => {
        setGenreFilter((prev) => (prev === genre ? null : genre));
    };

    const handlePriceClick = (value: string) => {
        setPriceFilter((prev) => (prev === value ? null : value));
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-10 text-white">
            <SmartSearch products={products} />

            <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden mb-4 px-4 py-2 bg-[#26bbff] text-black rounded"
            >
                {t("filters")}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:col-span-1">
                    {loading
                        ? Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-[250px] w-full bg-neutral-800 rounded-md animate-pulse"
                            ></div>
                        ))
                        : filtered.map((product) => (
                            <GameCard key={product.id} product={product} />
                        ))}
                </div>

                <div className="space-y-4 hidden md:block">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">{t("filters")}</h2>
                        <button
                            onClick={() => {
                                setSearch("");
                                setPriceFilter(null);
                                setGenreFilter(null);
                            }}
                            className="text-sm px-4 py-1.5 bg-[#26bbff] hover:bg-[#61cdff] text-black rounded-md transition"
                        >
                            {t("resetFilters")}
                        </button>
                    </div>

                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("keywords")}
                        className="bg-neutral-800 text-white placeholder:text-neutral-400"
                    />

                    <Accordion type="single" collapsible className="w-full text-white">
                        <AccordionItem value="price">
                            <AccordionTrigger className="no-underline hover:no-underline">
                                {t("price")}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2">
                                {["free", "lt10", "lt20", "lt30", "gt15"].map((item) => (
                                    <p
                                        key={item}
                                        onClick={() => handlePriceClick(item)}
                                        className={`cursor-pointer px-1 transition-colors ${priceFilter === item
                                                ? "text-[#26bbff] font-semibold"
                                                : "hover:text-[#26bbff]"
                                            }`}
                                    >
                                        {t(item)}
                                    </p>
                                ))}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="genres">
                            <AccordionTrigger className="no-underline hover:no-underline">
                                {t("genresTitle")}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2">
                                {[
                                    "survival",
                                    "open_world",
                                    "adventure",
                                    "fighting",
                                    "exploration",
                                    "action",
                                    "shooter",
                                    "fantasy",
                                ].map((genre) => (
                                    <p
                                        key={genre}
                                        onClick={() => handleGenreClick(genre)}
                                        className={`cursor-pointer px-1 transition-colors ${genreFilter === genre
                                                ? "text-[#26bbff] font-semibold"
                                                : "hover:text-[#26bbff]"
                                            }`}
                                    >
                                        {t(`genres.${genre}`)}
                                    </p>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>

            {showMobileFilters && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-start p-4 overflow-auto">
                    <div className="bg-neutral-900 w-full max-w-sm rounded-lg p-4 space-y-4 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-semibold">{t("filters")}</h2>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="text-xl hover:text-neutral-400 transition"
                            >
                                ✕
                            </button>
                        </div>

                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t("keywords")}
                            className="bg-neutral-800 text-white placeholder:text-neutral-400"
                        />

                        <div>
                            <p className="font-semibold mb-1">{t("price")}</p>
                            <div className="space-y-1">
                                {["free", "lt10", "lt20", "lt30", "gt15"].map((item) => (
                                    <p
                                        key={item}
                                        onClick={() => handlePriceClick(item)}
                                        className={`cursor-pointer px-1 transition-colors ${priceFilter === item
                                                ? "text-[#26bbff] font-semibold"
                                                : "hover:text-[#26bbff]"
                                            }`}
                                    >
                                        {t(item)}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="font-semibold mb-1">{t("genresTitle")}</p>
                            <div className="space-y-1">
                                {[
                                    "survival",
                                    "open_world",
                                    "adventure",
                                    "fighting",
                                    "exploration",
                                    "action",
                                    "shooter",
                                    "fantasy",
                                ].map((genre) => (
                                    <p
                                        key={genre}
                                        onClick={() => handleGenreClick(genre)}
                                        className={`cursor-pointer px-1 transition-colors ${genreFilter === genre
                                                ? "text-[#26bbff] font-semibold"
                                                : "hover:text-[#26bbff]"
                                            }`}
                                    >
                                        {t(`genres.${genre}`)}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setSearch("");
                                setPriceFilter(null);
                                setGenreFilter(null);
                                setShowMobileFilters(false);
                            }}
                            className="w-full mt-4 bg-[#26bbff] hover:bg-[#72d3ff] text-black py-2 rounded-md transition"
                        >
                            {t("resetFilters")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

