import { notFound } from "next/navigation";
import { getProductById } from "@/app/[locale]/admin/dashboard/actions";
import ProductClient from "@/components/custom/ProductClient";

export default async function ProductPage({ params }: any) {
    const product = await getProductById(params.id);
    if (!product) return notFound();
    return <ProductClient product={product} />;
}



