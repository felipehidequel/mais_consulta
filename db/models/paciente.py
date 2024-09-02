from peewee import CharField, DateField
from .usuario import Usuario

class Paciente(Usuario):
    dataDeNascimento = DateField()
    cpf = CharField()
