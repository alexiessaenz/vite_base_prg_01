import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLoginMutation } from '@/auth/hooks/useAuthQueries'

interface LoginFormProps {
  variant?: 'glass' | 'normal'
}

export function LoginForm({ variant = 'glass' }: LoginFormProps) {
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
    //   await loginMutation.mutateAsync({ email, password }) TODO: Cambiar a mutateAsync para manejar errores correctamente
      // Redirige al dashboard después de login exitoso
      navigate('/')
    } catch (err) {
      // El error se maneja en la mutation y se muestra aquí
      console.error('Login failed:', err)
    }
  }

  // Extraer mensaje de error desde axios o de la mutation
  let errorMessage = ''
  if (loginMutation.error) {
    const error = loginMutation.error
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión'
    } else if (error instanceof Error) {
      errorMessage = error.message
    } else {
      errorMessage = 'Error al iniciar sesión'
    }
  }

  const isLoading = loginMutation.isPending

  const cardClassName =
    variant === 'glass'
      ? 'w-full max-w-sm dark:bg-slate-950/40 dark:border-slate-800/50 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl'
      : 'w-full max-w-sm dark:bg-slate-950 dark:border-slate-800'

  return (
    <Card className={cardClassName}>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
        <CardAction>
          <Button variant="link" disabled={isLoading}>
            Sign Up
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            {errorMessage && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                {errorMessage}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Login'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Sign up
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
