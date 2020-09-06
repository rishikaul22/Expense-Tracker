import numpy as np
import pandas as pd
import os
from flask import Flask, request, jsonify, make_response, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
#from functools import wraps
#from flask_jwt import JWT, jwt_required, current_identity
from flask_jwt_extended import create_access_token, jwt_required, get_raw_jwt
from flask_jwt_extended import JWTManager
from werkzeug.security import safe_str_cmp

import datetime

app = Flask(__name__)
cors = CORS(app, support_credentials=True, allow_headers=[
    "Content-Type", "Authorization", "Access-Control-Allow-Credentials"])
app.config['SECRET_KEY'] = 'assembler'

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///' +
                                                       os.path.join(basedir, 'data.sqlite'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
Migrate(app, db)

# we can also use app.secret like before, Flask-JWT-Extended can recognize both
app.config['JWT_SECRET_KEY'] = 'jose'
app.config['JWT_BLACKLIST_ENABLED'] = True  # enable blacklist feature
# allow blacklisting for access and refresh tokens
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access']
jwt = JWTManager(app)

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
    day = db.Column(db.Float, nullable=False)
    month = db.Column(db.Float, nullable=False)
    year = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id'), nullable=False)


### API's ###
class UserRegister(Resource):
    @cross_origin(support_credentials=True)
    def post(self):
        data = request.get_json()
        user = User(
            name=data['name'], username=data['username'], password=data['password'])
        db.session.add(user)
        db.session.commit()

        return {'message': 'User created successfully'}


class UserLogin(Resource):
    @cross_origin(origin='*', support_credentials=True)
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
#         print(user.password)
        if user is None:
            return {'message': 'User doesn\'t exist.'}
        if user and safe_str_cmp(user.password, data['password']):
            access_token = create_access_token(
                identity=user.id, expires_delta=datetime.timedelta(hours=30))
            #refresh_token = create_refresh_token(user.id)
            return {
                'access_token': access_token,
                'id': user.id
            }, 200
        return {"message": 'Invalid credentials'}, 401


class DashBoard(Resource):

    @jwt_required
    @cross_origin(origin='*', support_credentials=True)
    def get(self, user_id):
        user = User.query.get(user_id)
        expense_list = Expense.query.all()
        expense_data = []
        print(expense_list)
        if not (expense_list):
            return {"message": 'What are you doing?'}
        # for i in range(len(expense_list)):
        #     expense_data.append({'description': expense_list[i].description,
        #                          'amount': expense_list[i].amount,
        #                          'day': expense_list[i].day,
        #                          'month': expense_list[i].month,
        #                          "year": expense_list[i].year,
        #                          'type': expense_list[i].type})

        for i in range(len(expense_list)):
            expense_data.append({'description': expense_list[i].description,
                                 'day': expense_list[i].day,
                                 'month': expense_list[i].month,
                                 'amount': expense_list[i].amount,
                                 "year": expense_list[i].year,
                                 'type': expense_list[i].type})
        print(expense_data)
        df = pd.DataFrame.from_dict(expense_data)
        print(df)
        income = df.loc[df['type'] == 'Income']['amount'].sum()
        expense = df.loc[df['type'] == 'Expense']['amount'].sum()
        incomedf = pd.DataFrame(df.loc[df['type'] == 'Income'])[
            ['month', 'amount']].to_dict()
        expensedf = pd.DataFrame(df.loc[df['type'] == 'Expense'])[
            ['month', 'amount']].to_dict()
        print(incomedf)
        print(expensedf)
        # print(type(int(income)))
        print(expense)
        wallet = income - expense
        return {
            "name": user.name,
            "income": float(income),
            "expense": float(expense),
            "wallet": float(wallet),
            "incomedf": incomedf,
            "expensedf": expensedf
        }


class UserExpense(Resource):

    @jwt_required
    @cross_origin(origin='*', support_credentials=True)
    def post(self, user_id):
        data = request.get_json()
        expense = Expense(user_id=user_id,
                          description=data['description'], amount=data['amount'], type=data['type'], day=data['day'], month=data['month'], year=data['year'])
        db.session.add(expense)
        db.session.commit()

        return {'message': 'Expense added successfully'}

    @jwt_required
    @cross_origin(origin='*', support_credentials=True)
    def get(self, user_id):
        expense = Expense.query.filter_by(user_id=user_id).all()
        expense_data = []
        print(expense)
        if not (expense):
            return {"message": 'What are you doing?'}

        for i in range(len(expense)):
            expense_data.append({'description': expense[i].description,
                                 'amount': expense[i].amount,
                                 'day': expense[i].day,
                                 'month': expense[i].month,
                                 "year": expense[i].year,
                                 'type': expense[i].type})

        return {'data': expense_data}


class UserLogout(Resource):

    @jwt_required
    @cross_origin(origin='*', support_credentials=True)
    def post(self):
        jti = get_raw_jwt()['jti']
        BLACKLIST.append(jti)
        return {"message": "Successfully logged out"}, 200


class GetAllExpenses(Resource):

    @jwt_required
    @cross_origin(origin='*', support_credentials=True)
    def get(self):
        expense_list = Expense.query.all()
        expense_data = []
        print(expense_list)
        if not (expense_list):
            return {"message": 'What are you doing?'}

        for i in range(len(expense_list)):
            expense_data.append({'description': expense_list[i].description,
                                 'amount': expense_list[i].amount,
                                 'type': expense_list[i].type})

        return {'data': expense_data}


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    return decrypted_token['jti'] in BLACKLIST


@jwt.expired_token_loader
def expired_token_callback():
    return jsonify({
        'message': 'The token has expired.',
        'error': 'token_expired'
    }), 401


@jwt.invalid_token_loader
# we have to keep the argument here, since it's passed in by the caller internally
def invalid_token_callback(error):
    return jsonify({
        'message': 'Signature verification failed.',
        'error': 'invalid_token'
    }), 401


@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({
        "description": "Request does not contain an access token.",
        'error': 'authorization_required'
    }), 401


# @jwt.needs_fresh_token_loader
# def token_not_fresh_callback():
#     return jsonify({
#         "description": "The token is not fresh.",
#         'error': 'fresh_token_required'
#     }), 401


@jwt.revoked_token_loader
def revoked_token_callback():
    return jsonify({
        "description": "The token has been revoked.",
        'error': 'token_revoked'
    }), 401


BLACKLIST = []

# @app.before_first_request
# def create_tables():
#     db.create_all()


api = Api(app)
api.add_resource(UserExpense, "/<int:user_id>")
api.add_resource(GetAllExpenses, "/getAll")
api.add_resource(UserRegister, "/register")
api.add_resource(UserLogin, "/login")
api.add_resource(UserLogout, "/logout")
api.add_resource(DashBoard, '/dashboard/<int:user_id>')

if __name__ == "__main__":
    app.run(debug=True)
