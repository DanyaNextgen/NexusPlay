import SmartSearch from "@/components/custom/SmartSearch";
import ProductSection from "@/components/custom/ProductSection";
import { getProducts } from "./admin/dashboard/actions";

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
				<ProductSection titleKey="discoverTitle" products={first}/>
				<ProductSection titleKey="popular" products={second} />
				<ProductSection titleKey="recent" products={third} />
			</div>
		</>
	);
}



