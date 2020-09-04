import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Resource, Api

app = Flask(__name__)
app.config['SECRET_KEY'] = 'assembler'

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///' +
                                                       os.path.join(basedir, 'data.sqlite'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
Migrate(app, db)


########### MODELS ##########


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50),  nullable=False)
    password = db.Column(db.Text, nullable=False)
    expense = db.relationship(
        'Expense', backref='user', lazy=True)

    def __init__(self, name, username, password):
        self.name = name
        self.username = username
        self.password = password

    def __repr__(self):
        return f" Name is : {self.name}"


class Expense(db.Model):
    __tablename__ = 'expense'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id'), nullable=False)


###API's###
class UserRegister(Resource):
    def post(self):
        data = request.get_json()
        user = User(
            name=data['name'], username=data['username'], password=data['password'])
        db.session.add(user)
        db.session.commit()

        return {'message': 'User created successfully'}


class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        try:
            if user.password == data['password']:

                return {"Status": 'Success', 'id': user.id}
        except:
            pass

        return {"Status": 'Failure'}


class UserExpense(Resource):
    def post(self, user_id):
        data = request.get_json()
        expense = Expense(user_id=user_id,
                          description=data['description'], amount=data['amount'], type=data['type'])
        db.session.add(expense)
        db.session.commit()

        return {'message': 'Expense added successfully'}

    def get(self, user_id):
        expense = Expense.query.filter_by(user_id=user_id).all()
        expense_data = []
        print(expense)
        if not (expense):
            return {"message": 'What are you doing?'}

        for i in range(len(expense)):
            expense_data.append({'description': expense[i].description,
                                 'amount': expense[i].amount,
                                 'type': expense[i].type})

        return {'data': expense_data}


# @app.before_first_request
# def create_tables():
#     db.create_all()


api = Api(app)
api.add_resource(UserExpense, "/<int:user_id>")
api.add_resource(UserRegister, "/register")
api.add_resource(UserLogin, "/login")

if __name__ == "__main__":
    app.run(debug=True)
