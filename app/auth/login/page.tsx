// 'use client'

// import { useState } from 'react'
// import { signIn } from 'next-auth/react'
// import { useRouter } from 'next/navigation'

// export default function LoginPage() {
//     const router = useRouter()
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [error, setError] = useState('')

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()

//         const res = await signIn('credentials', {
//             redirect: false,
//             email,
//             password,
//         })

//         if (res?.error) {
//             setError(res.error)
//         } else {
//             router.push('/') // переход на главную
//         }
//     }

//     return (
//         <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
//             <h2 className="text-2xl font-bold">Login</h2>
//             {error && <p className="text-red-500">{error}</p>}
//             <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full p-2 border rounded"
//                 required
//             />
//             <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full p-2 border rounded"
//                 required
//             />
//             <button type="submit" className="w-full bg-black text-white py-2 rounded">
//                 Login
//             </button>
//         </form>
//     )
// }
// 'use client'

// import { useState } from 'react'
// import { signIn } from 'next-auth/react'
// import { useRouter } from 'next/navigation'

// export default function LoginPage() {
//     const router = useRouter()
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [error, setError] = useState('')

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()

//         const res = await signIn('credentials', {
//             redirect: false,
//             email,
//             password,
//         })

//         if (res?.error) {
//             setError(res.error)
//         } else {
//             router.push('/')
//         }
//     }

//     const handleOAuthSignIn = async (provider: 'google' | 'github') => {
//         await signIn(provider, { callbackUrl: '/' }) // редирект на главную
//     }

//     return (
//         <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
//             <h2 className="text-2xl font-bold">Login</h2>
//             {error && <p className="text-red-500">{error}</p>}

//             <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full p-2 border rounded"
//                 required
//             />
//             <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full p-2 border rounded"
//                 required
//             />
//             <button type="submit" className="w-full bg-black text-white py-2 rounded">
//                 Login
//             </button>

//             <div className="flex items-center justify-center gap-4 mt-4">
//                 <button
//                     type="button"
//                     onClick={() => handleOAuthSignIn('google')}
//                     className="w-full bg-red-600 text-white py-2 rounded"
//                 >
//                     Sign in with Google
//                 </button>
//                 <button
//                     type="button"
//                     onClick={() => handleOAuthSignIn('github')}
//                     className="w-full bg-gray-800 text-white py-2 rounded"
//                 >
//                     Sign in with GitHub
//                 </button>
//             </div>
//         </form>
//     )
// }
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { FaGoogle, FaGithub } from 'react-icons/fa'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.error || 'Ошибка регистрации')
            setLoading(false)
            return
        }

        await signIn('credentials', {
            email,
            password,
            redirect: false,
        })

        router.push('/')
    }

    const handleOAuth = async (provider: 'google' | 'github') => {
        await signIn(provider, { callbackUrl: '/' })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
            <div className="bg-neutral-800 text-white p-6 rounded-lg w-full max-w-md space-y-6">
                <h2 className="text-2xl font-bold text-center">Зарегистрироваться в NexusPlay</h2>

                <form onSubmit={handleRegister} className="space-y-4">
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
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <p className="text-center text-sm text-neutral-400">или зарегистрируйтесь с помощью</p>

                <div className="space-y-2">
                    <button
                        onClick={() => handleOAuth('google')}
                        className="w-full flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-600 py-2 rounded"
                    >
                        <FaGoogle /> Google
                    </button>
                    <button
                        onClick={() => handleOAuth('github')}
                        className="w-full flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-600 py-2 rounded"
                    >
                        <FaGithub /> GitHub
                    </button>
                </div>

                <p className="text-sm text-center mt-4">
                    Уже есть аккаунт?{' '}
                    <a href="/auth/signin" className="text-blue-400 hover:underline">
                        Войти
                    </a>
                </p>
            </div>
        </div>
    )
}

