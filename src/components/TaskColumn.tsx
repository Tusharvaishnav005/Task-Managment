import React, { useMemo } from 'react';
import { Task, TaskStatus } from '../types/task';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddClick: () => void;
}

const getColumnTitle = (status: TaskStatus): string => {
  switch (status) {
    case 'backlog':
      return 'Backlog';
    case 'in-progress':
      return 'In Progress';
    case 'paused':
      return 'Paused';
    case 'ready':
      return 'Ready for Launch';
    default:
      return status;
  }
};

const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  tasks,
  onTaskClick,
  onAddClick,
}) => {
  const { setNodeRef } = useDroppable({ id: status });
  
  const sortedTasks = useMemo(() => (
    [...tasks].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  ), [tasks]);

  const taskIds = useMemo(() => 
    sortedTasks.map(task => task.id),
    [sortedTasks]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-700">{getColumnTitle(status)}</h2>
        <button
          onClick={onAddClick}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <Plus size={20} />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto"
      >
        <SortableContext
          items={taskIds}
          strategy={verticalListSortingStrategy}
        >
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default React.memo(TaskColumn);