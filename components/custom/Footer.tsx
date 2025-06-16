"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { IoArrowUpCircleOutline } from "react-icons/io5";

const columns = [
    {
        key: "games",
        items: [
            "fortnite",
            "fallGuys",
            "rocketLeague",
            "unrealTournament",
            "infinityBlade",
            "shadowComplex",
            "roboRecall",
        ],
    },
    {
        key: "marketplaces",
        items: [
            "nexusPlayStore",
            "fab",
            "sketchfab",
            "artStation",
            "storeRefundPolicy",
            "storeEula",
        ],
    },
    {
        key: "tools",
        items: [
            "unrealEngine",
            "uefn",
            "metahuman",
            "twinmotion",
            "megascans",
            "realityScan",
            "radGameTools",
        ],
    },
    {
        key: "onlineServices",
        items: [
            "nexusOnlineServices",
            "kidsWebServices",
            "servicesAgreement",
            "acceptableUsePolicy",
            "trustStatement",
            "subprocessorList",
        ],
    },
    {
        key: "company",
        items: [
            "about",
            "newsroom",
            "careers",
            "students",
            "uxResearch",
        ],
    },
    {
        key: "resources",
        items: [
            "devCommunity",
            "megaGrants",
            "supportACreator",
            "creatorAgreement",
            "distributeOnNexusPlay",
            "unrealBranding",
            "fanArtPolicy",
        ],
    },
] as const;

export default function Footer() {
    const f = useTranslations("footer");

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <footer className="bg-[#18181c] text-white px-4 md:px-8 lg:px-20 py-10">

            <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
                {columns.map((col) => (
                    <div key={col.key}>
                        <h4 className="text-xl font-bold mb-4">{f(col.key)}</h4>
                        <ul className="space-y-2">
                            {col.items.map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors duration-300">
                                        {f(item)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="sm:hidden mb-10">
                <Accordion type="single" collapsible className="w-full">
                    {columns.map((col) => (
                        <AccordionItem key={col.key} value={col.key}>
                            <AccordionTrigger className="text-xl font-bold hover:no-underline">{f(col.key)}</AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-2 pl-2">
                                    {col.items.map((item) => (
                                        <li key={item}>
                                            <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors duration-300">
                                                {f(item)}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            <div className="border-t border-[#3a3a3e] my-6" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-4xl">
                    <p className="text-xs text-muted-foreground mb-6">
                        © 2025, NexusPlay, Inc. All rights reserved. Nexus, NexusPlay, the NexusPlay logo, Fortnite, the Fortnite logo, Unreal, Unreal Engine, the Unreal Engine logo, Unreal Tournament, and the Unreal Tournament logo are trademarks or registered trademarks of NexusPlay, Inc. in the United States of America and elsewhere. Other brands or product names are the trademarks of their respective owners. Our websites may contain links to other sites and resources provided by third parties. These links are provided for your convenience only. NexusPlay has no control over the contents of those sites or resources, and accepts no responsibility for them or for any loss or damage that may arise from your use of them.
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <Link href="#" className="hover:text-white transition-colors duration-300">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors duration-300">Safety & Security</Link>
                        <Link href="#" className="hover:text-white transition-colors duration-300">{f("storeRefundPolicy")}</Link>
                        <Link href="#" className="hover:text-white transition-colors duration-300">Publisher Index</Link>
                    </div>
                </div>
                <Button
                    className="flex items-center justify-between text-left p-6 rounded-lg bg-[#3a3a3e] hover:bg-[#49494d] transition-colors duration-300 cursor-pointer self-center md:self-start"
                    onClick={scrollToTop}
                >
                    {f("backToTop")}
                    <IoArrowUpCircleOutline />
                </Button>
            </div>
        </footer>
    );
}


