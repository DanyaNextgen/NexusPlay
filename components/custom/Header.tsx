"use client"
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SwitchLang from "./SwitchLang";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { MdLanguage } from "react-icons/md";
import { IoCheckmark, IoChevronBackOutline } from "react-icons/io5";
import { IoChevronForwardOutline } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { PiSignOut } from "react-icons/pi";
import { useSession, signOut } from "next-auth/react";

export const Header = () => {
	const t = useTranslations("header");
	const n = useTranslations("nexus_nav");
	const d = useTranslations("distribute_nav");
	const [menuOpen, setMenuOpen] = useState(false);
	const [submenu, setSubmenu] = useState<"language" | "distribute" | "account" | "">("");
	const { data: session } = useSession();

	return (
		<div className="bg-[#18181c] select-none">
			<div className="hidden md:flex items-center justify-between p-4">
				<div className="flex items-center gap-5">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="!bg-transparent !text-white !border-none hover:!bg-transparent data-[state=open]:!bg-transparent focus:!bg-transparent focus-visible:!ring-0 p-0 flex items-center">
									<img src="./NexusPlay.png" alt="" className="w-[90px]" />
								</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-[#27272a]/100 backdrop-blur-md backdrop-saturate-150">
									<ul className="grid grid-cols-2 w-[360px] px-4 py-3">
										<li>
											<div className="font-bold text-white text-base mb-2">{n("play")}</div>
											<NavigationMenuLink asChild>
												<Link href="#" className="block text-white p-2 rounded hover:bg-[#49494d] transition-colors duration-300">Fortnite</Link>
											</NavigationMenuLink>
											<NavigationMenuLink asChild>
												<Link href="#" className="block text-white p-2 rounded hover:bg-[#49494d] transition-colors duration-300">Rocket League</Link>
											</NavigationMenuLink>
											<NavigationMenuLink asChild>
												<Link href="#" className="block text-white p-2 rounded hover:bg-[#49494d] transition-colors duration-300">Fall Guys</Link>
											</NavigationMenuLink>
										</li>
										<li>
											<div className="font-bold text-white text-base mb-2">{n("discover")}</div>
											<NavigationMenuLink asChild>
												<Link href="#" className="block text-white p-2 rounded hover:bg-[#49494d] transition-colors duration-300">NexusPlay Store</Link>
											</NavigationMenuLink>
											<NavigationMenuLink asChild>
												<Link href="#" className="block text-white p-2 rounded hover:bg-[#49494d] transition-colors duration-300">Fab</Link>
											</NavigationMenuLink>
											<NavigationMenuLink asChild>
												<Link href="#" className="block text-white p-2 rounded hover:bg-[#49494d] transition-colors duration-300">Sketchfab</Link>
											</NavigationMenuLink>
										</li>
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
					<Link href="/">
						<img src="./Store.png" alt="" className="w-[90px]" />
					</Link>
					<Link href="/" className="text-white font-semibold hover:text-[#a9a9aa] transition-colors duration-300">{t("support")}</Link>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="!bg-transparent !text-white !border-none hover:!bg-transparent data-[state=open]:!bg-transparent focus:!bg-transparent focus-visible:!ring-0">
									<Link href="/" className="text-white font-semibold text-base hover:text-[#a9a9aa] transition-colors duration-300">{t("distribute")}</Link>
								</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-[#27272a]/100 backdrop-blur-md backdrop-saturate-150">
									<ul className="grid w-[240px] gap-2 p-3 rounded-2xl">
										{["distribute_nexus", "forum", "docs", "learning"].map((key) => (
											<li key={key}>
												<NavigationMenuLink asChild>
													<Link href="#" className="text-white block p-2 rounded hover:bg-[#49494d] transition-colors duration-300">{d(key)}</Link>
												</NavigationMenuLink>
											</li>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="flex items-center gap-5">
					<SwitchLang />
					{session ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition">
									<Avatar className="w-8 h-8">
										<AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
										<AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
									</Avatar>
									<span className="text-white font-medium">{session.user?.name}</span>
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="bg-[#27272a] text-white">
								<DropdownMenuItem className="hover:bg-[#49494d] cursor-pointer">
									<Link href="/cart" className="w-full flex items-center gap-1"><MdOutlineShoppingCart /> {t("cart")}</Link>
								</DropdownMenuItem>
								<DropdownMenuItem className="hover:bg-[#49494d] cursor-pointer">
									<Link href="/wishlist" className="w-full flex items-center gap-1"><IoIosCheckmarkCircleOutline /> {t("wishlist")}</Link>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => signOut()}
									className="flex items-center gap-1 hover:bg-[#49494d] cursor-pointer"
								>
									<PiSignOut />{t("signout")}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<>
							<Button asChild className="text-white bg-[#353539] rounded-lg hover:bg-[#656567] transition-colors duration-300">
								<Link href="/auth/signin">{t("signin")}</Link>
							</Button>

							<Button asChild className="text-white bg-[#26bbff] rounded-lg hover:bg-[#72d3ff] transition-colors duration-300">
								<Link href="/auth/login">{t("login")}</Link>
							</Button>
						</>
					)}
				</div>
			</div>

			<div className="md:hidden relative z-50 flex items-center justify-between p-4">
				{!menuOpen && (
					<img src="./NexusPlay.png" alt="" className="w-[90px] cursor-pointer" />
				)}

				<Link href="/">
					<img src="./Store.png" alt="" className="w-[90px]" />
				</Link>

				<button
					onClick={() => {
						submenu && setSubmenu("");
						setMenuOpen(!menuOpen);
					}}
					className="text-white text-2xl"
				>
					{menuOpen ? <IoMdClose /> : <RxHamburgerMenu />}
				</button>
			</div>

			<div
				className={`fixed inset-0 z-40 bg-[#18181c] text-white transition-all duration-500 ease-in-out transform ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
					} py-20 px-5 flex flex-col`}
			>
				{submenu === "" && (
					<>
						<div className="flex items-center justify-end gap-3 mb-6">
							<button
								onClick={() => setSubmenu("language")}
								className="text-2xl hover:text-[#a9a9aa] transition-colors duration-300"
							>
								<MdLanguage
									size={25}
									className="text-white hover:text-[#a9a9aa] transition-colors duration-300 cursor-pointer"
								/>
							</button>
							<div className="flex gap-2">
								{session ? (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<button className="flex items-center gap-2 hover:opacity-80 transition">
												<Avatar className="w-8 h-8">
													<AvatarImage src={session.user?.image || ""} alt="" />
													<AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
												</Avatar>
											</button>
										</DropdownMenuTrigger>

										<DropdownMenuContent className="bg-[#27272a] text-white mt-2">
											<DropdownMenuItem asChild className="hover:bg-[#49494d] cursor-pointer">
												<Link href="/cart" className="flex items-center gap-2">
													<MdOutlineShoppingCart />
													{t("cart")}
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild className="hover:bg-[#49494d] cursor-pointer">
												<Link href="/wishlist" className="flex items-center gap-2">
													<IoIosCheckmarkCircleOutline />
													{t("wishlist")}
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => signOut()}
												className="hover:bg-[#49494d] cursor-pointer flex items-center gap-2"
											>
												<PiSignOut />
												{t("signout")}
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								) : (
									<>
										<Button asChild className="bg-[#353539] hover:bg-[#656567] transition">
											<Link href="/auth/signin">{t("signin")}</Link>
										</Button>
										<Button asChild className="bg-[#26bbff] hover:bg-[#72d3ff] text-white ml-2 transition">
											<Link href="/auth/login">{t("login")}</Link>
										</Button>
									</>
								)}
							</div>
						</div>

						<p className="text-4xl font-bold mb-4 p-3">{t("menu")}</p>
						<div className="flex flex-col gap-4">
							<Link
								href="/"
								className="block text-left p-3 rounded-lg hover:bg-[#49494d] transition-colors duration-300 cusror-pointer"
							>
								{t("support")}
							</Link>
							<button
								onClick={() => setSubmenu("distribute")}
								className="flex items-center justify-between text-left p-3 rounded-lg hover:bg-[#49494d] transition-colors duration-300 cusror-pointer"
							>
								{t("distribute")}
								<IoChevronForwardOutline />
							</button>

						</div>
					</>
				)}

				{submenu !== "" && (
					<div className="flex flex-col gap-6">
						<button
							onClick={() => setSubmenu("")}
							className="flex items-center gap-2 text-left hover:text-[#a9a9aa] transition-colors duration-300"
						>
							<IoChevronBackOutline /> {t("back")}
						</button>
						{submenu === "language" && (
							<>
								<p className="text-4xl font-bold mb-4">{t("language")}</p>
								<ul className="space-y-3">
									{[
										{ code: "en", label: "English" },
										{ code: "ru", label: "Русский" },
										{ code: "uz", label: "O'zbekcha" },
										{ code: "de", label: "Deutsch" },
										{ code: "es", label: "Español" },
										{ code: "fr", label: "Français" },
										{ code: "it", label: "Italiano" },
										{ code: "pl", label: "Polski" },
										{ code: "pt", label: "Português (Brasil)" },
										{ code: "tr", label: "Türkçe" },
									].map(({ code, label }) => {
										const currentLang = document.cookie.match(/locale=(\w{2,5})/)?.[1] || "en";
										return (
											<li
												key={code}
												onClick={() => {
													document.cookie = `locale=${code}; path=/`;
													window.location.reload();
												}}
												className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#49494d] transition-colors duration-300 cursor-pointer"
											>
												<span className="w-5 flex justify-center">
													{currentLang === code && (
														<IoCheckmark className="text-[#26bbff]" />
													)}
												</span>
												<span>{label}</span>
											</li>
										);
									})}
								</ul>
							</>
						)}
						{submenu === "distribute" && (
							<>
								<p className="text-4xl p-2 font-bold">{t("distribute")}</p>
								<ul className="space-y-3">
									{["distribute_nexus", "forum", "docs", "learning"].map((key) => (
										<li
											key={key}
											className="p-2 rounded-lg hover:bg-[#49494d] transition-colors duration-300 cursor-pointer"
										>
											{d(key)}
										</li>
									))}
								</ul>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

