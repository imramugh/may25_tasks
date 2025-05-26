'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'
import { Field, FieldGroup, Fieldset, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Text } from '@/components/text'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (error) {
      setError('Invalid email or password. Please try again.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Heading className="text-3xl font-bold">Sign in to Tasks AI</Heading>
          <Text className="mt-2 text-zinc-600 dark:text-zinc-400">
            Enter your credentials to access your account
          </Text>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Fieldset>
            <FieldGroup>
              <Field>
                <Label>Email address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.chen@example.com"
                  required
                  disabled={isLoading}
                />
              </Field>
              
              <Field>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </Field>
            </FieldGroup>
          </Fieldset>

          {error && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-950/50">
              <Text className="text-sm text-red-800 dark:text-red-200">
                {error}
              </Text>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Text className="text-sm text-zinc-600 dark:text-zinc-400">
            Test credentials:
          </Text>
          <Text className="text-sm text-zinc-800 dark:text-zinc-200 font-mono mt-1">
            sarah.chen@example.com / password123
          </Text>
        </div>
      </div>
    </div>
  )
} 