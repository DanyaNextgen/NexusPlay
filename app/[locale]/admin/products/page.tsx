"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeftLong, FaTrash } from "react-icons/fa6";
import { MdEdit, MdExpandMore } from "react-icons/md";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    createdAt: string;
    categories: Category[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [expandedDescriptions, setExpandedDescriptions] = useState<string[]>([]);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    useEffect(() => {
        async function loadData() {
            const [productsRes, categoriesRes] = await Promise.all([
                fetch("/api/products"),
                fetch("/api/categories")
            ]);
            const [productsData, categoriesData] = await Promise.all([
                productsRes.json(),
                categoriesRes.json()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        }

        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/products/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } else {
            alert("Ошибка при удалении");
        }
    };

    const toggleDescription = (id: string) => {
        setExpandedDescriptions((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-white mb-4">
                <FaArrowLeftLong /> Назад
            </Link>

            <h1 className="text-2xl font-bold mb-4 text-white">Управление товарами</h1>

            <div className="flex justify-between items-center mb-4">
                <Link href="/admin/dashboard/new">
                    <Button className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300">Добавить игру</Button>
                </Link>
                <p className="text-white">Всего игр: {products.length}</p>
            </div>

            <div className="rounded border border-neutral-800 bg-[#1a1a1a] overflow-x-auto shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/4 text-white">Название</TableHead>
                            <TableHead className="w-1/2 text-white">Описание</TableHead>
                            <TableHead className="text-white">Категории</TableHead>
                            <TableHead className="w-24 text-white">Цена</TableHead>
                            <TableHead className="w-32 text-center text-white">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => {
                            const isExpanded = expandedDescriptions.includes(product.id);
                            return (
                                <TableRow key={product.id} className="hover:bg-[#2a2a2a]">
                                    <TableCell className="text-white">{product.name}</TableCell>
                                    <TableCell className="text-white">
                                        <div className="relative">
                                            <p className={`text-sm ${isExpanded ? "" : "line-clamp-2"}`}>
                                                {product.description}
                                            </p>
                                            {product.description.length > 100 && (
                                                <button
                                                    type="button"
                                                    className="text-xs text-blue-400 mt-1 flex items-center gap-1"
                                                    onClick={() => toggleDescription(product.id)}
                                                >
                                                    {isExpanded ? "Скрыть" : "Показать всё"}
                                                    <MdExpandMore className="text-lg" />
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {product.categories?.map((cat) => (
                                                <span
                                                    key={cat.id}
                                                    className="text-xs bg-gray-700 text-white rounded px-2 py-0.5"
                                                >
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-white">
                                        {product.price.toFixed(2)} $
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => {
                                                    const fullProduct = products.find((p) => p.id === product.id);
                                                    if (fullProduct) setEditingProduct(fullProduct);
                                                }}
                                                className="text-blue-400 hover:text-blue-600 transition-colors duration-300"
                                            >
                                                <MdEdit size={18} />
                                            </button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button
                                                        onClick={() => setProductToDelete(product)}
                                                        className="text-red-500 hover:text-red-700 transition-colors duration-300"
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="bg-[#1a1a1a] text-white border border-neutral-800">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-gray-400">
                                                            Это действие нельзя отменить. Товар <b>{productToDelete?.name}</b> будет удалён навсегда.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Отмена</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => {
                                                                if (productToDelete) {
                                                                    handleDelete(productToDelete.id);
                                                                    setProductToDelete(null);
                                                                }
                                                            }}
                                                            className="bg-red-600 hover:bg-red-500 text-white"
                                                        >
                                                            Удалить
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Редактировать товар</DialogTitle>
                    </DialogHeader>

                    {editingProduct && (
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const categoryIds = formData.getAll("categoryIds") as string[];

                                const updatedProduct = {
                                    id: editingProduct.id,
                                    name: formData.get("name") as string,
                                    description: formData.get("description") as string,
                                    price: parseFloat(formData.get("price") as string),
                                    categoryIds,
                                };

                                const res = await fetch(`/api/products/${editingProduct.id}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(updatedProduct),
                                });

                                if (res.ok) {
                                    const updated = await res.json();
                                    setProducts((prev) =>
                                        prev.map((p) => (p.id === updated.id ? updated : p))
                                    );
                                    setEditingProduct(null);
                                } else {
                                    alert("Ошибка при обновлении товара");
                                }
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block font-medium mb-1">Название</label>
                                <input
                                    name="name"
                                    defaultValue={editingProduct.name}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Описание</label>
                                <textarea
                                    name="description"
                                    defaultValue={editingProduct.description}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Цена</label>
                                <input
                                    name="price"
                                    type="text"
                                    defaultValue={editingProduct.price.toFixed(2)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Категории</label>
                                <select
                                    name="categoryIds"
                                    multiple
                                    defaultValue={editingProduct?.categories?.map((c) => c.id) || []}
                                    className="w-full border rounded p-2 h-32"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" className="w-full">Сохранить</Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
