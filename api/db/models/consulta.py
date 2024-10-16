from peewee import DateField, ForeignKeyField, CharField, BooleanField

from db.db import BaseModel
from db.models.paciente import Paciente
from db.models.disponibilidade import Disponibilidade

class Consulta(BaseModel):
    status = CharField() # "agendada", "realizada", "cancelada"
    data = DateField()
    disponibilidade = ForeignKeyField(Disponibilidade, backref='consultas')
    presenca = BooleanField(null=True, default=None) # "presente", "ausente"
