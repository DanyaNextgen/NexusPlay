"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CiCirclePlus } from "react-icons/ci";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useTranslations } from "next-intl";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

type Product = {
    id: string;
    image: string;
    name: string;
    description: string;
    price: number;
};

export default function GameCard({ product }: { product: Product }) {
    const t = useTranslations("header");
    const router = useRouter();
    const { data: session } = useSession();
    const [isInWishlist, setIsInWishlist] = useState(false);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!session?.user) return;

            const res = await fetch("/api/wishlist");
            if (!res.ok) return;

            const items = await res.json();
            const exists = items.some((item: any) => item.product.id === product.id);
            setIsInWishlist(exists);
        };

        fetchWishlist();
    }, [session, product.id]);

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!session?.user) {
            router.push("/auth/signin");
            return;
        }

        try {
            if (isInWishlist) {
                const res = await fetch("/api/wishlist/remove", {
                    method: "DELETE",
                    body: JSON.stringify({ productId: product.id }),
                });

                if (!res.ok) throw new Error("Remove failed");

                toast({
                    title: t("removedFromWishlist"),
                    description: product.name,
                });

                setIsInWishlist(false);
            } else {
                const res = await fetch("/api/wishlist", {
                    method: "POST",
                    body: JSON.stringify({ productId: product.id }),
                });

                if (!res.ok) throw new Error("Add failed");

                toast({
                    title: t("addedToWishlist"),
                    description: t("goToWishlist") + ": " + product.name,
                });

                setIsInWishlist(true);
            }
        } catch (err) {
            toast({
                title: "Ошибка",
                description: "Не удалось обновить список желаемого.",
                variant: "destructive",
            });
        }
    };

    const handleCardClick = () => {
        router.push(`/product/${product.id}`);
    };

    return (
        <div
            className="rounded overflow-hidden shadow-lg group cursor-pointer transition duration-300 relative"
            onClick={handleCardClick}
        >
            <div className="relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[260px] object-cover rounded-sm"
                />

                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={toggleWishlist}>
                                    {isInWishlist ? (
                                        <IoIosCheckmarkCircleOutline className="text-green-400 bg-black rounded-full text-3xl hover:scale-110 transition" />
                                    ) : (
                                        <CiCirclePlus className="text-white bg-black rounded-full text-3xl hover:scale-110 transition" />
                                    )}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p>
                                    {isInWishlist
                                        ? t("removeFromWishlist")
                                        : t("addToWishlist")}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="py-2">
                <h2 className="text-base font-bold text-white">{product.name}</h2>
                <p className="text-white mt-1">
                    {product.price === 0 ? t("free") : `${product.price} $`}
                </p>
            </div>
        </div>
    );
}


