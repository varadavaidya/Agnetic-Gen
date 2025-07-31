from flask import Flask, request, jsonify
app = Flask(__name__)

#users
users=[]

@app.route('/')
def hello():
    return "Hello from Flask inside Docker!"

@app.route('/name/<name>')
def welcome(name):
    return f"Welcome, {name}"

@app.route('/register',methods=['POST'])
def register():
    data=request.get_json()
    if not data or 'name' not in data or 'email' not in data:
        return jsonify({"error":"Missing user details"}),400
    
    user={
        "id": len(users)+1,
        "name": data['name'],
        "email": data['email']

    }
    users.append(user)
    return jsonify({"message":"user registerd successfully", "user": user}), 201

@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(users), 200     

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
