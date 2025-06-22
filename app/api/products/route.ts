import { NextRequest } from "next/server";
import { addProduct } from "@/app/[locale]/admin/dashboard/actions";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            title,
            description,
            price,
            imageUrl,
            categoryIds,
        } = body;

        await addProduct({
            name: title,
            description,
            price: Number(price),
            image: imageUrl,
            categoryIds: categoryIds ?? [],
        });

        return Response.json({ success: true });
    } catch (error) {
        console.error("Failed to add product:", error);
        return Response.json({ error: "Failed to add product" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            include: { categories: true },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}


