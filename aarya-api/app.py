from flask import Flask
from rake_nltk import Rake
from flask import jsonify
from functions_aarya import keyword_ext
from functions_aarya import FetchImage
from flask import request
import json
from flask_cors import CORS, cross_origin
from bs4 import BeautifulSoup
import urllib
import re
from flask import request

app = Flask(__name__)

CORS(app)

def IsQuestion(sentence):
    words = ['what','how','when','why','who']
    tokens = sentence.split(' ')
    if (tokens[0] in words):
        return 1
    else : 
        return 0


@app.route('/rakeit', methods=["POST"])
def respond():
    if (not IsQuestion(request.json['sentence'])):

        s = request.json['sentence']
        out_list = []
        for i in keyword_ext(s):
            out_list.append(FetchImage(i))
        return jsonify({
            'steps' : 0,
            'data' : out_list
        })

    else:
        query = request.json['sentence']
        text_plus = query.replace(' ', '+')
        link = 'https://www.wikihow.com/wikiHowTo?search='+text_plus
        html_page = urllib.request.urlopen(link)
        soup = BeautifulSoup(html_page)
        search_links = []
        for i in soup.findAll('a'):
            search_links.append(i.get('href'))
        html_page = urllib.request.urlopen(search_links[20])
        soup = BeautifulSoup(html_page)
        images = []
        for img in soup.findAll('img'):
            images.append(img.get('src'))
        imp_images = images[:24]
        image_links = imp_images[2::2]
        return jsonify({
            'steps' :1,
            'data' : image_links
        })


if __name__ == '__main__':
    app.run(port=8080)
