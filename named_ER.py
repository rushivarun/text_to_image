from flask import Flask
from rake_nltk import Rake
from flask import jsonify
from functions_aarya import keyword_ext
from functions_aarya import FetchImage
from flask import request
import json


app = Flask(__name__)


@app.route('/rakeit', methods=["POST"])
def final():
    s = request.json['sentence']
    out_list = []
    for i in keyword_ext(s):
        out_list.append(FetchImage(i))
    return jsonify(out_list)
        


if __name__ == '__main__':
    app.run(port=6969)
