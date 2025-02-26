from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

OPERATORS = ["+", "-", "*"]
MIN_OPERAND = 3
MAX_OPERAND = 12
TOTAL_QUESTIONS = 7  # Limit to 7 questions

# Store the number of questions asked for each session
session_data = {"questions_asked": 0}

def generate_problem():
    left = random.randint(MIN_OPERAND, MAX_OPERAND)
    right = random.randint(MIN_OPERAND, MAX_OPERAND)
    operator = random.choice(OPERATORS)

    expression = f"{left} {operator} {right}"
    answer = eval(expression)

    return {"problem": expression, "answer": answer}

@app.route("/")
def home():
    session_data["questions_asked"] = 0  # Reset count when the game starts
    return render_template("index.html")

@app.route("/get-problem", methods=["GET"])
def get_problem():
    if session_data["questions_asked"] >= TOTAL_QUESTIONS:
        return jsonify({"problem": None})  # Indicate quiz is over

    session_data["questions_asked"] += 1
    problem = generate_problem()
    return jsonify({"problem": problem["problem"]})

@app.route("/check-answer", methods=["POST"])
def check_answer():
    data = request.json
    user_answer = int(data["answer"])
    correct_answer = eval(data["problem"])

    return jsonify({"correct": user_answer == correct_answer})

if __name__ == "__main__":
    app.run(debug=True)
