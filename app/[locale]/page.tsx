import { getProducts } from "@/lib/actions/getProducts";
import SmartSearch from "@/components/custom/SmartSearch";
import { getLocale } from "next-intl/server"; 

// export default async function HomePage() {
// 	const lang = await getLocale();
// 	const products = await getProducts(lang);

// 	return (
// 		<div className="max-w-[1200px] mx-auto px-4">
// 			<SmartSearch products={products} />
// 		</div>
// 	);
// }

export default async function HomePage() {
	const lang = await getLocale();
	const products = await getProducts(lang);

	return (
		<>
			<SmartSearch products={products} />
			<div className="max-w-[1200px] mx-auto px-4 py-20 space-y-10">
				{Array.from({ length: 50 }).map((_, i) => (
					<p key={i} className="text-white">Контент {i + 1}</p>
				))}
			</div>
		</>
	);
}

