
import React, { useState } from 'react';
import { Todo } from '@/hooks/useTodos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, X, Edit2, Trash2, Save, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string, deadline?: Date, labels?: string[]) => void;
}

const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDeadline, setEditDeadline] = useState<Date | undefined>(todo.deadline);
  const [editLabels, setEditLabels] = useState<string[]>(todo.labels || []);
  const [labelInput, setLabelInput] = useState('');

  const handleEdit = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText, editDeadline, editLabels);
    }
    setIsEditing(false);
    resetEditState();
  };

  const handleCancel = () => {
    setIsEditing(false);
    resetEditState();
  };

  const resetEditState = () => {
    setEditText(todo.text);
    setEditDeadline(todo.deadline);
    setEditLabels(todo.labels || []);
    setLabelInput('');
  };

  const addLabel = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && labelInput.trim()) {
      e.preventDefault();
      if (!editLabels.includes(labelInput.trim())) {
        setEditLabels([...editLabels, labelInput.trim()]);
      }
      setLabelInput('');
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setEditLabels(editLabels.filter(label => label !== labelToRemove));
  };

  const isOverdue = todo.deadline && !todo.completed && isBefore(todo.deadline, startOfDay(new Date()));
  const isDueSoon = todo.deadline && !todo.completed && 
    isAfter(todo.deadline, new Date()) && 
    isBefore(todo.deadline, new Date(Date.now() + 24 * 60 * 60 * 1000));

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            todo.completed
              ? "bg-purple-500 border-purple-500 text-white"
              : "border-gray-300 hover:border-purple-400"
          )}
        >
          {todo.completed && <Check className="w-4 h-4" />}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="text-base"
                autoFocus
              />
              
              <div className="flex flex-wrap gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "justify-start text-left font-normal",
                        !editDeadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {editDeadline ? format(editDeadline, "dd/MM") : "Prazo"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editDeadline}
                      onSelect={setEditDeadline}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>

                <Input
                  type="text"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  onKeyDown={addLabel}
                  placeholder="Nova etiqueta (Enter)"
                  className="w-32 h-8"
                />
              </div>

              {editLabels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {editLabels.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
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
            </div>
          ) : (
            <div className="space-y-1">
              <span
                className={cn(
                  "text-base transition-all duration-200",
                  todo.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                )}
              >
                {todo.text}
              </span>
              
              <div className="flex flex-wrap gap-2 items-center">
                {todo.deadline && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded text-xs",
                      isOverdue
                        ? "bg-red-100 text-red-700"
                        : isDueSoon
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    <CalendarIcon className="w-3 h-3" />
                    {format(todo.deadline, "dd/MM/yyyy")}
                  </span>
                )}
                
                {todo.labels && todo.labels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                  >
                    <Tag className="w-3 h-3" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEdit}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(todo.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
