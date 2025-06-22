"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FaArrowLeftLong } from "react-icons/fa6"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface User {
    id: string
    name: string | null
    email: string | null
    role: "USER" | "ADMIN"
    status: "active" | "inactive" | "blocked"
    createdAt: string
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        fetch("/api/users")
            .then((res) => res.json())
            .then(setUsers)
    }, [])

    const toggleStatus = async (user: User) => {
        const newStatus = user.status === "blocked" ? "active" : "blocked"

        const res = await fetch(`/api/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        })

        if (res.ok) {
            const updated = await res.json()
            setUsers((prev) =>
                prev.map((u) => (u.id === updated.id ? updated : u))
            )
        } else {
            alert("Ошибка при обновлении статуса")
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-white mb-4">
                <FaArrowLeftLong /> Назад
            </Link>

            <h1 className="text-2xl font-bold mb-6 text-white">Управление пользователями</h1>

            <div className="rounded border border-neutral-800 bg-[#1a1a1a] overflow-x-auto shadow mt-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-white">Имя</TableHead>
                            <TableHead className="text-white">Email</TableHead>
                            <TableHead className="text-white">Роль</TableHead>
                            <TableHead className="text-white">Статус</TableHead>
                            <TableHead className="text-center text-white">Блокировка</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => {
                            const isBlocked = user.status === "blocked"
                            return (
                                <TableRow key={user.id} className="hover:bg-[#2a2a2a]">
                                    <TableCell className="text-white">{user.name}</TableCell>
                                    <TableCell className="text-white">{user.email}</TableCell>
                                    <TableCell className="text-white">{user.role}</TableCell>
                                    <TableCell>
                                        <span className={
                                            isBlocked
                                                ? "bg-red-100 text-red-700 border border-red-400 px-2 py-0.5 rounded-full text-xs"
                                                : "bg-green-500 text-white px-2 py-0.5 rounded-full text-xs"
                                        }>
                                            {user.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    className={
                                                        isBlocked
                                                            ? "border-green-500 text-green-400"
                                                            : "border-red-500 text-red-400"
                                                        }
                                                        >
                                                    {isBlocked ? "Разблокировать" : "Заблокировать"}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-[#1a1a1a] text-white border border-neutral-800">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        {isBlocked ? "Разблокировать пользователя?" : "Заблокировать пользователя?"}
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-gray-400">
                                                        Это действие изменит статус пользователя{" "}
                                                        <strong>{user.name || user.email}</strong> на{" "}
                                                        <strong>{isBlocked ? "active" : "blocked"}</strong>.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Отмена</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-blue-600 hover:bg-blue-500 text-white"
                                                        onClick={async () => {
                                                            const newStatus = isBlocked ? "active" : "blocked"
                                                            const res = await fetch(`/api/users/${user.id}`, {
                                                                method: "PUT",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({ status: newStatus }),
                                                            })

                                                            if (res.ok) {
                                                                const updated = await res.json()
                                                                setUsers((prev) =>
                                                                    prev.map((u) => (u.id === updated.id ? updated : u))
                                                                )
                                                            } else {
                                                                alert("Ошибка при обновлении")
                                                            }
                                                        }}
                                                    >
                                                        Подтвердить
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
