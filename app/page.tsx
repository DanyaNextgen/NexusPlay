import { getProducts } from "@/lib/actions/getProducts";
import SmartSearch from "@/components/custom/SmartSearch";
import { getLocale } from "next-intl/server"; 

export default async function HomePage() {
	const lang = await getLocale();
	const products = await getProducts(lang);

	return (
		<div className="max-w-[1200px] mx-auto px-4">
			<SmartSearch products={products} />
		</div>
	);
}


