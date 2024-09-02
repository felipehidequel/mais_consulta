from peewee import CharField
from db.models.usuario import Usuario

class Psicologo(Usuario):
    crp = CharField()