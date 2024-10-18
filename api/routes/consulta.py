from flask import Blueprint, render_template, jsonify, request
from db.models.consulta import Consulta
from playhouse.shortcuts import model_to_dict
from db.models.disponibilidade import Disponibilidade
from db.models.paciente import Paciente

from flask import Blueprint

consulta = Blueprint('consulta', __name__, template_folder='templates')

"""
ROTAS PARA CONSULTA
"""

@consulta.route('/consulta', methods=['GET'])
def get_consultas():
    try:
        consultas = Consulta.select()
        consultas_dict = [
            {
                **model_to_dict(consulta),
                'disponibilidade': {
                    **model_to_dict(consulta.disponibilidade),
                    'horario_inicio': consulta.disponibilidade.horario_inicio.strftime('%H:%M:%S'),
                    'horario_fim': consulta.disponibilidade.horario_fim.strftime('%H:%M:%S')
                } if 'disponibilidade' in model_to_dict(consulta) else {}
            }
            for consulta in consultas
        ]
        return jsonify(consultas_dict)
    except Exception as e:
        return jsonify({'error': str(e)})


@consulta.route('/consulta/<int:consulta_id>', methods=['GET'])
def get_consulta(consulta_id):
    try:
        consulta = Consulta.get_by_id(consulta_id)
        
        consulta = model_to_dict(consulta)
        consulta['disponibilidade']['horario_inicio'] = consulta['disponibilidade']['horario_inicio'].strftime('%H:%M:%S')
        consulta['disponibilidade']['horario_fim'] = consulta['disponibilidade']['horario_fim'].strftime('%H:%M:%S')
        
        return jsonify(consulta)
    except Exception as e:
        return jsonify({'error': str(e)})
    
@consulta.route('/consulta/paciente/<int:paciente_id>', methods=['GET'])
def get_consultas_paciente(paciente_id):
    try:
        consultas = Consulta.select().where(Consulta.paciente == paciente_id)
        
        consultas_dict = [model_to_dict(consulta) for consulta in consultas]
        for consulta in consultas_dict:
            consulta['disponibilidade']['horario_inicio'] = consulta['disponibilidade']['horario_inicio'].strftime('%H:%M:%S')
            consulta['disponibilidade']['horario_fim'] = consulta['disponibilidade']['horario_fim'].strftime('%H:%M:%S')

        return jsonify(consultas_dict)
    except Exception as e:
        return jsonify({'error': str(e)})
        return jsonify(model_to_dict(consulta))
    except Exception as e:
        return jsonify({'error': str(e)})
    

@consulta.route('/consulta', methods=['POST'])
def create_consulta():
    try:
        data = request.json.get('data')
        disponibilidade_id = request.json.get('disponibilidade', {}).get('id')
        paciente_username = request.json.get('paciente', {}).get('username')

        disponibilidade_obj = Disponibilidade.get_or_none(disponibilidade_id)

        paciente_obj = Paciente.get_or_none(Paciente.username == paciente_username)

        nova_consulta = Consulta.create(
            data=data,
            disponibilidade=disponibilidade_id,
            status='AGENDADO',
            paciente=paciente_obj.id
        )

        disponibilidade_obj.is_disponivel = False
        disponibilidade_obj.save()

        return jsonify({'message': 'Consulta criada com sucesso', 'consulta_id': nova_consulta.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@consulta.route('/consulta/<int:consulta_id>', methods=['PUT'])
def update_consulta(consulta_id):
    try:
        consulta = Consulta.get_by_id(consulta_id)
        consulta.status = request.json.get('status', consulta.status)
        consulta.data = request.json.get('data', consulta.data)
        consulta.disponibilidade = request.json.get('disponibilidade', consulta.disponibilidade)
        consulta.presenca = request.json.get('presenca', consulta.presenca)
        consulta.save()

        consulta_dict = model_to_dict(consulta)
        consulta_dict['disponibilidade']['horario_inicio'] = consulta_dict['disponibilidade']['horario_inicio'].strftime('%H:%M:%S')
        consulta_dict['disponibilidade']['horario_fim'] = consulta_dict['disponibilidade']['horario_fim'].strftime('%H:%M:%S')

        return jsonify({"message": "Consulta atualizada com sucesso", "consulta": consulta_dict})
    except Exception as e:
        return jsonify({'error': str(e)})
    
@consulta.route('/consulta/paciente/<int:paciente_id>', methods=['PUT'])
def update_consulta_by_paciente(paciente_id):
    try:
        consultas = Consulta.select().where(Consulta.paciente == paciente_id)
        
        for consulta in consultas:
            consulta.status = request.json.get('status', consulta.status)
            consulta.presenca = request.json.get('presenca', consulta.presenca)
            consulta.save()
        
        return jsonify({"message": "Consultas atualizadas com sucesso"})
    except Exception as e:
        return jsonify({'error': str(e)})
    
@consulta.route('/consulta/paciente/<int:paciente_id>', methods=['DELETE'])
def delete_consultas_by_paciente(paciente_id):
    try:
        consultas = Consulta.select().where(Consulta.paciente == paciente_id)

        for consulta in consultas:
            # Acesse a instância de disponibilidade e altere o valor
            consulta.disponibilidade.is_disponivel = True
            
            # Salve as alterações na disponibilidade
            consulta.disponibilidade.save()  # Persistir a mudança no banco de dados
            
            # Delete a consulta
            consulta.delete_instance()

        return jsonify({"message": "Consultas deletadas com sucesso"})
    except Exception as e:
        print(f"Erro ao deletar consultas para paciente {paciente_id}: {str(e)}")  # Log detalhado
        return jsonify({'error': str(e)})

