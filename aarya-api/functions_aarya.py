from rake_nltk import Rake
import requests
import nltk
from bs4 import BeautifulSoup
import urllib
import json


subscription_key = "aa5e41a6700248c1a949ee8dd42e682f"
search_url = "https://api.cognitive.microsoft.com/bing/v7.0/images/search"
search_term = "puppies"

def keyword_ext(my_text):
    r = Rake()
    r.extract_keywords_from_text(my_text)
    key_list = r.get_ranked_phrases()
    return key_list




def FetchImage(search_term):
    headers = {"Ocp-Apim-Subscription-Key" : subscription_key}
    params = {"q": search_term, "license": "public", "imageType": "photo"}    
    response = requests.get(search_url, headers=headers, params=params)
    response.raise_for_status()
    search_results = response.json()
    thumbnail_urls = [img["thumbnailUrl"] for img in search_results["value"][:1]]
    return {'image_url': thumbnail_urls, 'search_word': search_term}



query = input('input your query here.. - ')
text_plus = query.replace(' ', '+')
link = 'https://www.wikihow.com/wikiHowTo?search='+text_plus
result = requests.get(link)

# if successful parse the download into a BeautifulSoup object, which allows easy manipulation 
if result.status_code == 200:
    soup = BeautifulSoup(result.content, "html.parser")
# print(soup)
print('----------------------------------------------------------------------------------------------------------------')
search_links = []
for i in soup.findAll('a'):
    search_links.append(i.get('href'))
print(search_links)
print('----------------------------------------------------------------------------------------------------------------')
print(search_links[30])
result = requests.get(search_links[29])

# if successful parse the download into a BeautifulSoup object, which allows easy manipulation 
if result.status_code == 200:
    soup = BeautifulSoup(result.content, "html.parser")
images = []
for img in soup.findAll('img'):
    images.append(img.get('src'))
imp_images = images[:24]
image_links = imp_images[2::2]

print({
    'step':1,
    'links' : image_links
})
