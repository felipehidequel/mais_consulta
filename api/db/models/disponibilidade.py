from peewee import CharField, TimeField, ForeignKeyField, IntegerField
from db.db import BaseModel
from .paciente import Paciente  # Importar o modelo Paciente

class Disponibilidade(BaseModel):
    paciente = ForeignKeyField(Paciente, backref='disponibilidades', null=True)  # Vínculo opcional a um paciente
    dia_semana = CharField()  # Por exemplo, "segunda-feira"
    horario_inicio = TimeField()  # Por exemplo, "09:00"
    horario_fim = TimeField()  # Por exemplo, "12:00"
    bolando_disponivel = IntegerField(default=True)  # Disponível ou não