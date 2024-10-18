from peewee import CharField, TimeField, ForeignKeyField, BooleanField
from db.models.paciente import Paciente
from db.db import BaseModel

class Disponibilidade(BaseModel):
    dia_semana = CharField()  # Por exemplo, "segunda-feira"
    horario_inicio = TimeField()  # Por exemplo, "09:00"
    horario_fim = TimeField()  # Por exemplo, "12:00"
    is_disponivel = BooleanField(default=True)  # "sim" ou "nao"