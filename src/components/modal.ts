export interface Subtask {
  title: string;
  isCompleted: boolean;
}

export interface Task {
  title: string;
  description: string;
  status: string;
  subTasks: Subtask[];
  _id: string;
}

export type NewTask = Omit<Task, '_id'>

export interface Column {
  readonly _id?: string;
  name: string;
  tasks: Task[];
}

export type EditColumn  = Omit<Column, 'tasks'>

export interface Board {
  name: string;
 readonly _id?: string,
  columns: Column[];
}

export interface NewBoard {
  name: string;
  columns?: Column[]
}