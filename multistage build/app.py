from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify(message="Welcome to the Flask app!")

PORT = int(os.environ.get('PORT',5000))

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=PORT)