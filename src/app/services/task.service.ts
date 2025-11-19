import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task, CreateTask, UpdateTask } from '../interfaces/task.interface';
import { GenericHttpService } from './generic-http.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private _service: GenericHttpService<Task>) { }

  getAllTasks(): Observable<Task[]> {
    return this._service.get('tasks');
  }

  getTasksByStatus(completed: boolean): Observable<Task[]> {
    return this._service.get('tasks', undefined, { completed: completed.toString() });
  }

  getTaskById(id: string): Observable<Task> {
    return this._service.get('tasks', id);
  }

  createTask(task: CreateTask): Observable<Task> {
    return this._service.post('tasks', task as any);
  }

  updateTask(id: string, task: UpdateTask): Observable<Task> {
    return this._service.put('tasks', task as any, id);
  }

  deleteTask(id: string): Observable<Task> {
    return this._service.delete('tasks', id);
  }
}
