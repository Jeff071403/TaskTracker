from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import db, Task
from datetime import datetime
from pathlib import Path
from sqlalchemy import text

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
CORS(app)

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "message": "TaskTracker API",
        "endpoints": {
            "GET /api/tasks": "List tasks",
            "POST /api/tasks": "Create a task",
            "GET /api/tasks/<id>": "Get task details",
            "PUT /api/tasks/<id>": "Update a task",
            "DELETE /api/tasks/<id>": "Delete a task"
        }
    })

@app.route("/api/tasks", methods=["GET"])
def get_tasks():

    status = request.args.get("status")
    priority = request.args.get("priority")

    query = Task.query

    if status == "done":
        query = query.filter_by(is_done=True)

    elif status == "pending":
        query = query.filter_by(is_done=False)

    if priority:
        query = query.filter_by(priority=priority)

    tasks = query.order_by(Task.due_date.asc()).all()

    return jsonify([task.to_dict() for task in tasks])

@app.route("/api/tasks/<int:id>", methods=["GET"])
def get_task(id):

    task = Task.query.get_or_404(id)

    return jsonify(task.to_dict())

@app.route("/api/tasks", methods=["POST"])
def create_task():

    data = request.json

    task = Task(
        title=data["title"],
        description=data.get("description"),
        due_date=datetime.strptime(
            data["due_date"],
            "%Y-%m-%d"
        ).date() if data.get("due_date") else None,
        priority=data["priority"]
    )

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 201

@app.route("/api/tasks/<int:id>", methods=["PUT"])
def update_task(id):

    task = Task.query.get_or_404(id)

    data = request.json

    task.title = data["title"]
    task.description = data.get("description")

    task.priority = data["priority"]
    task.is_done = data["is_done"]

    if data.get("due_date"):
        task.due_date = datetime.strptime(
            data["due_date"],
            "%Y-%m-%d"
        ).date()

    db.session.commit()

    return jsonify(task.to_dict())

@app.route("/api/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):

    task = Task.query.get_or_404(id)

    db.session.delete(task)
    db.session.commit()

    return jsonify({
        "message": "Task deleted"
    })


@app.route('/init-db', methods=['POST'])
def init_db():
    """Development helper: create tables and load sample data if available."""
    with app.app_context():
        db.create_all()

        sql_path = Path(__file__).resolve().parent.parent / 'database' / 'sample_data.sql'
        if sql_path.exists():
            sql = sql_path.read_text()
            # Execute raw SQL statements
            with db.engine.connect() as conn:
                for stmt in sql.split(';'):
                    stmt = stmt.strip()
                    if stmt:
                        conn.execute(text(stmt))

    return jsonify({"message": "Database initialized"})


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)