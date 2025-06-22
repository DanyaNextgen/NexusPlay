import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return new Response("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            wishlistItems: { include: { product: true } },
        },
    });

    return Response.json(user?.wishlistItems || []);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return new Response("Unauthorized", { status: 401 });
    }

    const user = session.user as { id: string; email: string };
    const { productId } = await req.json();

    await prisma.wishlistItem.upsert({
        where: {
            userId_productId: {
                userId: user.id,
                productId,
            },
        },
        update: {},
        create: {
            userId: user.id,
            productId,
        },
    });

    return Response.json({ success: true });
}




