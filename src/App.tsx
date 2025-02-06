import React, { useState, useCallback, useMemo } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import useTaskStore from './store/useTaskStore';
import TaskColumn from './components/TaskColumn';
import TaskModal from './components/TaskModal';
import TimelineDashboard from './components/TimelineDashboard';
import { Task, TaskStatus } from './types/task';
import { Search, LayoutGrid, Calendar, Menu } from 'lucide-react';

const COLUMNS: TaskStatus[] = ['backlog', 'in-progress', 'paused', 'ready'];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'board' | 'timeline'>('board');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { tasks, members, addTask, updateTask, moveTask } = useTaskStore();

  const filteredTasks = useMemo(() => {
    const tasksArray = Array.from(tasks.values());
    if (!searchTerm) return tasksArray;
    
    return tasksArray.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      'backlog': [],
      'in-progress': [],
      'paused': [],
      'ready': [],
    };

    filteredTasks.forEach(task => {
      groups[task.status].push(task);
    });

    return groups;
  }, [filteredTasks]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeTask = Array.from(tasks.values()).find(t => t.id === active.id);
      if (activeTask) {
        moveTask(activeTask.id, over.id as TaskStatus);
      }
    }
  }, [tasks, moveTask]);

  const handleTaskSubmit = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTask) {
      updateTask(selectedTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setSelectedTask(null);
    setIsModalOpen(false);
  }, [selectedTask, updateTask, addTask]);

  const handleAddClick = useCallback(() => {
    setSelectedTask(null);
    setIsModalOpen(true);
  }, []);

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Task Manager</h1>
                <div className="hidden sm:flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
                  <button
                    onClick={() => setView('board')}
                    className={`p-2 rounded ${view === 'board' ? 'bg-gray-100' : ''}`}
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button
                    onClick={() => setView('timeline')}
                    className={`p-2 rounded ${view === 'timeline' ? 'bg-gray-100' : ''}`}
                  >
                    <Calendar size={20} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={24} />
              </button>
            </div>
            
            {/* Mobile Menu */}
            <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={() => {
                      setView('board');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 p-2 rounded text-center ${view === 'board' ? 'bg-white shadow-sm' : ''}`}
                  >
                    Board View
                  </button>
                  <button
                    onClick={() => {
                      setView('timeline');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 p-2 rounded text-center ${view === 'timeline' ? 'bg-white shadow-sm' : ''}`}
                  >
                    Timeline View
                  </button>
                </div>
              </div>
            </div>

            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'board' ? (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COLUMNS.map((status) => (
                <TaskColumn
                  key={status}
                  status={status}
                  tasks={groupedTasks[status]}
                  onTaskClick={handleTaskClick}
                  onAddClick={handleAddClick}
                />
              ))}
            </div>
          </DndContext>
        ) : (
          <TimelineDashboard tasks={filteredTasks} members={members} />
        )}

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleTaskSubmit}
          initialData={selectedTask || undefined}
        />
      </main>
    </div>
  );
}

export default App;