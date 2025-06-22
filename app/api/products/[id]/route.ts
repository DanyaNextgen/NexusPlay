import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    try {
        await prisma.product.delete({ where: { id } });
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error("Ошибка при удалении продукта:", error);
        return new Response("Не удалось удалить продукт", { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const data = await req.json();

    try {
        const updated = await prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                image: data.image,
                categories: {
                    set: Array.isArray(data.categoryIds)
                        ? data.categoryIds.map((id: string) => ({ id }))
                        : [],
                },
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Ошибка при обновлении продукта:", error);
        return new Response("Не удалось обновить продукт", { status: 500 });
    }
}

