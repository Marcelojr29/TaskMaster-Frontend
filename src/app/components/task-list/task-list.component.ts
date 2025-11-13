import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task, CreateTask } from '../../interfaces/task.interface';
import { User } from '../../interfaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  isLoading = false;
  filter: 'all' | 'pending' | 'completed' = 'all';
  searchTerm: string = '';
  currentUser: User | null = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Observar mudanças no usuário logado
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.showMessage('Error loading tasks!');
        this.isLoading = false;
      }
    });
  }

  onCreateTask(taskData: CreateTask): void {
    this.taskService.createTask(taskData).subscribe({
      next: (newTask) => {
        this.tasks.push(newTask);
        this.applyFilters();
        this.showMessage('Task created successfully.!');
      },
      error: (error) => {
        console.error('Error creating task.:', error);
        this.showMessage('Error creating task.!');
      }
    });
  }

  onTaskUpdated(updatedTask: Task): void {
    if (!updatedTask._id) return;

    this.taskService.updateTask(updatedTask._id, {
      title: updatedTask.title,
      description: updatedTask.description,
      completed: updatedTask.completed
    }).subscribe({
      next: (task) => {
        const index = this.tasks.findIndex(t => t._id === task._id);
        if (index !== -1) {
          this.tasks[index] = task;
          this.applyFilters();
        }
        this.showMessage('Task updated!');
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.showMessage('Error updating task!');
      }
    });
  }

  onTaskDeleted(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task._id !== taskId);
        this.applyFilters();
        this.showMessage('Task deleted!');
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.showMessage('Error deleting task!');
      }
    });
  }

  applyFilters(): void {
    let filtered = this.tasks;

    // Aplicar filtro de status
    switch (this.filter) {
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
    }

    // Aplicar filtro de busca
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      );
    }

    // Ordenar por data de criação (mais recentes primeiro)
    filtered.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );

    this.filteredTasks = filtered;
  }

  onFilterChange(filter: 'all' | 'pending' | 'completed'): void {
    this.filter = filter;
    this.applyFilters();
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  getStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    return { total, completed, pending };
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  logout(): void {
    this.authService.logout();
    this.showMessage('Logout successful');
    this.router.navigate(['/login']);
  }
}
