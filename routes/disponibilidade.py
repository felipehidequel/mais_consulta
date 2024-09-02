from flask import Blueprint, jsonify, request
from db.models.disponibilidade import Disponibilidade
from playhouse.shortcuts import model_to_dict

disponibilidade = Blueprint('disponibilidade', __name__)

@disponibilidade.route('/disponibilidade', methods=['GET'])
def get_disponibilidades():
    try:
        disponibilidades = Disponibilidade.select()
        disponibilidades_dict = [model_to_dict(disponibilidade) for disponibilidade in disponibilidades]
        
        for disponibilidade in disponibilidades_dict:
            disponibilidade['horario_inicio'] = disponibilidade['horario_inicio'].strftime('%H:%M:%S')
            disponibilidade['horario_fim'] = disponibilidade['horario_fim'].strftime('%H:%M:%S')
        
        return jsonify(disponibilidades_dict)
    except Exception as e:
        return jsonify({'error': str(e)})
    
@disponibilidade.route('/disponibilidade/<int:disponibilidade_id>', methods=['GET'])
def get_disponibilidade(disponibilidade_id):
    try:
        disponibilidade = Disponibilidade.get_by_id(disponibilidade_id)
        disponibilidade = model_to_dict(disponibilidade)
        
        disponibilidade['horario_inicio'] = disponibilidade['horario_inicio'].strftime('%H:%M:%S')
        disponibilidade['horario_fim'] = disponibilidade['horario_fim'].strftime('%H:%M:%S')
        
        return jsonify(disponibilidade)
    except Exception as e:
        return jsonify({'error': str(e)})
    
@disponibilidade.route('/disponibilidade/day', methods=['GET'])
def get_disponibilidade_by_day():
    try:
        dia_semana = request.json.get('dia_semana')
        disponibilidades = Disponibilidade.filter(dia_semana=dia_semana)
        disponibilidades = [model_to_dict(disponibilidade) for disponibilidade in disponibilidades]
        
        for d in disponibilidades:
            d['horario_inicio'] = d['horario_inicio'].strftime('%H:%M:%S')
            d['horario_fim'] = d['horario_fim'].strftime('%H:%M:%S')
        
        return jsonify(disponibilidades)
        
    except Exception as e:
        return jsonify({f"error: {e}"})

@disponibilidade.route('/disponibilidade', methods=['POST'])
def create_disponibilidade():
    try:
        psicologo = request.json.get('psicologo')
        data = request.json.get('data')
        horario_inicio = request.json.get('horario_inicio')
        horario_fim = request.json.get('horario_fim')
        dia_semana = request.json.get("dia_semana")
        Disponibilidade.create(psicologo=psicologo, data=data, horario_inicio=horario_inicio, horario_fim=horario_fim, dia_semana=dia_semana)
        
        return jsonify({'message': 'Create disponibilidade'})
    except Exception as e:
        return jsonify({'error': str(e)})

@disponibilidade.route('/disponibilidade/<int:disponibilidade_id>', methods=['PUT'])
def update_disponibilidade(disponibilidade_id):
    try:
        disponibilidade = Disponibilidade.get_by_id(disponibilidade_id)
        disponibilidade.data = request.json.get('data')
        disponibilidade.horario_inicio = request.json.get('horario_inicio')
        disponibilidade.horario_fim = request.json.get('horario_fim')
        disponibilidade.save()
        
        return jsonify({'message': f'Update disponibilidade with ID {disponibilidade_id}'})
    except Exception as e:
        return jsonify({'error': str(e)})
    
@disponibilidade.route('/disponibilidade/<int:disponibilidade_id>', methods=['DELETE'])
def delete_disponibilidade(disponibilidade_id):
    try:
        Disponibilidade.delete_by_id(disponibilidade_id)
    
        return jsonify({'message': f'Delete disponibilidade with ID {disponibilidade_id}'})
    except Exception as e:
        return jsonify({'error': str(e)})