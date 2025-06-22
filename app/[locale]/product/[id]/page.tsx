import { notFound } from "next/navigation";
import { getProductById } from "@/app/[locale]/admin/dashboard/actions";
import ProductClient from "@/components/custom/ProductClient";

export default async function ProductPage({
    params,
}: {
    params: { locale: string; id: string } | Promise<{ locale: string; id: string }>;
}) {
    const resolvedParams = await params;
    const product = await getProductById(resolvedParams.id);
    if (!product) return notFound();

    return <ProductClient product={product} />;
}


