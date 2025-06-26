
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar as CalendarIcon, Tag, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TodoFormProps {
  onAddTodo: (text: string, deadline?: Date, labels?: string[], priority?: 'low' | 'medium' | 'high') => void;
}

const TodoForm = ({ onAddTodo }: TodoFormProps) => {
  const [text, setText] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [labelInput, setLabelInput] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(text, deadline, labels, priority);
      setText('');
      setDeadline(undefined);
      setLabels([]);
      setLabelInput('');
      setPriority('medium');
    }
  };

  const addLabel = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && labelInput.trim()) {
      e.preventDefault();
      if (!labels.includes(labelInput.trim())) {
        setLabels([...labels, labelInput.trim()]);
      }
      setLabelInput('');
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter(label => label !== labelToRemove));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
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
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Priority Selector */}
        <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
          <SelectTrigger className="w-40">
            <Flag className={cn("mr-2 h-4 w-4", getPriorityColor(priority))} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-red-600" />
                Alta
              </div>
            </SelectItem>
            <SelectItem value="medium">
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-yellow-600" />
                Média
              </div>
            </SelectItem>
            <SelectItem value="low">
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-green-600" />
                Baixa
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Deadline Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !deadline && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {deadline ? format(deadline, "PPP") : "Adicionar prazo"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={deadline}
              onSelect={setDeadline}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        {/* Label Input */}
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-purple-600" />
          <Input
            type="text"
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            onKeyDown={addLabel}
            placeholder="Adicionar etiqueta (Enter)"
            className="w-48"
          />
        </div>
      </div>

      {/* Display Labels */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              {label}
              <button
                type="button"
                onClick={() => removeLabel(label)}
                className="hover:text-purple-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Clear Deadline Button */}
      {deadline && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setDeadline(undefined)}
          className="text-sm"
        >
          Remover prazo
        </Button>
      )}
    </form>
  );
};

export default TodoForm;
