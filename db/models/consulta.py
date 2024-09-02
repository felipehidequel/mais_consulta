from peewee import Model, DateField, TimeField, ForeignKeyField

from db.db import BaseModel
from db.models.paciente import Paciente

class Consulta(BaseModel):
    data = DateField()
    inicio = TimeField()
    fim = TimeField()
    paciente = ForeignKeyField(Paciente, backref='consultas')
