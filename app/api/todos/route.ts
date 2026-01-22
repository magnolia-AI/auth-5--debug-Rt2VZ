import { authServer } from '@/lib/auth/server'
import db from '@/lib/db'
import { todos } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data: sessionData, error: sessionError } = await authServer.getSession()
    if (sessionError || !sessionData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, sessionData.user.id))
      .orderBy(todos.createdAt)

    return NextResponse.json(userTodos)
  } catch (error) {
    console.error('Fetch todos error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { data: sessionData, error: sessionError } = await authServer.getSession()
    if (sessionError || !sessionData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { text } = await request.json()
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const newTodo = await db
      .insert(todos)
      .values({
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        text,
        userId: sessionData.user.id,
      })
      .returning()

    return NextResponse.json(newTodo[0], { status: 201 })
  } catch (error) {
    console.error('Create todo error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { data: sessionData, error: sessionError } = await authServer.getSession()
    if (sessionError || !sessionData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, completed } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const updatedTodo = await db
      .update(todos)
      .set({ completed, updatedAt: new Date() })
      .where(and(eq(todos.id, id), eq(todos.userId, sessionData.user.id)))
      .returning()

    if (updatedTodo.length === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    return NextResponse.json(updatedTodo[0])
  } catch (error) {
    console.error('Update todo error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { data: sessionData, error: sessionError } = await authServer.getSession()
    if (sessionError || !sessionData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, sessionData.user.id)))

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete todo error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

