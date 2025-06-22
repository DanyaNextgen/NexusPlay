"use client";

import Link from "next/link";
import { FaBoxArchive } from "react-icons/fa6";
import { FaClipboardList } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function AdminDashboard() {
    return (
        <div className="p-6 text-white">
            <Link href="/" className="flex items-center gap-2 text-white mb-4">
                <FaArrowLeftLong /> Назад
            </Link>
            <h1 className="text-2xl font-bold mb-6">Админ-панель</h1>

            <ul className="space-y-4">
                <li>
                    <Link
                        href="/admin/products"
                        className="flex gap-2 items-center text-blue-500 text-lg"
                    >
                        <FaBoxArchive /> Управление товарами
                    </Link>
                </li>
                <li>
                    <Link
                        href="/admin/orders"
                        className="flex gap-2 items-center text-blue-500 text-lg"
                    >
                        <FaClipboardList /> Управление заказами
                    </Link>
                </li>
                <li>
                    <Link
                        href="/admin/users"
                        className="flex gap-2 items-center text-blue-500 text-lg"
                    >
                        <FaRegUser />
                        Управление пользователями
                    </Link>
                </li>
            </ul>
        </div>
    );
}



