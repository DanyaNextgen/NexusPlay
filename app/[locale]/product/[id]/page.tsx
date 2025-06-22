import { notFound } from "next/navigation";
import { getProductById } from "@/app/[locale]/admin/dashboard/actions";
import ProductClient from "@/components/custom/ProductClient";

interface Params {
    locale: string;
    id: string;
}

interface PageProps {
    params: Params;
}

export default async function ProductPage({ params }: PageProps) {
    const product = await getProductById(params.id);
    if (!product) return notFound();

    return <ProductClient product={product} />;
}

