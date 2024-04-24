from flask import Blueprint, request, jsonify, url_for
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from api.models import db, User, User_Profile
from flask_mail import Message
from api.utils import mail
from flask_cors import CORS
from . import user_bp
from urllib.parse import quote
import random
import string

CORS(user_bp)

def generar_id_unico():
    while True:
        # Genera un número aleatorio de 9 dígitos
        id_aleatorio = ''.join(random.choices(string.digits, k=9))
        
        # Verifica si el número ya existe en la base de datos
        if not User.query.get(id_aleatorio):
            return id_aleatorio


@user_bp.route('/create-user', methods=['POST'])
def create_user():
    data = request.json
    user_exists = User.query.filter_by(email=data["email"]).first()
    if user_exists is None: 
        id_unico = generar_id_unico()
        new_user = User(
            id=id_unico,
            email=data['email'],
            password=data['password'],
            is_active=data['is_active']
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            "msg": "new user successfully created"
        }), 200
    else: 
        return jsonify({
            "msg": "this email is already used by a user"
        }), 400


@user_bp.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"msg": "Bad Request"}), 404

    if email == user.email and password == user.password:
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token), 200
    
    else: 
        return jsonify({"msg": "Bad email or password. I am sorry"}), 401


@user_bp.route("/valid-token", methods=["GET"])
@jwt_required()
def valid_token():
    current_user = get_jwt_identity()

    user = User.query.filter_by(email=current_user).first()

    if user is None:
        return jsonify({"msg": "user does not exist",
                        "is_logged": False}), 404
     
    return jsonify({"is_logged": True}), 200


@user_bp.route("/recover-password", methods=["POST"])
def recover_password():
    email = request.json.get("email", None)
    frontend_url = request.json.get("frontend_url", None)

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"msg": "Bad Request"}), 404 

    # Generate a token with the user's email
    token = user.generate_reset_token()
    token = quote(token)
    token = token.replace(".", "%2E")
    encoded_token = url_for("users.reset_password", token=token, _external=False)
    encoded_token = encoded_token.replace("/api/reset-password", "/password-reset")
    
    password_recovery_link = f"{frontend_url}{encoded_token}"

    # Send the password recovery email
    msg = Message(
        "Password Recovery",
        recipients=[email],
        html=f"<p>Please click the following link to reset your password:</p><a href='{password_recovery_link}'>Reset Password</a>"
    )
    mail.send(msg)
    return jsonify({"msg": "Password recovery email sent"}), 200

@user_bp.route('/reset-password/<token>', methods=['PUT'])
def reset_password(token):
    print(token)
    user = User.verify_reset_token(token)
    print(user)
    data = request.json
    if user is None: 
        return jsonify({"msg": "token is not valid",
                        "is_logged": False}), 401
    else: 
        user.password = data["password"]
        db.session.commit()
        return ({"msg": "ok, the password has been updated in the database"}), 200

@user_bp.route("/user-profile", methods=["POST"])
@jwt_required()
def create_user_profile():
    current_user = get_jwt_identity()
    data = request.json
    user = User.query.filter_by(email=current_user).first()
    if user is None:
        return jsonify({"msg": "this user does not exist or is not logged in"}), 404
            
    else: 
        new_user_profile = User_Profile(
            user_id=user.id,
            name=data["name"],
            last_name=data["last_name"],
            birthdate=data["birthdate"],
            location=data["location"],
            description=data["description"],
            profile_image=data["profile_image"]
        )
        db.session.add(new_user_profile)
        db.session.commit()
        return jsonify({"msg": "user profile successfully created"}), 200




@user_bp.route("/profile-view", methods=["GET"])
@jwt_required()
def get_profile_view():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    query_results = User_Profile.query.filter_by(user_id=user.id)
    results = list(map(lambda item: item.serialize(), query_results))
    print(results)
    if user is None:
        return jsonify({"msg": "this user does not exist or is not logged in"}), 404
            
    if query_results.first() is None: 
        return jsonify({"msg": "this user does not have a profile yet"}), 404 
    response_body = {
        "msg": "ok",
        "results": results
    }
    return jsonify(response_body), 200


@user_bp.route("/update-profile", methods=["PUT"])
@jwt_required()
def update_user_profile():
    current_user = get_jwt_identity()
    data = request.json
    user = User.query.filter_by(email=current_user).first()
    user_profile = User_Profile.query.filter_by(user_id=user.id).first()
    if user is None:
        return jsonify({"msg": "this user does not exist or is not logged in"}), 404
            
    else: 
        
            
        user_profile.name=data["name"],
        user_profile.last_name=data["last_name"],
        user_profile.birthdate=data["birthdate"],
        user_profile.location=data["location"],
        user_profile.description=data["description"],
        user_profile.profile_image=data["profile_image"]
        
       
        db.session.commit()
        return jsonify({"msg": "user profile successfully updated"}), 200

@user_bp.route("/public-user-profile/<int:user_id>", methods=["GET"])
@jwt_required()
def get_public_user_profile(user_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    query_results = User_Profile.query.filter_by(user_id=user_id)
    results = list(map(lambda item: item.serialize(), query_results))
    print(results)
    if user is None:
        return jsonify({"msg": "this user does not exist or is not logged in"}), 404
            
    if query_results.first() is None: 
        return jsonify({"msg": "this user does not have a profile yet"}), 404 
    response_body = {
        "msg": "ok",
        "results": results
    }
    return jsonify(response_body), 200


