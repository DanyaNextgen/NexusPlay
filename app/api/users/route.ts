import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error("Ошибка при получении пользователей:", error)
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
    }
}
