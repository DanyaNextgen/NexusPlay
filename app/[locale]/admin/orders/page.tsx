"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Order {
    id: string;
    status: string;
    createdAt: string;
    user: {
        email: string | null;
    };
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
    const [newStatus, setNewStatus] = useState<string>("");

    useEffect(() => {
        fetch("/api/orders")
            .then(res => res.json())
            .then(setOrders);
    }, []);

    const updateStatus = async () => {
        if (!editingOrderId || !newStatus) return;

        const res = await fetch(`/api/orders/${editingOrderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });

        if (res.ok) {
            const updated = await res.json();
            setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
            setEditingOrderId(null);
        } else {
            alert("Ошибка при обновлении статуса");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-white mb-4">
                <FaArrowLeftLong /> Назад
            </Link>

            <h1 className="text-2xl font-bold mb-6 text-white">Управление заказами</h1>

            <div className="rounded border border-neutral-800 bg-[#1a1a1a] overflow-x-auto shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-white">ID</TableHead>
                            <TableHead className="text-white">Email</TableHead>
                            <TableHead className="text-white">Статус</TableHead>
                            <TableHead className="text-center text-white">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id} className="hover:bg-[#2a2a2a]">
                                <TableCell className="text-white">{order.id.slice(0, 8)}...</TableCell>
                                <TableCell className="text-white">{order.user?.email ?? "—"}</TableCell>
                                <TableCell className="capitalize text-white">{order.status}</TableCell>
                                <TableCell>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                onClick={() => {
                                                    setEditingOrderId(order.id);
                                                    setNewStatus(order.status);
                                                }}
                                                className="text-black bg-white hover:text-white border-white"
                                            >
                                                Изменить статус
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-[#1a1a1a] text-white border border-neutral-800">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Изменить статус заказа</AlertDialogTitle>
                                                <AlertDialogDescription className="text-gray-400">
                                                    Выберите новый статус для заказа:
                                                </AlertDialogDescription>
                                                <select
                                                    className="w-full border border-neutral-700 bg-[#2a2a2a] text-white rounded p-2 mt-4"
                                                    value={newStatus}
                                                    onChange={e => setNewStatus(e.target.value)}
                                                >
                                                    <option value="new">новый</option>
                                                    <option value="processed">обработан</option>
                                                    <option value="completed">выполнен</option>
                                                </select>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Отмена</AlertDialogCancel>
                                                <AlertDialogAction className="bg-blue-600 hover:bg-blue-500 text-white" onClick={updateStatus}>
                                                    Сохранить
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
