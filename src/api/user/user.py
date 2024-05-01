from flask import Blueprint, request, jsonify, url_for
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from api.models import db, User, User_Profile, Event, Event_Member, UserProfileImage
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
            profile_image=data["profile_image"],
            cover_image=data["cover_image"]
        )
        db.session.add(new_user_profile)
        db.session.commit()
        return jsonify({"msg": "user profile successfully created"}), 200

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
        
            
        user_profile.name = data.get("name")
        user_profile.last_name = data.get("last_name")
        user_profile.birthdate = data.get("birthdate")
        user_profile.location = data.get("location")
        user_profile.description = data.get("description")
        user_profile.profile_image = data.get("profile_image")
        user_profile.cover_image = data.get("cover_image")
        
       
        db.session.commit()
        return jsonify({"msg": "user profile successfully updated"}), 200

@user_bp.route("/user-profile/<int:user_id>", methods=["GET"])
@jwt_required()
def get_public_user_profile(user_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    user_profile = User_Profile.query.filter_by(user_id=user_id).first()
    if user is None:
        return jsonify({"msg": "this user does not exist or is not logged in"}), 404
            
    if user_profile is None: 
        return jsonify({"msg": "this user does not have a profile yet"}), 404 
    response_body = {
        "msg": "ok",
        "results": user_profile.serialize()
    }
    return jsonify(response_body), 200
@user_bp.route("/user-account", methods=["GET"])
@jwt_required()
def get_user_account():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    if user is None:
        return jsonify({"msg": "this user does not exist or is not logged in"}), 404
    response_body = user.serialize()
    return jsonify(response_body), 200
@user_bp.route("/update-user", methods=["PUT"])
@jwt_required()
def update_user():
    current_user = get_jwt_identity()
    data = request.json
    user = User.query.filter_by(email=current_user).first()
    if user is None:
        return jsonify({"msg": "this user does not exist or is not logged in"}), 404
    user.email = data["email"]
    user.password = data["password"]
    db.session.commit()
    return jsonify({"msg": "user successfully updated"}), 200

@user_bp.route("/delete-user", methods=["DELETE"])
@jwt_required()
def delete_user():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    if user is None:
        return jsonify({"msg": "this user does not exist or is not logged in"}), 404
    user_membership = Event_Member.query.filter_by(user_id=user.id).all()
    for membership in user_membership:
        db.session.delete(membership)
    user_events = Event.query.filter_by(owner_id=user.id).all()
    for event in user_events:
        members = Event_Member.query.filter_by(event_id=event.id).all()
        for member in members:
            db.session.delete(member)
        db.session.delete(event)
    user_profile = User_Profile.query.filter_by(user_id=user.id).first()
    db.session.delete(user_profile)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "user successfully deleted"}), 200


@user_bp.route("/user-profile-image", methods=["POST"])
@jwt_required()
def upload_user_profile_image():
    current_user = get_jwt_identity()
    data = request.json
    user = User.query.filter_by(email=current_user).first()
    if user is None:
        return jsonify({"msg": "this user does not exist or is not logged in"}), 404
    
    if "image_path" not in data:
        return jsonify({"msg": "image_path is required"}), 400
    
    new_profile_image = UserProfileImage(
        user_id=user.id,
        image_path=data["image_path"]
    )
    db.session.add(new_profile_image)
    db.session.commit()
    return jsonify({"msg": "user profile image successfully uploaded"}), 200

@user_bp.route("/user-profile-image/<int:image_id>", methods=["PUT"])
@jwt_required()
def update_user_profile_image(image_id):
    current_user = get_jwt_identity()
    data = request.json
    user = User.query.filter_by(email=current_user).first()
    if user is None:
        return jsonify({"msg": "this user does not exist or is not logged in"}), 404
    
    profile_image = UserProfileImage.query.get(image_id)
    if profile_image is None:
        return jsonify({"msg": "image not found"}), 404
    
    if profile_image.user_id != user.id:
        return jsonify({"msg": "you are not authorized to update this image"}), 403
    
    if "image_path" not in data:
        return jsonify({"msg": "image_path is required"}), 400
    
    profile_image.image_path = data["image_path"]
    db.session.commit()
    return jsonify({"msg": "user profile image successfully updated"}), 200

