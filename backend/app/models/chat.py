# from ..extensions import db

class Chat():
    __tablename__ = 'chat'
    
    engine_name = ""
    # id = db.Column(db.Integer, primary_key=True)

    def __init__(self, engine_name):
        self.engine_name = engine_name

    def __repr__(self):
        return f'<Chat {self.engine_name}>'