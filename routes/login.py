from flask import Blueprint, jsonify, request
from db.models.psicologo import Psicologo
from db.models.paciente import Paciente


login = Blueprint('login', __name__)

@login.route('/login', methods=['POST'])
def login_psicologo():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        
        psicologo = Psicologo.get(Psicologo.email == email, Psicologo.password == password)
        
        return jsonify({'message': 'Login realizado com sucesso'})
    except Exception as e:
        return jsonify({'error': str(e)})
    
@login.route('/login/cliente', methods=['GET'])
def login_paciente():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        
        paciente = Paciente.get(Paciente.email == email, Paciente.password == password)
        
        return jsonify({'message': 'Login realizado com sucesso'})
    except Exception as e:
        return jsonify({'error': str(e)})