from routes.home import home
from routes.paciente import paciente
from routes.psicologo import psicologo
from routes.consulta import consulta
from routes.disponibilidade import disponibilidade

from db.models.disponibilidade import Disponibilidade
from db.models.paciente import Paciente
from db.models.psicologo import Psicologo
from db.models.consulta import Consulta
from db.db import db

def configure_all(app):
    configure_routes(app)
    configure_db()
    
def configure_routes(app):
    app.register_blueprint(home)
    app.register_blueprint(paciente)
    app.register_blueprint(psicologo)
    app.register_blueprint(consulta)
    app.register_blueprint(disponibilidade)
    
def configure_db():
    db.connect()
    db.create_tables([Paciente])
    db.create_tables([Psicologo])
    db.create_tables([Disponibilidade])
    db.create_tables([Consulta])