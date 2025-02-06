import React, { useMemo } from 'react';
import { Task } from '../types/task';
import { format } from 'date-fns';
import { Calendar, Users } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
  }), [transform, transition]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg shadow-sm p-4 mb-2 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span>{task.assignees.length} assignee(s)</span>
        </div>
        
        {task.startDate && (
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{format(new Date(task.startDate), 'MMM d')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TaskCard);