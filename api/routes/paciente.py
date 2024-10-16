from flask import Blueprint, jsonify, request
from db.models.paciente import Paciente
from playhouse.shortcuts import model_to_dict

paciente = Blueprint('paciente', __name__)

@paciente.route('/paciente', methods=['GET'])
def get_pacientes():
    try:
        pacientes = Paciente.select()
        pacientes_dict = [model_to_dict(paciente) for paciente in pacientes]
        return jsonify(pacientes_dict)
    except Exception as e:
        return jsonify({'error': str(e)})

@paciente.route('/paciente/<int:paciente_id>', methods=['GET'])
def get_paciente(paciente_id):
    try:
        paciente = Paciente.get_by_id(paciente_id)
        paciente = model_to_dict(paciente)
        return jsonify(paciente)
    except Exception as e:
        return jsonify({'error': str(e)})

@paciente.route('/paciente', methods=['POST'])
def create_paciente():
    try:
        username = request.json.get('username')
        password = request.json.get('password')
        telefone = request.json.get('telefone')
        email = request.json.get('email')
        cpf = request.json.get('cpf')
        dataDeNascimento = request.json.get('dataDeNascimento')
        paciente = Paciente.create(username=username, password=password, telefone=telefone, email=email, cpf=cpf, dataDeNascimento=dataDeNascimento)
        
        return jsonify({'message': 'Create paciente'})
    except Exception as e:
        return jsonify({'error': str(e)})

@paciente.route('/paciente/<int:paciente_id>', methods=['PUT'])
def update_paciente(paciente_id):
    try:
        username = request.json.get('username')
        password = request.json.get('password')
        telefone = request.json.get('telefone')
        email = request.json.get('email')
        cpf = request.json.get('cpf')
        dataDeNascimento = request.json.get('dataDeNascimento')
        
        paciente = Paciente.get_by_id(paciente_id)
        paciente.username = username
        paciente.password = password
        paciente.telefone = telefone
        paciente.email = email
        paciente.cpf = cpf
        paciente.dataDeNascimento = dataDeNascimento
        paciente.save()
        
        return jsonify({'message': f'Update paciente with ID {paciente_id}'})
    except Exception as e:
        return jsonify({'error': str(e)})

@paciente.route('/paciente/<int:paciente_id>', methods=['DELETE'])
def delete_paciente(paciente_id):
    try:
        paciente = Paciente.get_by_id(paciente_id)
        paciente.delete_instance()
        return jsonify({"message": "Paciente deletado com sucesso"}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
