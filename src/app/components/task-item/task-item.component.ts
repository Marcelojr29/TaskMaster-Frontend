import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<string>();

  onToggleComplete(): void {
    this.taskUpdated.emit({
      ...this.task,
      completed: !this.task.completed
    });
  }

  onDelete(): void {
    if (this.task._id) {
      this.taskDeleted.emit(this.task._id);
    }
  }
}
