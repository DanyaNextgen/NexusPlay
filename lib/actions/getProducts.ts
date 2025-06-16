import prisma from "../prisma";

export async function getProducts(lang: string) {
	return await prisma.product.findMany({
		include: {
			translations: {
				where: { language: lang },
				select: {
					name: true,
					description: true,
					language: true,
				},
			},
			category: {
				select: { name: true },
			},
		},
		orderBy: { createdAt: "desc" },
	});
}
