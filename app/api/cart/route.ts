import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import authOptions from "../auth/authOptions";

export async function GET() {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) return new Response("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });

    if (!user) return new Response("User not found", { status: 404 });

    const items = await prisma.cartItem.findMany({
        where: { userId: user.id },
        include: { product: true },
    });

    return Response.json(items);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) return new Response("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });

    if (!user) return new Response("User not found", { status: 404 });

    const { productId } = await req.json();

    await prisma.cartItem.upsert({
        where: {
            userId_productId: {
                userId: user.id,
                productId,
            },
        },
        update: {
            quantity: { increment: 1 },
        },
        create: {
            userId: user.id,
            productId,
            quantity: 1,
        },
    });

    return Response.json({ success: true });
}


