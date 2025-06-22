"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { toast } from "@/hooks/use-toast";

type Product = {
    id: string;
    name: string;
    image: string;
    price: number;
};

type WishlistItem = {
    id: string;
    product: Product;
};

export default function WishlistPage() {
    const { data: session } = useSession();
    const [wishlist, setWishlist] = useState<WishlistItem[] | null>(null);
    const [inCartIds, setInCartIds] = useState<string[]>([]);
    const router = useRouter();
    const t = useTranslations("header");
    const c = useTranslations("cart");

    useEffect(() => {
        if (!session?.user) {
            router.push("/auth/signin");
            return;
        }

        Promise.all([
            fetch("/api/wishlist").then((res) => res.json()),
            fetch("/api/cart").then((res) => res.json()),
        ])
            .then(([wishlistData, cartData]) => {
                setWishlist(wishlistData);
                setInCartIds(cartData.map((item: any) => item.product.id));
            })
            .catch(() => {
                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить данные.",
                    variant: "destructive",
                });
            });
    }, [session]);

    const handleRemove = async (productId: string) => {
        await fetch("/api/wishlist/remove", {
            method: "DELETE",
            body: JSON.stringify({ productId }),
        });
        setWishlist((prev) => prev?.filter((item) => item.product.id !== productId) || []);
        toast({ title: t("removedFromWishlist") });
    };

    const handleCartClick = async (productId: string) => {
        if (inCartIds.includes(productId)) {
            router.push("/cart");
            return;
        }

        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                body: JSON.stringify({ productId }),
            });

            if (res.ok) {
                setInCartIds((prev) => [...prev, productId]);
                toast({
                    title: t("addedToCart"),
                    description: t("goToCart"),
                });
            } else throw new Error();
        } catch {
            toast({
                title: "Ошибка",
                description: "Не удалось добавить в корзину.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10 text-white space-y-6">
            <h1 className="text-3xl font-bold text-center">{t("wishlist")}</h1>

            {wishlist === null ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                            <div className="flex gap-4 items-center">
                                <Skeleton className="w-16 h-16 rounded" />
                                <div className="space-y-2">
                                    <Skeleton className="w-40 h-4" />
                                    <Skeleton className="w-24 h-4" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="w-28 h-10 rounded-md" />
                                <Skeleton className="w-20 h-10 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center space-y-6 py-20 px-4">
                    <img src="/NexusPlay.png" alt="NexusPlay" className="w-20 h-20 md:w-24 md:h-24 opacity-80" />
                    <p className="text-3xl md:text-5xl font-bold">{c("wishlistEmpty")}</p>
                    <Button onClick={() => router.push("/")} className="bg-[#26bbff] hover:bg-[#61cdff] text-black px-6 py-2 text-sm md:text-base">
                        {c("goToStore")}
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {wishlist.map(({ product }) => (
                        <div
                            key={product.id}
                            className="bg-[#1a1a1a] p-4 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                        >
                            <div className="flex gap-4 items-center">
                                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                                <div>
                                    <p className="font-semibold">{product.name}</p>
                                    <p className="text-sm text-neutral-400">{product.price === 0 ? t("free") : `${product.price} $`}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap justify-end">
                                <Button
                                    className="bg-[#26bbff] hover:bg-[#61cdff] text-black text-sm md:text-base"
                                    onClick={() => handleCartClick(product.id)}
                                >
                                    {inCartIds.includes(product.id) ? t("goToCart") : t("addToCart")}
                                </Button>
                                <Button variant="destructive" onClick={() => handleRemove(product.id)}>
                                    {t("remove")}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
