import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import authOptions from "../../auth/authOptions";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cartItems = await prisma.cartItem.findMany({
        where: { userId: user.id },
        include: { product: true },
    });

    if (cartItems.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const body = await req.json();
    const { fullName, phone, address } = body;

    const order = await prisma.order.create({
        data: {
            userId: user.id,
            fullName,
            phone,
            address,
            status: "new",
            items: {
                create: cartItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            },
        },
    });

    await prisma.cartItem.deleteMany({
        where: { userId: user.id },
    });

    return NextResponse.json({ success: true, orderId: order.id });
}
