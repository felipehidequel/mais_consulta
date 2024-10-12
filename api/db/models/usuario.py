from peewee import Model,CharField
from db.db import BaseModel
# from ..usuario import Usuario

class Usuario(BaseModel):
    username = CharField(unique=True)
    password = CharField()
    email = CharField()
    telefone = CharField()
