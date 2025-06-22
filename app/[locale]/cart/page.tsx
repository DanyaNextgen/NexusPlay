"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

export default function CartPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [cart, setCart] = useState<any[] | null>(null);
    const [form, setForm] = useState({ fullName: "", phone: "", address: "" });
    const [open, setOpen] = useState(false);
    const c = useTranslations("cart");
    const t = useTranslations("header");

    useEffect(() => {
        if (!session?.user) return router.push("/auth/signin");

        fetch("/api/cart")
            .then((res) => res.json())
            .then((data) => setCart(data));
    }, [session]);

    const updateQty = async (id: string, quantity: number) => {
        if (quantity < 1) return;
        await fetch("/api/cart/update", {
            method: "PATCH",
            body: JSON.stringify({ productId: id, quantity }),
        });
        setCart((prev) =>
            prev?.map((item) =>
                item.product.id === id ? { ...item, quantity } : item
            ) || []
        );
    };

    const removeItem = async (id: string) => {
        await fetch("/api/cart/remove", {
            method: "DELETE",
            body: JSON.stringify({ productId: id }),
        });
        setCart((prev) => prev?.filter((item) => item.product.id !== id) || []);
    };

    const handleOrder = async () => {
        const res = await fetch("/api/order/submit", {
            method: "POST",
            body: JSON.stringify(form),
        });

        if (res.ok) {
            setCart([]);
            setOpen(false);
            toast({
                title: c("orderSuccess"),
                description: c("orderSuccessDescription"),
            });
        } else {
            toast({
                title: "Ошибка",
                description: "Не удалось оформить заказ.",
                variant: "destructive",
            });
        }
    };

    const total = cart?.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
    );

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10 text-white space-y-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-3xl font-bold">{c("cart")}</h1>
                <Button
                    className="text-white border border-neutral-700 hover:bg-neutral-800"
                    onClick={() => router.push("/orders")}
                >
                    {c("viewOrders")}
                </Button>
            </div>

            {cart === null ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded"
                        >
                            <div className="flex gap-4 items-center">
                                <Skeleton className="w-16 h-16 rounded" />
                                <div className="space-y-2">
                                    <Skeleton className="w-40 h-4" />
                                    <Skeleton className="w-24 h-3" />
                                </div>
                            </div>
                            <Skeleton className="w-32 h-8 rounded" />
                        </div>
                    ))}
                </div>
            ) : cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center space-y-6 py-20 px-4">
                    <img src="/NexusPlay.png" alt="NexusPlay" className="w-20 h-20 md:w-24 md:h-24 opacity-80" />
                    <p className="text-3xl md:text-5xl font-bold text-white">{c("emptyCart")}</p>
                    <Button onClick={() => router.push("/")} className="bg-[#26bbff] hover:bg-[#61cdff] text-black px-6 py-2 text-sm md:text-base">
                        {c("goToStore")}
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {cart.map(({ product, quantity }) => (
                        <div
                            key={product.id}
                            className="flex flex-col md:flex-row md:justify-between md:items-center bg-[#1a1a1a] p-4 rounded gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={product.image}
                                    className="w-16 h-16 object-cover rounded"
                                    alt={product.name}
                                />
                                <div>
                                    <p>{product.name}</p>
                                    <p className="text-sm text-neutral-400">
                                        {product.price} $
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                <Button onClick={() => updateQty(product.id, quantity - 1)}>-</Button>
                                <span>{quantity}</span>
                                <Button onClick={() => updateQty(product.id, quantity + 1)}>+</Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => removeItem(product.id)}
                                >
                                    {t("remove")}
                                </Button>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between items-center text-lg font-semibold pt-4 border-t border-neutral-700">
                        <span>{c("total")}:</span>
                        <span>{total} $</span>
                    </div>
                </div>
            )}

            {cart && cart.length > 0 && (
                <>
                    <Button
                        className="w-full bg-[#26bbff] hover:bg-[#61cdff] text-black"
                        onClick={() => setOpen(true)}
                    >
                        {c("order")}
                    </Button>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="bg-[#1a1a1a] border border-neutral-700 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold">
                                    {c("orderTitle")}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                                <Input
                                    placeholder="Name"
                                    value={form.fullName}
                                    onChange={(e) =>
                                        setForm({ ...form, fullName: e.target.value })
                                    }
                                />
                                <Input
                                    placeholder="Phone"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({ ...form, phone: e.target.value })
                                    }
                                />
                                <Input
                                    placeholder="Address"
                                    value={form.address}
                                    onChange={(e) =>
                                        setForm({ ...form, address: e.target.value })
                                    }
                                />

                                <Button
                                    className="w-full bg-[#26bbff] hover:bg-[#61cdff] text-black"
                                    onClick={handleOrder}
                                >
                                    {c("confirmOrder")}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    );
}
