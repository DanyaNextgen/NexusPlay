import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const data = await req.json()
        const updated = await prisma.user.update({
            where: { id: params.id },
            data: {
                status: data.status,
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Ошибка при обновлении пользователя:", error)
        return NextResponse.json({ error: "Ошибка" }, { status: 500 })
    }
}