@user_bp.route("/user-profile-images/<int:owner_id>", methods=["GET"])
def get_all_user_profile_images(owner_id):

    all_profile_images = UserProfileImage.query.filter_by(user_id=owner_id).all()
    
    if not all_profile_images:
        return jsonify({"msg": "no images found"}), 404
    
    serialized_images = [image.serialize() for image in all_profile_images]
    
    response_body = {
        "msg": "ok",
        "results": serialized_images
    }
    return jsonify(response_body), 200

@user_bp.route("/user-profile-image/<int:image_id>", methods=["DELETE"])
@jwt_required()
def delete_profile_image(image_id):

    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    if user is None:
        return jsonify({"msg": "this user does not exist or is not logged in"}), 404
    
    profile_image = UserProfileImage.query.get(image_id)
    if profile_image is None:
        return jsonify({"msg": "image not found"}), 404
    
    if profile_image.user_id != user.id:
        return jsonify({"msg": "you are not authorized to delete this image"}), 403
    
    db.session.delete(profile_image)
    db.session.commit()
    return jsonify({"msg": "user profile image successfully deleted"}), 200

def generate_password():
    # Genera una contraseña aleatoria de 8 caracteres
    caracteres = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(caracteres) for i in range(8))

@user_bp.route("/google-oauth", methods=["POST"])
def google_oauth():
    try:
        data = request.json

        user = User.query.filter_by(email=data["email"]).first()

        if user is None:
            password = generate_password()
            id_unico = generar_id_unico()
            new_user = User(
                id=id_unico,
                email=data["email"],
                password=password,
                is_active=True
            )
            db.session.add(new_user)
            db.session.commit()
            return jsonify({
                "email": data['email'],
                "password": password,
                "is_active": True
            }), 202
        
        else: 
            access_token = create_access_token(identity=data["email"])
            return jsonify(access_token=access_token), 200
        
    except Exception as e:
        return jsonify({"msg": "Error en la autenticación o registro con Google", "error": str(e)}), 500
    
@user_bp.route("/validate-profile", methods=["GET"])
@jwt_required()
def get_validate_profile():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    user_profile = User_Profile.query.filter_by(user_id=user.id).first()
    if user is None:
        return jsonify({"msg": "this user does not exist or is not logged in"}), 404
            
    if user_profile is None: 
        return jsonify({"msg": "this user does not have a profile yet"}), 404 
    response_body = {
        "msg": "ok",
        "results": user_profile.serialize()
    }
    return jsonify(response_body), 200

# def verify_google_token(access_token):
#     # URL para verificar el token de acceso con Google
#     token_info_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={access_token}"
    
#     # Realizar la solicitud GET para verificar el token
#     response = requests.get(token_info_url)
    
#     # Verificar si la solicitud fue exitosa y obtener los datos de la respuesta
#     if response.status_code == 200:
#         token_info = response.json()
#         return token_info
#     else:
#         # Si la solicitud falla, puedes manejar el error apropiadamente
#         print("Error al verificar el token:", response.text)
#         return None


# def validate_google_token(access_token):
#     token_info = verify_google_token(access_token)
    
#     if token_info:
#         # Verificar si el token es válido y está firmado por Google
#         if token_info.get("iss") == "accounts.google.com" and token_info.get("aud") == "YOUR_CLIENT_ID.apps.googleusercontent.com":
#             return True
#         else:
#             # Si el token no es válido o no está firmado por Google, puedes manejar el error
#             print("Token no válido o no firmado por Google.")
#             return False
#     else:
#         return False
