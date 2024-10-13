from flask import Blueprint, render_template, jsonify, request
from db.models.consulta import Consulta
from playhouse.shortcuts import model_to_dict

consulta = Blueprint('consulta', __name__, template_folder='templates')


"""
ROTAS PARA CONSULTA
"""

@consulta.route('/consulta', methods=['GET'])
def get_consultas():
    try:
        consultas = Consulta.select()
        
        consultas_dict = [model_to_dict(consulta) for consulta in consultas]
        for consulta in consultas_dict:
            consulta['inicio'] = consulta['inicio'].strftime('%H:%M:%S')
            consulta['fim'] = consulta['fim'].strftime('%H:%M:%S')
        
        return jsonify(consultas_dict)
    except Exception as e:
        return jsonify({'error': str(e)})

@consulta.route('/consulta/<int:consulta_id>', methods=['GET'])
def get_consulta(consulta_id):
    try:
        consulta = Consulta.get_by_id(consulta_id)
        
        consulta = model_to_dict(consulta)
        consulta['inicio'] = consulta['inicio'].strftime('%H:%M:%S')
        consulta['fim'] = consulta['fim'].strftime('%H:%M:%S')
        
        return jsonify(consulta)
    except Exception as e:
        return jsonify({'error': str(e)})
    
@consulta.route('/consulta/paciente/<int:paciente_id>', methods=['GET'])
def get_consultas_paciente(paciente_id):
    try:
        consultas = Consulta.select().where(Consulta.paciente == paciente_id)
        
        consultas_dict = [model_to_dict(consulta) for consulta in consultas]
        for consulta in consultas_dict:
            consulta['inicio'] = consulta['inicio'].strftime('%H:%M:%S')
            consulta['fim'] = consulta['fim'].strftime('%H:%M:%S')
        
        return jsonify(consultas_dict)
    except Exception as e:
        return jsonify({'error': str(e)})

@consulta.route('/consulta', methods=['POST'])
def create_consulta():
    try:
        # print(request.json)
        
        data = request.json.get('data')
        inicio = request.json.get('inicio')
        fim = request.json.get('fim')
        paciente = request.json.get('paciente')
        
        

        Consulta.create(data=data, inicio=inicio, fim=fim, paciente=paciente, status='AGENDADO')

        return jsonify({'message': 'Create consulta'})
    except Exception as e:
        return jsonify({'error': str(e)})

@consulta.route('/consulta/<int:consulta_id>', methods=['PUT'])
def update_consulta(consulta_id):
    try:
        consulta = Consulta.get_by_id(consulta_id)

        consulta.data = request.json.get('data', consulta.data)
        consulta.inicio = request.json.get('inicio', consulta.inicio)
        consulta.fim = request.json.get('fim', consulta.fim)
        consulta.paciente = request.json.get('paciente', consulta.paciente)
        consulta.presenca = request.json.get('presenca', consulta.presenca)
        consulta.status = request.json.get('status', consulta.status)

        consulta.save()

        consulta_dict = model_to_dict(consulta)
        
        consulta_dict['inicio'] = consulta.inicio.strftime('%H:%M:%S') if consulta.inicio else None
        consulta_dict['fim'] = consulta.fim.strftime('%H:%M:%S') if consulta.fim else None

        return jsonify({"message": "Consulta atualizada com sucesso", "consulta": consulta_dict})
    except Exception as e:
        return jsonify({'error': str(e)})

    
@consulta.route('/consulta/<int:consulta_id>', methods=['DELETE'])
def delete_consulta(consulta_id):
    try:
        consulta = Consulta.get_by_id(consulta_id)
        consulta.delete_instance()

        return jsonify(f"consulta {consulta_id} deleted")
    except Exception as e:
        return jsonify({'error': str(e)})