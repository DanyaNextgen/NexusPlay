import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import authOptions from "../../auth/authOptions";

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { productId, quantity } = await req.json();

    await prisma.cartItem.update({
        where: {
            userId_productId: {
                userId: user.id,
                productId,
            },
        },
        data: { quantity },
    });

    return NextResponse.json({ success: true });
}

