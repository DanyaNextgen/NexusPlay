import authOptions from "@/app/api/auth/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getWishlist() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return [];

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            wishlistItems: {
                include: { product: true },
            },
        },
    })

    return user?.wishlistItems.map(item => item.product) || [];
}
