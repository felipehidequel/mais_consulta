from peewee import CharField, DateField, IntegerField
from .usuario import Usuario

class Paciente(Usuario):
    dataDeNascimento = DateField()
    cpf = CharField()
    quantidadeConsulta = IntegerField(default=0) # quantidade mensal de consultas | max 4
