import SmartSearch from "@/components/custom/SmartSearch";
import ProductSection from "@/components/custom/ProductSection";
import { getProducts } from "./admin/dashboard/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "NexusPlay – Открой для себя новые игры",
	description: "Ищи, открывай и покупай лучшие игры. Наслаждайся качественным геймингом на платформе NexusPlay.",
	openGraph: {
		title: "NexusPlay – Твоя игровая платформа",
		description: "Игры всех жанров, лучшие предложения, новинки и популярные хиты.",
		url: "https://nexusplay.uz",
		siteName: "NexusPlay",
		images: [
			{
				url: "/NexusPlay.png",
				width: 1200,
				height: 630,
				alt: "NexusPlay Banner",
			},
		],
		type: "website",
	},
};

export default async function HomePage() {
	const products = await getProducts();

	const chunkSize = 10;
	const first = products.slice(0, chunkSize);
	const second = products.slice(chunkSize, chunkSize * 2);
	const third = products.slice(chunkSize * 2, chunkSize * 3);

	return (
		<>
			<SmartSearch products={products} />

			<div className="max-w-[1200px] mx-auto space-y-10">
				<ProductSection titleKey="discoverTitle" products={first} />
				<ProductSection titleKey="popular" products={second} />
				<ProductSection titleKey="recent" products={third} />
			</div>
		</>
	);
}



