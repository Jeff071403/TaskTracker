import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../services/task';

@Component({
  standalone: true,
  selector: 'app-add-task',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.html',
  styleUrls: ['./add-task.css'],
})
export class AddTask {

  task: Task = {
    title: '',
    description: '',
    due_date: '',
    priority: 'Medium',
    is_done: false
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private taskService: TaskService) {}

  createTask() {
    this.errorMessage = '';
    this.successMessage = '';

    this.taskService.createTask(this.task).subscribe({
      next: () => {
        this.successMessage = 'Task created successfully!';

        // notify other components to refresh
        this.taskService.notifyChange();

        this.task = {
          title: '',
          description: '',
          due_date: '',
          priority: 'Medium',
          is_done: false
        };

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.error || 'Failed to create task. Check console for details.';
        console.error('Create task error:', err);
      }
    });
  }
}