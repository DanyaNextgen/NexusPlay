"use client";

import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdLanguage } from "react-icons/md";
import { useEffect, useState } from "react";
import { IoCheckmark } from "react-icons/io5";

const LANGUAGES: { code: string; label: string }[] = [
    { code: "en", label: "English" },
    { code: "ru", label: "Русский" },
    { code: "uz", label: "O'zbekcha" },
    { code: "de", label: "Deutsch" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "it", label: "Italiano" },
    { code: "pl", label: "Polski" },
    { code: "pt", label: "Português (Brasil)" },
    { code: "tr", label: "Türkçe" }
];

const SwitchLang = () => {
    const router = useRouter();
    const [currentLang, setCurrentLang] = useState("en");

    useEffect(() => {
        const match = document.cookie.match(/locale=(\w{2,5})/);
        if (match?.[1]) setCurrentLang(match[1]);
    }, []);

    function handleLanguageChange(lang: string) {
        document.cookie = `locale=${lang}; path=/;`;
        setCurrentLang(lang);
        router.refresh();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <MdLanguage
                    size={25}
                    className="text-white hover:text-[#a9a9aa] transition-colors duration-300 cursor-pointer"
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-52 bg-[#1f1f24] text-white p-1 rounded-lg shadow-xl border border-neutral-800"
            >
                {LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`text-sm cursor-pointer hover:bg-[#2a2a2f] transition-colors duration-300 rounded px-2 py-2 flex gap-2`}
                    >
                        <span className="w-4 h-4 flex items-center">
                            {currentLang === lang.code && (
                                <IoCheckmark className="text-[#26bbff]" />
                            )}
                        </span>

                        <div>
                            {lang.label}
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SwitchLang;