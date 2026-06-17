from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return {"message": "Task Tracker API Running"}

if __name__ == "__main__":
    app.run(debug=True)