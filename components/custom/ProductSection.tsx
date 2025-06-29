"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import GameCard from "./GameCard";
import { useTranslations } from "next-intl";

export default function ProductSection({
    titleKey,
    products,
}: {
    titleKey: string;
    products: any[];
}) {
    const t = useTranslations("header");

    return (
        <section className="space-y-4 px-4 md:px-0">
            <Carousel>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-bold text-white">{t(titleKey)}</h2>
                    <div className="flex gap-5">
                        <CarouselPrevious className="static border-none bg-neutral-600 hover:bg-neutral-400 text-white" />
                        <CarouselNext className="static border-none bg-neutral-600 hover:bg-neutral-400 text-white" />
                    </div>
                </div>

                <CarouselContent className="select-none">
                    {products.map((product) => (
                        <CarouselItem
                            key={product.id}
                            className="
								basis-[90%]
								sm:basis-1/2
								md:basis-1/3
								lg:basis-1/5
							"
                        >
                            <GameCard product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
}

