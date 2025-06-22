import authOptions from "@/app/api/auth/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getCart() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return [];

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            orders: {
                where: { status: "new" },
                include: { items: { include: { product: true } } },
            },
        },
    });

    const cart = user?.orders[0]?.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: 1,
    })) || [];

    return cart;
}

export async function getOrderHistory() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return [];

    const orders = await prisma.order.findMany({
        where: {
            user: { email: session.user.email },
            NOT: { status: "new" },
        },
        orderBy: { createdAt: "desc" },
    });

    return orders;
}