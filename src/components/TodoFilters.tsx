
import React from 'react';
import { Button } from '@/components/ui/button';
import { FilterType } from '@/hooks/useTodos';
import { cn } from '@/lib/utils';

interface TodoFiltersProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeTodosCount: number;
  completedTodosCount: number;
  onClearCompleted: () => void;
}

const TodoFilters = ({
  filter,
  onFilterChange,
  activeTodosCount,
  completedTodosCount,
  onClearCompleted
}: TodoFiltersProps) => {
  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Todas' },
    { key: 'active', label: 'Ativas' },
    { key: 'completed', label: 'Concluídas' }
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-2">
        {filters.map(({ key, label }) => (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(key)}
            className={cn(
              "px-4 py-2 rounded-lg transition-colors",
              filter === key
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            )}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          {activeTodosCount} ativa{activeTodosCount !== 1 ? 's' : ''}
        </span>
        {completedTodosCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCompleted}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1"
          >
            Limpar concluídas
          </Button>
        )}
      </div>
    </div>
  );
};

export default TodoFilters;
