"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { UploadButton } from "@/lib/uploadthing";
import { MdCloudUpload } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";


const GENRES = [
	{ id: "survival", name: "Выживание" },
	{ id: "open_world", name: "Открытый мир" },
	{ id: "adventure", name: "Приключение" },
	{ id: "fighting", name: "Файтинг" },
	{ id: "fantasy", name: "Фэнтези" },
	{ id: "shooter", name: "Шутер" },
	{ id: "action", name: "Экшен" },
	{ id: "exploration", name: "Исследование" },
];

export default function NewProductPage() {
	const router = useRouter();
	const [image, setImage] = useState("");
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [isFree, setIsFree] = useState(false);

	const handleGenreToggle = (id: string) => {
		setSelectedGenres((prev) =>
			prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
		);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const title = formData.get("name") as string;
		const description = formData.get("description") as string;
		const imageUrl = image;
		const rawPrice = formData.get("price") as string;
		const finalPrice = isFree ? 0 : parseFloat(rawPrice);

		const res = await fetch("/api/products", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title,
				description,
				price: finalPrice,
				imageUrl,
				categoryIds: selectedGenres,
			}),
		});

		if (res.ok) {
			toast({
				title: "Товар добавлен",
				description: "Вы будете перенаправлены в панель управления.",
			});
			router.push("/admin/products"); 
		} else {
			toast({
				title: "Ошибка",
				description: "Не удалось добавить товар.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="max-w-xl mx-auto p-4">
			<Link
				href="/admin/dashboard"
				className="flex items-center gap-2 text-white mb-4"
			>
				<FaArrowLeftLong /> Назад
			</Link>

			<h1 className="text-2xl font-bold mb-6 text-white">Добавить игру</h1>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block font-semibold mb-1 text-white">Название</label>
					<input name="name" required className="w-full border p-2 rounded" />
				</div>

				<div>
					<label className="block font-semibold mb-1 text-white">Описание</label>
					<textarea
						name="description"
						rows={3}
						required
						className="w-full border p-2 rounded"
					/>
				</div>

				<div>
					<label className="flex items-center gap-2 text-white mb-1">
						Бесплатно
						<Switch checked={isFree} onCheckedChange={setIsFree} />
					</label>
					{!isFree && (
						<input
							name="price"
							type="text"
							placeholder="Цена"
							className="w-full border p-2 rounded"
							required
						/>
					)}
				</div>

				<div>
					<label className="block font-semibold mb-1 text-white">Жанры</label>
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline" className="w-full justify-start">
								{selectedGenres.length > 0
									? GENRES.filter((g) => selectedGenres.includes(g.id))
										.map((g) => g.name)
										.join(", ")
									: "Выберите жанры"}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[300px]">
							<div className="grid gap-2">
								{GENRES.map((genre) => (
									<label key={genre.id} className="flex items-center gap-2">
										<Checkbox
											checked={selectedGenres.includes(genre.id)}
											onCheckedChange={() => handleGenreToggle(genre.id)}
										/>
										<span>{genre.name}</span>
									</label>
								))}
							</div>
						</PopoverContent>
					</Popover>
				</div>

				<div className="space-y-2">
					<label className="block font-semibold text-white">Картинка</label>
					<div className="border-2 border-dashed border-gray-300 p-6 rounded flex flex-col items-center text-center space-y-3">
						{image ? (
							<>
								<img
									src={image}
									alt="Загруженное изображение"
									className="w-full max-h-[250px] object-contain rounded"
								/>
								<button
									type="button"
									onClick={() => setImage("")}
									className="text-blue-600 underline text-sm"
								>
									Загрузить другую
								</button>
							</>
						) : (
							<>
								<MdCloudUpload className="text-4xl text-gray-400" />
								<p className="text-sm text-gray-600">Выберите файл</p>

								<UploadButton
									endpoint="imageUploader"
									onClientUploadComplete={(res) => {
										const url = res?.[0]?.url;
										if (url) {
											setImage(url);
											toast({
												title: "Изображение загружено",
												description: "Файл успешно загружен.",
											});
										}
									}}
									onUploadError={(err) => {
										toast({
											title: "Ошибка загрузки",
											description: err.message,
											variant: "destructive",
										});
									}}
								/>
							</>
						)}
					</div>
				</div>

				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
				>
					Добавить игру
				</button>
			</form>
		</div>
	);
}
