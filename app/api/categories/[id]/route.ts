import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const data = await req.json()

    const updated = await prisma.category.update({
        where: { id: params.id },
        data: { name: data.name },
    })

    return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    await prisma.category.delete({
        where: { id: params.id },
    })

    return NextResponse.json({ success: true })
}
