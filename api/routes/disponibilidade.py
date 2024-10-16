from flask import Blueprint, jsonify, request
from db.models.disponibilidade import Disponibilidade
from playhouse.shortcuts import model_to_dict
from db.models.psicologo import Psicologo

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
        disponibilidades = Disponibilidade.select().where(Disponibilidade.dia_semana == dia_semana)
        disponibilidades = [model_to_dict(disponibilidade) for disponibilidade in disponibilidades]
        
        for d in disponibilidades:
            d['horario_inicio'] = d['horario_inicio'].strftime('%H:%M:%S')
            d['horario_fim'] = d['horario_fim'].strftime('%H:%M:%S')
        
        return jsonify(disponibilidades)
        
    except Exception as e:
        return jsonify({f"error": str(e)})

@disponibilidade.route('/disponibilidade', methods=['POST'])
def create_disponibilidade():
    try:
        # Obtém dados do corpo da requisição
        horario_inicio = request.json.get('horario_inicio')
        horario_fim = request.json.get('horario_fim')
        dia_semana = request.json.get('dia_semana')

        # Verificar se os dados necessários foram fornecidos
        if not horario_inicio or not horario_fim or not dia_semana:
            return jsonify({'error': 'Horário de início, horário de fim e dia da semana são obrigatórios.'}), 400

        # Criar a nova disponibilidade sem vincular a um paciente
        nova_disponibilidade = Disponibilidade.create(horario_inicio=horario_inicio, horario_fim=horario_fim, dia_semana=dia_semana, bolando_disponivel=True)
        
        return jsonify({'message': 'Disponibilidade criada com sucesso.', 'disponibilidade_id': nova_disponibilidade.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@disponibilidade.route('/disponibilidade/<int:disponibilidade_id>', methods=['PUT'])
def update_disponibilidade(disponibilidade_id):
    try:
        disponibilidade = Disponibilidade.get_by_id(disponibilidade_id)

        paciente_id = request.json.get('paciente')  # Novo paciente a ser vinculado

        # Se um paciente foi passado, verificar se ele existe
        if paciente_id and not Paciente.select().where(Paciente.id == paciente_id).exists():
            return jsonify({'error': 'Paciente não encontrado.'}), 404

        # Atribuir valores do request, verificando se eles estão presentes
        disponibilidade.paciente = paciente_id or disponibilidade.paciente  # Atualizar se um novo paciente foi fornecido
        disponibilidade.horario_inicio = request.json.get('horario_inicio', disponibilidade.horario_inicio)
        disponibilidade.horario_fim = request.json.get('horario_fim', disponibilidade.horario_fim)

        # Salva e confirma atualização
        disponibilidade.save()

        return jsonify({'message': f'Disponibilidade atualizada com sucesso!', 'disponibilidade': model_to_dict(disponibilidade)})
    except Disponibilidade.DoesNotExist:
        return jsonify({'error': 'Disponibilidade não encontrada.'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@disponibilidade.route('/disponibilidade/paciente/<int:paciente_id>', methods=['GET'])
def get_disponibilidades_por_paciente(paciente_id):
    try:
        if not Paciente.select().where(Paciente.id == paciente_id).exists():
            return jsonify({'error': 'Paciente não encontrado.'}), 404

        disponibilidades = Disponibilidade.select().where(Disponibilidade.paciente == paciente_id)
        disponibilidades_dict = [model_to_dict(disponibilidade) for disponibilidade in disponibilidades]
        
        for disponibilidade in disponibilidades_dict:
            disponibilidade['horario_inicio'] = disponibilidade['horario_inicio'].strftime('%H:%M:%S')
            disponibilidade['horario_fim'] = disponibilidade['horario_fim'].strftime('%H:%M:%S')
        
        return jsonify(disponibilidades_dict)
    except Exception as e:
        return jsonify({'error': str(e)})

@disponibilidade.route('/disponibilidade/<int:disponibilidade_id>', methods=['DELETE'])
def delete_disponibilidade(disponibilidade_id):
    try:
        Disponibilidade.delete_by_id(disponibilidade_id)
    
        return jsonify({'message': f'Deletada disponibilidade com ID {disponibilidade_id}'})
    except Exception as e:
        return jsonify({'error': str(e)})
    
    