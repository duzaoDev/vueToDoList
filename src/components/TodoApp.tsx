
import React from 'react';
import { useTodos } from '@/hooks/useTodos';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoFilters from './TodoFilters';
import { CheckCircle2 } from 'lucide-react';

const TodoApp = () => {
  const {
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
  } = useTodos();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <CheckCircle2 className="w-10 h-10 text-purple-600" />
          <h1 className="text-4xl font-bold text-gray-800">Todo App</h1>
        </div>
        <p className="text-gray-600">Organize suas tarefas de forma simples e eficiente</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <TodoForm onAddTodo={addTodo} />
        </div>

        <div className="p-6">
          <TodoFilters
            filter={filter}
            onFilterChange={setFilter}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            onClearCompleted={clearCompleted}
          />
        </div>

        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />

        {todos.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Nenhuma tarefa ainda</p>
            <p className="text-sm">Adicione sua primeira tarefa acima</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
