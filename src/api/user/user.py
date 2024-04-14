from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from api.models import db, User, User_Profile
from flask_mail import Message
from api.utils import mail
from flask_cors import CORS
from . import user_bp

CORS(user_bp)


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

#post endpoint to retrieve the user email, check if it is real, and send recovery link
@user_bp.route("/recover-password", methods=["POST"])
def recover_password():
    email = request.json.get("email", None)
    frontend_url = request.json.get("frontend_url", None)

    query_results = User.query.filter_by(email=email).first()

    if query_results is None:
        return jsonify({"msg": "Bad Request"}), 404

    # Generate a token for the user
    access_token = create_access_token(identity=email)

    # Create a password recovery link
    password_recovery_link = f"{frontend_url}/{access_token}"

    # Send the password recovery email
    msg = Message(
        "Password Recovery",
        recipients=[email],
        html=f"<p>Please click the following link to reset your password:</p><a href='{password_recovery_link}'>Reset Password</a>"
    )
    mail.send(msg)

    return jsonify({"msg": "Password recovery email sent"}), 200























































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
                    name= data["name"],
                    last_name= data["last_name"],
                    birthdate= data["birthdate"],
                    location= data["location"],
                    description= data["description"],
                    profile_image= data["profile_image"]
            )
            db.session.add(new_user_profile)
            db.session.commit()
            return jsonify({"msg": "user profile successfully created"}), 200
     