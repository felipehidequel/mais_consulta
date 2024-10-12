from flask import Blueprint, render_template, jsonify
from jinja2 import TemplateNotFound

home = Blueprint('home', __name__, template_folder='templates')

@home.route('/')
def index():
    try:
        return render_template('index.html')
    except TemplateNotFound:
        return jsonify({'message': 'Template not found'})