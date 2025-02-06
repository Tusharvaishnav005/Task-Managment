import React, { useMemo, useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Task, Member } from '../types/task';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineDashboardProps {
  tasks: Task[];
  members: Map<string, Member>;
}

const TimelineDashboard: React.FC<TimelineDashboardProps> = ({ tasks, members }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  
  const startDate = useMemo(() => {
    const base = startOfWeek(new Date());
    return addDays(base, weekOffset * 7);
  }, [weekOffset]);
  
  const dates = useMemo(() => 
    Array.from({ length: 10 }, (_, i) => addDays(startDate, i)),
    [startDate]
  );

  const tasksByMember = useMemo(() => {
    const grouped = new Map<string, Task[]>();
    Array.from(members.keys()).forEach(memberId => {
      grouped.set(memberId, tasks.filter(task => task.member === memberId));
    });
    return grouped;
  }, [tasks, members]);

  const getTaskPosition = (task: Task) => {
    if (!task.startDate || !task.endDate) return null;
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);
    const startIndex = dates.findIndex(date => isSameDay(date, start));
    const endIndex = dates.findIndex(date => isSameDay(date, end));
    if (startIndex === -1 || endIndex === -1) return null;
    return {
      gridColumnStart: startIndex + 2,
      gridColumnEnd: endIndex + 3,
    };
  };

  const getTaskColorClass = (task: Task) => {
    switch (task.color) {
      case 'yellow': return 'bg-amber-100 border-amber-200';
      case 'blue': return 'bg-blue-100 border-blue-200';
      case 'purple': return 'bg-purple-100 border-purple-200';
      case 'green': return 'bg-green-100 border-green-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Timeline</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setWeekOffset(prev => prev + 1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <select className="border rounded-md px-3 py-1.5 text-sm">
            <option>Group by: Member</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-[150px_repeat(10,minmax(100px,1fr))] sm:grid-cols-[200px_repeat(10,1fr)] gap-4 min-w-[1100px]">
          {/* Header */}
          <div className="font-medium text-gray-500">Member</div>
          {dates.map((date, i) => (
            <div key={i} className="text-sm text-gray-500 text-center">
              <div className="hidden sm:block">{format(date, 'EEE d')}</div>
              <div className="sm:hidden">{format(date, 'd')}</div>
            </div>
          ))}

          {/* Timeline rows */}
          {Array.from(members.values()).map((member) => (
            <React.Fragment key={member.id}>
              <div className="flex items-center gap-2 sm:gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                />
                <span className="text-sm font-medium truncate">{member.name}</span>
              </div>
              <div className="col-span-10 relative grid grid-cols-10 gap-4 min-h-[60px]">
                {tasksByMember.get(member.id)?.map((task) => {
                  const position = getTaskPosition(task);
                  if (!position) return null;
                  
                  return (
                    <div
                      key={task.id}
                      className={`absolute rounded-md border px-2 sm:px-3 py-1 text-xs sm:text-sm ${getTaskColorClass(task)}`}
                      style={{
                        gridColumn: `${position.gridColumnStart} / ${position.gridColumnEnd}`,
                        top: '0.5rem',
                        height: 'calc(100% - 1rem)',
                      }}
                    >
                      <div className="flex items-center gap-1 sm:gap-2 overflow-hidden">
                        <CheckCircle size={14} className="text-gray-500 flex-shrink-0" />
                        <span className="truncate">{task.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(TimelineDashboard);