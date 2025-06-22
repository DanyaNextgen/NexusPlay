"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Product = {
    id: string;
    name: string;
    image: string;
    price: number;
};

type OrderItem = {
    id: string;
    product: Product;
    quantity: number;
};

type Order = {
    id: string;
    createdAt: string;
    status: string;
    items: OrderItem[];
};

export default function OrderHistoryPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[] | null>(null);

    useEffect(() => {
        if (!session?.user) return router.push("/auth/signin");

        fetch("/api/orders/history")
            .then((res) => res.json())
            .then((data) => setOrders(data));
    }, [session]);

    if (!orders) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
                <Skeleton className="h-8 w-48" />
                {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 text-white space-y-8">
            <h1 className="text-3xl font-bold">История заказов</h1>

            {orders.length === 0 ? (
                <p className="text-neutral-400">У вас нет заказов.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="bg-[#1a1a1a] p-6 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">
                                Заказ от {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <Badge className="text-sm capitalize">
                                {order.status}
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            {order.items.map(({ product, quantity }) => (
                                <div key={product.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div>
                                            <p>{product.name}</p>
                                            <p className="text-sm text-neutral-400">
                                                {product.price} $ × {quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm">{product.price * quantity} $</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
