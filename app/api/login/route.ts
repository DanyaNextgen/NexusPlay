import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
	const { email, password, name } = await req.json();

	if (!email || !password) {
		return NextResponse.json({ error: "Email and password required" }, { status: 400 });
	}

	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		return NextResponse.json({ error: "User already exists" }, { status: 400 });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: {
			email,
			name,
			password: hashedPassword,
			role: "USER",
			image: null,
		},
	});

	return NextResponse.json({ user });
}

