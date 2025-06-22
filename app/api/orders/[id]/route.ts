import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;

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

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Failed to update order:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}

