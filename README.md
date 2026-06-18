Task Tracker

A simple Task Tracker web application built using Angular, Flask, and PostgreSQL. The application allows users to create, view, update, filter, and delete tasks while tracking their completion status and priority.

Features:
Task Management:
    Create new tasks
    View all tasks
    Update task status (Pending / Done)
    Delete tasks
    Track due dates
Task Details:
    Title
    Description
    Due Date
    Priority (High, Medium, Low)
    Status (Pending, Done)
Filtering:
    Filter tasks by status
    Filter tasks by priority
Dashboard Summary:
    Total Pending Tasks
    Total Completed Tasks

Technology Stack:
    Frontend:
        Angular
        TypeScript
        HTML
        CSS
    Backend:
        Flask
    Database:
        PostgreSQL
API Endpoints:
1. Get All Tasks
   GET /tasks
2. Create Task
   POST /tasks
3. Update Task Status
   PUT /tasks/<id>
4. Delete Task
   DELETE /tasks/<id>
Screenshots:
Add Task Page (Inside Image Folder)
    Create a new task by entering title, description, due date, and priority.
    Task List Page
    View all tasks.
    Filter tasks by status and priority.
    Mark tasks as done or pending.
    Delete tasks.
