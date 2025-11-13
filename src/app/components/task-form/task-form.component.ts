import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  @Output() taskCreated = new EventEmitter<any>();
  
  taskForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      // Emitir os valores do formulário
      this.taskCreated.emit({
        title: this.taskForm.get('title')?.value,
        description: this.taskForm.get('description')?.value
      });

      // Resetar o formulário após emitir
      this.taskForm.reset();
      
      // Reativar o botão
      setTimeout(() => {
        this.isSubmitting = false;
      }, 500);
    }
  }
}
