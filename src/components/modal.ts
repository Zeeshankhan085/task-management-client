export interface Subtask {
  readonly id?: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  title: string;
  description: string;
  status: string;
  subTasks: Subtask[];
  id: string;
}

export type NewTask = Omit<Task, "id">;

export interface Column {
  readonly id?: string;
  name: string;
  tasks: Task[];
}

export type EditColumn = Omit<Column, "tasks">;

export interface Board {
  name: string;
  readonly id?: string;
  columns: Column[];
}

export interface NewBoard {
  name: string;
  columns?: Column[];
}
