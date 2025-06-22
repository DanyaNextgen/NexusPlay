"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { FaGoogle, FaGithub } from 'react-icons/fa'

export default function SignInPage() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		const res = await signIn('credentials', {
			email,
			password,
			redirect: false,
		})

		if (res?.error) {
			setError('Неверный логин или пароль')
			setLoading(false)
			return
		}

		router.push('/')
	}

	const handleOAuth = async (provider: 'google' | 'github') => {
		await signIn(provider, { callbackUrl: '/' })
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
			<div className="bg-neutral-800 text-white p-6 rounded-lg w-full max-w-md space-y-6">
				<h2 className="text-2xl font-bold text-center">Войти в NexusPlay</h2>

				<form onSubmit={handleLogin} className="space-y-4">
					{error && <p className="text-red-500 text-center">{error}</p>}
					<input
						type="email"
						placeholder="Электронная почта"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full p-2 rounded bg-neutral-700 text-white placeholder-neutral-400"
					/>
					<input
						type="password"
						placeholder="Пароль"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="w-full p-2 rounded bg-neutral-700 text-white placeholder-neutral-400"
					/>
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
					>
						{loading ? 'Вход...' : 'Войти'}
					</button>
				</form>

				<p className="text-center text-sm text-neutral-400">или войдите с помощью</p>

				<div className="space-y-2">
					<button
						onClick={() => handleOAuth('google')}
						className="w-full flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-600 py-2 rounded"
					>
						<FaGoogle /> Войти через Google
					</button>
					<button
						onClick={() => handleOAuth('github')}
						className="w-full flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-600 py-2 rounded"
					>
						<FaGithub /> Войти через GitHub
					</button>
				</div>

				<p className="text-sm text-center mt-4">
					Нет аккаунта?{' '}
					<a href="/auth/login" className="text-blue-400 hover:underline">
						Зарегистрироваться
					</a>
				</p>
			</div>
		</div>
	)
}

