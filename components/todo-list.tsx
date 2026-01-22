'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Todo } from '@/lib/schema';

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load todos",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodoText.trim() || isAdding) return;

    setIsAdding(true);
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodoText }),
      });
      if (!res.ok) throw new Error('Failed to add todo');
      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
      setNewTodoText('');
      toast({
        title: "Success",
        description: "Todo added",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add todo",
      });
    } finally {
      setIsAdding(false);
    }
  }

  async function toggleTodo(id: string, completed: boolean) {
    try {
      const res = await fetch('/api/todos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: !completed }),
      });
      if (!res.ok) throw new Error('Failed to update todo');
      const updated = await res.json();
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update todo",
      });
    }
  }

  async function deleteTodo(id: string) {
    try {
      const res = await fetch(`/api/todos?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete todo');
      setTodos(todos.filter((t) => t.id !== id));
      toast({
        title: "Success",
        description: "Todo deleted",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete todo",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-xl shadow-lg border">
      <h2 className="text-2xl font-bold mb-6 text-foreground">My Tasks</h2>
      
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <Input
          placeholder="What needs to be done?"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isAdding}>
          {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          <span className="ml-2 hidden sm:inline">Add</span>
        </Button>
      </form>

      <div className="space-y-3">
        {todos.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No tasks yet. Add one above!</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`text-sm font-medium leading-none cursor-pointer ${
                    todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  {todo.text}
                </label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

