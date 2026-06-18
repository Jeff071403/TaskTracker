import { Component, signal } from '@angular/core';
import { AddTask } from './components/add-task/add-task';
import { TaskList } from './components/task-list/task-list';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [AddTask, TaskList],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('frontend');
}
