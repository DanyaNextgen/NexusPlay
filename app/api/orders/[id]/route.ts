import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await req.json();
        const { status } = body;

        const updated = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                user: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return Response.json(updated);
    } catch (error) {
        console.error("Failed to update order:", error);
        return Response.json({ error: "Failed to update order" }, { status: 500 });
    }
}
