from rake_nltk import Rake
import requests
import nltk

nltk.download('stopwords')
nltk.download('punkt')

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

