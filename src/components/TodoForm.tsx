
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface TodoFormProps {
  onAddTodo: (text: string) => void;
}

const TodoForm = ({ onAddTodo }: TodoFormProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite uma nova tarefa..."
        className="flex-1 text-lg py-6 px-4 border-2 border-gray-200 focus:border-purple-500 rounded-lg"
      />
      <Button
        type="submit"
        disabled={!text.trim()}
        className="px-6 py-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Plus className="w-5 h-5" />
      </Button>
    </form>
  );
};

export default TodoForm;
