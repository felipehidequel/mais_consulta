from flask import Blueprint, jsonify, request
from db.models.paciente import Paciente
from db.models.disponibilidade import Disponibilidade
from playhouse.shortcuts import model_to_dict

paciente = Blueprint('paciente', __name__)

@paciente.route('/paciente', methods=['GET'])
def get_pacientes():
    try:
        pacientes = Paciente.select()
        pacientes_dict = [model_to_dict(paciente) for paciente in pacientes]
        return jsonify(pacientes_dict), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@paciente.route('/paciente/<int:paciente_id>', methods=['GET'])
def get_paciente(paciente_id):
    try:
        paciente = Paciente.get_by_id(paciente_id)
        paciente = model_to_dict(paciente)
        return jsonify(paciente), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@paciente.route('/paciente', methods=['POST'])
def create_paciente():
    try:
        username = request.json.get('username')
        password = request.json.get('password')
        telefone = request.json.get('telefone')
        email = request.json.get('email')
        cpf = request.json.get('cpf')
        dataDeNascimento = request.json.get('dataDeNascimento')
        disponibilidade_id = request.json.get('disponibilidade_id')  # Obter disponibilidade vinculada

        # Verifica se a disponibilidade existe
        disponibilidade = Disponibilidade.get_by_id(disponibilidade_id)  # Obter a disponibilidade
        
        # Cria o novo paciente
        novo_paciente = Paciente.create(
            username=username, 
            password=password, 
            telefone=telefone, 
            email=email, 
            cpf=cpf, 
            dataDeNascimento=dataDeNascimento
        )

        # Marca a disponibilidade como indisponível
        disponibilidade.paciente = novo_paciente  # Vincula ao paciente
        disponibilidade.bolando_disponivel = False  # Marca como indisponível
        disponibilidade.save()
        
        return jsonify({'message': 'Paciente criado com sucesso.', 'paciente_id': novo_paciente.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@paciente.route('/paciente/<int:paciente_id>/disponibilidade/<int:disponibilidade_id>', methods=['POST'])
def vincular_disponibilidade(paciente_id, disponibilidade_id):
    try:
        paciente = Paciente.get_by_id(paciente_id)

        # Verifica se a disponibilidade existe
        disponibilidade = Disponibilidade.get_by_id(disponibilidade_id)

        # Marcar a disponibilidade como disponível novamente se ela já estiver vinculada a outro paciente
        if disponibilidade.paciente:
            disponibilidade.paciente = None  # Desvincula do paciente anterior
            disponibilidade.bolando_disponivel = True  # Marca como disponível novamente

        # Atualiza a disponibilidade para vincular ao paciente
        disponibilidade.paciente = paciente  # Vincular a disponibilidade ao paciente
        disponibilidade.bolando_disponivel = False  # Marcar como indisponível
        disponibilidade.save()

        return jsonify({'message': f'Disponibilidade vinculada ao paciente {paciente.username} com sucesso.'}), 200
    except Paciente.DoesNotExist:
        return jsonify({'error': 'Paciente não encontrado.'}), 404
    except Disponibilidade.DoesNotExist:
        return jsonify({'error': 'Disponibilidade não encontrada.'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@paciente.route('/paciente/<int:paciente_id>', methods=['PUT'])
def update_paciente(paciente_id):
    try:
        # Obtém o paciente pelo ID
        paciente = Paciente.get_by_id(paciente_id)

        # Obtém os dados do corpo da requisição
        nova_disponibilidade_id = request.json.get('disponibilidade_id')
        
        # Se uma nova disponibilidade for enviada
        if nova_disponibilidade_id:
            nova_disponibilidade = Disponibilidade.get_by_id(nova_disponibilidade_id)

            # Verifica se o paciente já tem uma disponibilidade vinculada
            if paciente.disponibilidade:
                # Marca a disponibilidade atual como disponível novamente
                disponibilidade_atual = paciente.disponibilidade
                disponibilidade_atual.paciente = None  # Desvincula
                disponibilidade_atual.bolando_disponivel = True  # Marca como disponível
                disponibilidade_atual.save()

            # Atualiza a disponibilidade do paciente para a nova
            paciente.disponibilidade = nova_disponibilidade  # Vincula a nova disponibilidade
            nova_disponibilidade.paciente = paciente  # Vincula ao paciente
            nova_disponibilidade.bolando_disponivel = False  # Marca como indisponível
            nova_disponibilidade.save()

        # Atualiza os outros atributos do paciente
        paciente.username = request.json.get('username', paciente.username)
        paciente.password = request.json.get('password', paciente.password)
        paciente.telefone = request.json.get('telefone', paciente.telefone)
        paciente.email = request.json.get('email', paciente.email)
        paciente.cpf = request.json.get('cpf', paciente.cpf)
        paciente.dataDeNascimento = request.json.get('dataDeNascimento', paciente.dataDeNascimento)

        # Salva as alterações no paciente
        paciente.save()

        return jsonify({'message': f'Paciente {paciente_id} atualizado com sucesso.'}), 200
    
    except Paciente.DoesNotExist:
        return jsonify({'error': 'Paciente não encontrado.'}), 404
    except Disponibilidade.DoesNotExist:
        return jsonify({'error': 'Disponibilidade não encontrada.'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    try:
        # Obtém o paciente pelo ID
        paciente = Paciente.get_by_id(paciente_id)

        # Obtém os dados do corpo da requisição
        nova_disponibilidade_id = request.json.get('disponibilidade_id')
        
        # Se uma nova disponibilidade for enviada
        if nova_disponibilidade_id:
            # Verifica se a nova disponibilidade existe
            nova_disponibilidade = Disponibilidade.get_by_id(nova_disponibilidade_id)

            # Verifica se o paciente já tem uma disponibilidade vinculada
            if paciente.disponibilidade_id:
                # Marca a disponibilidade atual como disponível novamente
                disponibilidade_atual = Disponibilidade.get_by_id(paciente.disponibilidade_id)
                disponibilidade_atual.paciente = None  # Desvincula
                disponibilidade_atual.bolando_disponivel = True  # Marca como disponível
                disponibilidade_atual.save()

            # Vincula a nova disponibilidade ao paciente
            paciente.disponibilidade_id = nova_disponibilidade.id  # Armazena o ID da nova disponibilidade
            nova_disponibilidade.paciente = paciente  # Vincula a nova disponibilidade
            nova_disponibilidade.bolando_disponivel = False  # Marca como indisponível
            nova_disponibilidade.save()

        # Atualiza os outros atributos do paciente
        paciente.username = request.json.get('username', paciente.username)
        paciente.password = request.json.get('password', paciente.password)
        paciente.telefone = request.json.get('telefone', paciente.telefone)
        paciente.email = request.json.get('email', paciente.email)
        paciente.cpf = request.json.get('cpf', paciente.cpf)
        paciente.dataDeNascimento = request.json.get('dataDeNascimento', paciente.dataDeNascimento)

        # Salva as alterações no paciente
        paciente.save()

        return jsonify({'message': f'Paciente {paciente_id} atualizado com sucesso.'}), 200
    
    except Paciente.DoesNotExist:
        return jsonify({'error': 'Paciente não encontrado.'}), 404
    except Disponibilidade.DoesNotExist:
        return jsonify({'error': 'Disponibilidade não encontrada.'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    try:
        # Obtém o paciente pelo ID
        paciente = Paciente.get_by_id(paciente_id)

        # Obtém os dados do corpo da requisição
        nova_disponibilidade_id = request.json.get('disponibilidade_id')
        
        # Se uma nova disponibilidade for enviada
        if nova_disponibilidade_id:
            nova_disponibilidade = Disponibilidade.get_by_id(nova_disponibilidade_id)

            # Verifica se o paciente já tem uma disponibilidade vinculada
            if paciente.disponibilidade_id:
                # Marca a disponibilidade atual como disponível novamente
                disponibilidade_atual = Disponibilidade.get_by_id(paciente.disponibilidade_id)
                disponibilidade_atual.paciente = None  # Desvincula
                disponibilidade_atual.bolando_disponivel = True  # Marca como disponível
                disponibilidade_atual.save()

            # Atualiza a disponibilidade do paciente para a nova
            paciente.disponibilidade_id = nova_disponibilidade_id
            nova_disponibilidade.paciente = paciente  # Vincula a nova disponibilidade
            nova_disponibilidade.bolando_disponivel = False  # Marca como indisponível
            nova_disponibilidade.save()

        # Atualiza os outros atributos do paciente
        paciente.username = request.json.get('username', paciente.username)
        paciente.password = request.json.get('password', paciente.password)
        paciente.telefone = request.json.get('telefone', paciente.telefone)
        paciente.email = request.json.get('email', paciente.email)
        paciente.cpf = request.json.get('cpf', paciente.cpf)
        paciente.dataDeNascimento = request.json.get('dataDeNascimento', paciente.dataDeNascimento)

        # Salva as alterações no paciente
        paciente.save()

        return jsonify({'message': f'Paciente {paciente_id} atualizado com sucesso.'}), 200
    
    except Paciente.DoesNotExist:
        return jsonify({'error': 'Paciente não encontrado.'}), 404
    except Disponibilidade.DoesNotExist:
        return jsonify({'error': 'Disponibilidade não encontrada.'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@paciente.route('/paciente/<int:paciente_id>', methods=['DELETE'])
def delete_paciente(paciente_id):
    try:
        paciente = Paciente.get_by_id(paciente_id)

        # Se o paciente tiver uma disponibilidade vinculada, desvincule-a
        if paciente.disponibilidades:  # Acesse o back-reference
            for disponibilidade in paciente.disponibilidades:
                disponibilidade.paciente = None  # Desvincula
                disponibilidade.bolando_disponivel = True  # Marca como disponível novamente
                disponibilidade.save()  # Salva as alterações na disponibilidade

        # Deleta o paciente
        paciente.delete_instance()
        return jsonify({'message': f'Paciente {paciente_id} deletado com sucesso.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@paciente.route('/paciente/<int:paciente_id>/disponibilidades', methods=['GET'])
def get_disponibilidades_por_paciente(paciente_id):
    try:
        paciente = Paciente.get_by_id(paciente_id)

        # Obter disponibilidades vinculadas ao paciente
        disponibilidades = paciente.disponibilidades  # Utilize o backref definido no modelo

        # Transformar as disponibilidades em dicionário para resposta
        disponibilidades_dict = [model_to_dict(d) for d in disponibilidades]
        
        for disponibilidade in disponibilidades_dict:
            disponibilidade['horario_inicio'] = disponibilidade['horario_inicio'].strftime('%H:%M:%S')
            disponibilidade['horario_fim'] = disponibilidade['horario_fim'].strftime('%H:%M:%S')

        return jsonify(disponibilidades_dict), 200
    except Paciente.DoesNotExist:
        return jsonify({'error': 'Paciente não encontrado.'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
