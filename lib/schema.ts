import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// Todos table linked to the authenticated user
export const todos = pgTable('todos', {
  id: text('id').primaryKey(), // Using text to match Neon auth user IDs if needed, or simple UUIDs
  text: text('text').notNull(),
  completed: boolean('completed').default(false).notNull(),
  userId: text('user_id').notNull(), // Neon Auth provides user_id
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Type exports
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;

