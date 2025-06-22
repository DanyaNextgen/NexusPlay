import { notFound } from "next/navigation";
import { getProductById } from "../../admin/dashboard/actions";
import ProductClient from "@/components/custom/ProductClient";

type Props = {
    params: { id: string };
};

export default async function ProductPage({ params }: Props) {
    const product = await getProductById(params.id);
    if (!product) return notFound();

    return <ProductClient product={product} />;
}


