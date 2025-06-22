import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import authOptions from "../../auth/authOptions";

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { productId } = await req.json();

    await prisma.wishlistItem.delete({
        where: {
            userId_productId: {
                userId: user.id,
                productId,
            },
        },
    });

    return NextResponse.json({ success: true });
}

