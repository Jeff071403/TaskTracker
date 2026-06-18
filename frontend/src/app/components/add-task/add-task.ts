import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../services/task';

@Component({
  standalone: true,
  selector: 'app-add-task',
  imports: [FormsModule],
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

  constructor(private taskService: TaskService) {}

  createTask() {
    this.taskService.createTask(this.task).subscribe({
      next: () => {
        alert('Task Created');

        // notify other components to refresh
        this.taskService.notifyChange();

        this.task = {
          title: '',
          description: '',
          due_date: '',
          priority: 'Medium',
          is_done: false
        };
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }
}