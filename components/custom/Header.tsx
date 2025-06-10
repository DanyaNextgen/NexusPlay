import Link from "next/link";
import { MdLanguage } from "react-icons/md";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export const Header = () => {
    const t = useTranslations("header");

    return (
        <div className="bg-[#18181c] flex items-center justify-between px-5 select-none">
            <div className="flex items-center gap-5">
                <Link href="/">
                    <img src="./NexusPlay.png" alt="" className="w-[90px]" />
                </Link>
                <Link href="/">
                    <img src="./Store.png" alt="" className="w-[90px]" />
                </Link>
                <Link
                    href="/"
                    className="text-white font-semibold hover:text-[#a9a9aa] transition-colors duration-300"
                >
                    {t("support")}
                </Link>
                <Link
                    href="/"
                    className="text-white font-semibold hover:text-[#a9a9aa] transition-colors duration-300"
                >
                    {t("distribute")}
                </Link>
            </div>
            <div className="flex items-center gap-5">
                <MdLanguage
                    size={25}
                    className="text-white hover:text-[#a9a9aa] transition-colors duration-300 cursor-pointer"
                />
                <Button className="text-white bg-[#353539] rounded-lg hover:bg-[#656567] transition-colors duration-300">
                    {t("signin")}
                </Button>
            </div>
        </div>
    )
}