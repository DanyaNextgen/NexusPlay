import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
    req: Request,
    { params }: { params: { id: string } | Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const data = await req.json();

    const updated = await prisma.category.update({
        where: { id: resolvedParams.id },
        data: { name: data.name },
    });

    return NextResponse.json(updated);
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } | Promise<{ id: string }> }
) {
    const resolvedParams = await params;

    await prisma.category.delete({
        where: { id: resolvedParams.id },
    });

    return NextResponse.json({ success: true });
}
