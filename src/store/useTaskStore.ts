import { create } from 'zustand';
import { TaskStore, Task, TaskStatus, Member } from '../types/task';

const useTaskStore = create<TaskStore>((set) => ({
  tasks: new Map(),
  members: new Map([
    ['1', { id: '1', name: 'Karen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' }],
    ['2', { id: '2', name: 'Jake', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36' }],
    ['3', { id: '3', name: 'Brad', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e' }],
    ['4', { id: '4', name: 'Molly', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956' }],
  ]),
  
  addTask: (task) => set((state) => {
    const newTasks = new Map(state.tasks);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    newTasks.set(id, {
      ...task,
      id,
      createdAt: now,
      updatedAt: now,
    });
    
    return { tasks: newTasks };
  }),

  updateTask: (id, updatedTask) => set((state) => {
    const newTasks = new Map(state.tasks);
    const existingTask = newTasks.get(id);
    
    if (existingTask) {
      newTasks.set(id, {
        ...existingTask,
        ...updatedTask,
        updatedAt: new Date().toISOString(),
      });
    }
    
    return { tasks: newTasks };
  }),

  deleteTask: (id) => set((state) => {
    const newTasks = new Map(state.tasks);
    newTasks.delete(id);
    return { tasks: newTasks };
  }),

  moveTask: (taskId, newStatus) => set((state) => {
    const newTasks = new Map(state.tasks);
    const task = newTasks.get(taskId);
    
    if (task) {
      newTasks.set(taskId, {
        ...task,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    }
    
    return { tasks: newTasks };
  }),

  reorderTasks: (status, startIndex, endIndex) => set((state) => {
    const tasksArray = Array.from(state.tasks.entries())
      .filter(([_, task]) => task.status === status);
    
    const [movedTask] = tasksArray.splice(startIndex, 1);
    tasksArray.splice(endIndex, 0, movedTask);
    
    const newTasks = new Map();
    tasksArray.forEach(([id, task]) => newTasks.set(id, task));
    
    return { tasks: newTasks };
  }),

  addMember: (member) => set((state) => {
    const newMembers = new Map(state.members);
    const id = crypto.randomUUID();
    newMembers.set(id, { ...member, id });
    return { members: newMembers };
  }),

  updateMember: (id, member) => set((state) => {
    const newMembers = new Map(state.members);
    const existingMember = newMembers.get(id);
    if (existingMember) {
      newMembers.set(id, { ...existingMember, ...member });
    }
    return { members: newMembers };
  }),

  deleteMember: (id) => set((state) => {
    const newMembers = new Map(state.members);
    newMembers.delete(id);
    return { members: newMembers };
  }),
}));

export default useTaskStore;