from peewee import DateField, TimeField, ForeignKeyField, CharField, BooleanField

from db.db import BaseModel
from db.models.paciente import Paciente

class Consulta(BaseModel):
    status = CharField() # "agendada", "realizada", "cancelada"
    data = DateField()
    inicio = TimeField()
    fim = TimeField()
    presenca = BooleanField() # "presente", "ausente"
    paciente = ForeignKeyField(Paciente, backref='consultas')