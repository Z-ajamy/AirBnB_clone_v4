#!/usr/bin/python3
""" Starts a Flask web application """

from flask import Flask, render_template
from models import storage
import uuid

app = Flask(__name__)

@app.route('/100-hbnb/', strict_slashes=False)
def display_hbnb():
    """ Display the HBNB page """
    states = storage.all('State').values()
    amenities = storage.all('Amenity').values()
    cache_id = uuid.uuid4()
    return render_template('100-hbnb.html',
                           states=states,
                           amenities=amenities,
                           cache_id=cache_id)

@app.teardown_appcontext
def teardown_db(exception):
    """ Close storage """
    storage.close()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
