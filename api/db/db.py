from peewee import SqliteDatabase, Model

db = SqliteDatabase('agenda_manager.db')

class BaseModel(Model):
    class Meta:
        database = db

# db.connect()