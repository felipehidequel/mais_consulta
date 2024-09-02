from flask import Blueprint, jsonify, request

from db.models.psicologo import Psicologo
from playhouse.shortcuts import model_to_dict

psicologo = Blueprint('psicologo', __name__)

@psicologo.route('/psicologo', methods=['GET'])
def get_psicologo():
    try:
        psicologo = Psicologo.select()
        psicologo = [model_to_dict(psicologo) for psicologo in psicologo]

        return jsonify(psicologo)
    except Exception as e:
        return jsonify({'error': str(e)})

@psicologo.route('/psicologo', methods=['POST'])
def create_psicologo():
    try:
        username = request.json.get('username')
        password = request.json.get('password')
        email = request.json.get('email')
        telefone = request.json.get('telefone')
        crp = request.json.get('crp')
        Psicologo.create(username=username, password=password, email=email, telefone=telefone, crp=crp)
        
        return jsonify({'message': 'Psicólogo criado com sucesso'})
    except Exception as e:
        return jsonify({'error': str(e)})

@psicologo.route('/psicologo/<int:id>', methods=['PUT'])
def update_psicologo(id):
    try:
        username = request.json.get('username')
        password = request.json.get('password')
        email = request.json.get('email')
        
        Psicologo.update(username=username, password=password, email=email).where(Psicologo.id == id).execute()
        
        return jsonify({'message': f'Psicólogo {id} atualizado com sucesso'})
    except Exception as e:
        return jsonify({'error': str(e)})
    
@psicologo.route('/psicologo/<int:id>', methods=['DELETE'])
def delete_psicologo(id):
    try:
        Psicologo.delete_by_id(id)
    
        return jsonify({'message': f'Psicólogo {id} excluído com sucesso'})
    except Exception as e: 
        return jsonify({'error': str(e)})