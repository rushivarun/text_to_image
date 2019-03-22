from flask import Flask
from rake_nltk import Rake
from flask import jsonify
from functions_aarya import keyword_ext
from functions_aarya import FetchImage

app = Flask(__name__)


@app.route('/rakeit')
def final():
    out_list = []
    for i in keyword_ext():
        out_list.append(FetchImage(i))
    return jsonify(out_list)
        


if __name__ == '__main__':
    app.run()
