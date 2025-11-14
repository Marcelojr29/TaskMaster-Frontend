export interface Task {
  _id?: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTask {
  title: string;
  description: string;
}

export interface UpdateTask {
  title?: string;
  description?: string;
  completed?: boolean;
}
