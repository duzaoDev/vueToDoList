
import { useState, useEffect } from 'react';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  deadline?: Date;
  labels: string[];
  priority: 'low' | 'medium' | 'high';
}

export type FilterType = 'all' | 'active' | 'completed';

const STORAGE_KEY = 'todos-app';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  // Carregar todos do localStorage na inicialização
  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          deadline: todo.deadline ? new Date(todo.deadline) : undefined,
          priority: todo.priority || 'medium' // Default for existing todos
        }));
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Erro ao carregar todos do localStorage:', error);
      }
    }
  }, []);

  // Salvar todos no localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, deadline?: Date, labels: string[] = [], priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (text.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        createdAt: new Date(),
        deadline,
        labels,
        priority
      };
      setTodos(prev => [newTodo, ...prev]);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const editTodo = (id: string, newText: string, deadline?: Date, labels: string[] = [], priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (newText.trim()) {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, text: newText.trim(), deadline, labels, priority } : todo
        )
      );
    }
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  const sortTodos = (todos: Todo[]) => {
    return todos.sort((a, b) => {
      // First sort by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Then by priority (high > medium > low)
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by deadline (sooner dates first)
      if (a.deadline && b.deadline) {
        return a.deadline.getTime() - b.deadline.getTime();
      }
      if (a.deadline && !b.deadline) return -1;
      if (!a.deadline && b.deadline) return 1;

      // Finally by creation date (newer first)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  };

  const filteredTodos = sortTodos(todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  }));

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return {
    todos,
    filter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setFilter,
    clearCompleted,
    filteredTodos,
    activeTodosCount,
    completedTodosCount
  };
};
