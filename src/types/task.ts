export type TaskStatus = 'backlog' | 'in-progress' | 'paused' | 'ready';

export interface Member {
  id: string;
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignees: string[];
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  member?: string; // ID of the assigned member
  color?: 'yellow' | 'blue' | 'purple' | 'green'; // Task color coding
}

export interface TaskStore {
  tasks: Map<string, Task>;
  members: Map<string, Member>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  reorderTasks: (status: TaskStatus, startIndex: number, endIndex: number) => void;
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
}