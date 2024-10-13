from flask import Flask
from configuration import configure_all
from flask_cors import CORS

app = Flask(__name__)

configure_all(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

app.run(debug=True)