"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

type Product = {
    id: string;
    name: string;
    image: string;
    description: string;
    price: number;
    categories: { id: string; name: string }[];
};

function Description({ description }: { description: string | null }) {
    const [expanded, setExpanded] = useState(false);
    if (!description) return null;

    const shouldTruncate = description.length > 300;
    const displayText =
        expanded || !shouldTruncate
            ? description
            : description.slice(0, 300) + "...";

    return (
        <div className="text-neutral-300">
            <p>{displayText}</p>
            {shouldTruncate && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-2 text-blue-500 hover:underline"
                >
                    {expanded ? "Скрыть" : "Показать ещё"}
                </button>
            )}
        </div>
    );
}

export default function ProductClient({ product }: { product: Product }) {
    const t = useTranslations("header");
    const { data: session } = useSession();
    const router = useRouter();

    const [inCart, setInCart] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);

    useEffect(() => {
        if (!session?.user) return;

        fetch("/api/cart")
            .then((res) => res.json())
            .then((data) => {
                const exists = data.some((item: any) => item.product.id === product.id);
                setInCart(exists);
            });

        fetch("/api/wishlist")
            .then((res) => res.json())
            .then((data) => {
                const exists = data.some((item: any) => item.product.id === product.id);
                setInWishlist(exists);
            });
    }, [session, product.id]);

    const handleAddToCart = async () => {
        if (!session?.user) return router.push("/auth/signin");

        if (inCart) return router.push("/cart");

        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                body: JSON.stringify({ productId: product.id }),
            });

            if (res.ok) {
                setInCart(true);
                toast({
                    title: t("addedToCart"),
                    description: t("goToCart") + ": " + product.name,
                });
            } else throw new Error("Ошибка запроса");
        } catch {
            toast({
                title: "Ошибка",
                description: "Не удалось добавить в корзину.",
                variant: "destructive",
            });
        }
    };

    const handleAddToWishlist = async () => {
        if (!session?.user) return router.push("/auth/signin");

        if (inWishlist) return router.push("/wishlist");

        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                body: JSON.stringify({ productId: product.id }),
            });

            if (res.ok) {
                setInWishlist(true);
                toast({
                    title: t("addedToWishlist"),
                    description: t("goToWishlist") + ": " + product.name,
                });
            } else throw new Error("Ошибка запроса");
        } catch {
            toast({
                title: "Ошибка",
                description: "Не удалось добавить в избранное.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 text-white grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-6">
                <h1 className="text-4xl font-bold leading-tight">{product.name}</h1>

                <div className="w-full h-[420px] bg-neutral-900 rounded-xl overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name ?? "product"}
                        className="w-full h-full object-cover"
                    />
                </div>

                <Description description={product.description} />

                {product.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {product.categories.map((category) => (
                            <Badge
                                key={category.id}
                                className="bg-neutral-800 border border-neutral-700 text-sm"
                            >
                                {category.name}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col justify-start gap-6 h-fit">
                <p className="text-4xl font-semibold">
                    {product.price === 0 ? t("free") : `${product.price} $`}
                </p>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={handleAddToCart}
                        className="w-full bg-[#26bbff] hover:bg-[#61cdff] text-black text-base py-6"
                    >
                        {inCart ? t("goToCart") : t("addToCart")}
                    </Button>
                    <Button
                        onClick={handleAddToWishlist}
                        className="w-full bg-[#343437] border-neutral-700 text-white hover:bg-[#636366] text-base py-6"
                    >
                        {inWishlist ? t("goToWishlist") : t("addToWishlist")}
                    </Button>
                </div>
            </div>
        </div>
    );
}

