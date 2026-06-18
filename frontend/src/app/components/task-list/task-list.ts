import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../services/task';

@Component({
  standalone: true,
  selector: 'app-task-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskList implements OnInit {

  tasks: Task[] = [];
  filterStatus: string = 'all';
  filterPriority: string = '';
  showDropdowns: boolean = true;
  deleteDialogVisible = false;
  deleteTargetId: number | null = null;
  deleteTargetTitle = '';

  private tasksSub: any;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.tasksSub = this.taskService.tasksChanged$.subscribe(() => this.loadTasks());
  }

  loadTasks() {
    this.taskService.getTasks(this.filterStatus, this.filterPriority).subscribe({
      next: (data: Task[]) => {
        this.tasks = data.sort((a, b) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });
        console.log(`Loaded ${this.tasks.length} tasks - Pending: ${this.pendingCount}, Done: ${this.doneCount}`);
      },
      error: (err: any) => {
        console.error('Error loading tasks:', err);
      }
    });
  }

  openDeleteDialog(id: number, title: string) {
    this.deleteDialogVisible = true;
    this.deleteTargetId = id;
    this.deleteTargetTitle = title;
  }

  confirmDeleteTask() {
    if (this.deleteTargetId == null) {
      return;
    }

    this.taskService.deleteTask(this.deleteTargetId).subscribe(() => {
      this.taskService.notifyChange();
      this.cancelDelete();
    });
  }

  cancelDelete() {
    this.deleteDialogVisible = false;
    this.deleteTargetId = null;
    this.deleteTargetTitle = '';
  }

  toggleDone(task: Task) {

    const updatedTask = {
      ...task,
      is_done: !task.is_done
    };

    this.taskService.updateTask(task.id!, updatedTask)
      .subscribe(() => {
        this.taskService.notifyChange();
      });
  }

  applyFilters() {
    this.loadTasks();
  }

  ngOnDestroy(): void {
    this.tasksSub?.unsubscribe?.();
  }

  get pendingCount() {
    return this.tasks.filter(t => !t.is_done).length;
  }

  get doneCount() {
    return this.tasks.filter(t => t.is_done).length;
  }
}