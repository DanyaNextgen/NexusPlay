"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type AddProductParams = {
    name: string;
    description: string;
    price: number;
    image: string;
    categoryIds: string[];
};

export async function addProduct({
    name,
    description,
    price,
    image,
    categoryIds,
}: AddProductParams) {
    const product = await prisma.product.create({
        data: {
            name,
            description,
            price,
            image,
            categories: {
                connect: categoryIds.map((name) => ({ name })),
            },
        },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return product;
}

export async function getProducts() {
    return await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            categories: true,
        },
    });
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/");
}

export async function getProductById(id: string) {
    return await prisma.product.findUnique({
        where: { id },
        include: { categories: true },
    });
}
