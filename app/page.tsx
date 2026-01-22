'use client'

import { TodoList } from '@/components/todo-list'
import { authClient } from '@/lib/auth/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
      {session ? (
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {session.user.name}!</h1>
            <p className="text-muted-foreground">Manage your daily tasks efficiently.</p>
          </div>
          <TodoList />
        </div>
      ) : (
        <div className="max-w-[800px] mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl">
              Organize your work <br />
              <span className="text-primary">and life, finally.</span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-[600px] mx-auto">
              Become focused, organized, and calm with our simple todo app. 
              Sign up today to start managing your tasks.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Secure</h3>
              <p className="text-muted-foreground">Your tasks are private and stored securely in the cloud.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Simple</h3>
              <p className="text-muted-foreground">Clean interface designed for maximum productivity.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Sync</h3>
              <p className="text-muted-foreground">Access your todos from any device, anywhere.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

