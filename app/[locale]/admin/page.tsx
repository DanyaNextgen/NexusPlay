'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        })

        if (res?.ok) {
            router.push('/admin/dashboard')
        } else {
            setError('Invalid email or password')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
            <div className="bg-neutral-800 text-white p-6 rounded-lg w-full max-w-md space-y-6">
                <h2 className="text-2xl font-bold text-center">Admin Panel Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 rounded bg-neutral-700 text-white placeholder-neutral-400"
                    />
                    <input
                        type="password"
                        placeholder="Password"
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}

