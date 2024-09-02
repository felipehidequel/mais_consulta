from peewee import CharField, TimeField, ForeignKeyField
from db.models.psicologo import Psicologo
from db.db import BaseModel

class Disponibilidade(BaseModel):
    psicologo = ForeignKeyField(Psicologo, backref='disponibilidades')
    dia_semana = CharField()  # Por exemplo, "segunda-feira"
    horario_inicio = TimeField()  # Por exemplo, "09:00"
    horario_fim = TimeField()  # Por exemplo, "12:00"

