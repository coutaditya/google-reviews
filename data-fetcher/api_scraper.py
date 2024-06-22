import requests
import json
import time
import os

URL = "https://api.themoviedb.org/3/discover/movie?language=en-US&page={}&sort_by=popularity.desc"
HEADERS = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjhmNzQzOGFkMDcyMWUyM2E2MTdhMDcxMWU2ZWNiNCIsInN1YiI6IjY2MTExNDA0YjMzOTAzMDE3YjZlOWQ4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.brdCzPYG7bbC76z_N77q3yfssBopbYJLK07Fo-Jqyaw"
}
RETRY = 5
WAIT = 5
MOVIES_SET = set()
MOVIES_DIR = os.path.join(os.getcwd(), ".cache/movies/")
SERIES_DIR = os.path.join(os.getcwd(), ".cache/series/")
MOVIES_JSON = "movies_{}.json"
SERIES_JSON = "series_{}.json"
IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

os.makedirs(MOVIES_DIR, exist_ok=True)
os.makedirs(SERIES_DIR, exist_ok=True)


def fetch_url(url, page):
    print(f"Fetching data for page {page}")
    for _ in range(RETRY):
        if _ > 0:
            print(f"Retrying for {url}")
        response = requests.get(url.format(page), headers=HEADERS, params={})
        if response.status_code == 200:
            return response
        time.sleep(WAIT)
    print(f"No data found from page - {page}, URL: {url}")
    return None


#TODO: map genre ids to genre names somewhere
def process_per_page_data(data):
    final_data = {}
    for movie in data["results"]:
        if movie["title"] not in MOVIES_SET:
            final_data[movie["title"]] = {
                "original_language": movie["original_language"],
                "overview": movie["overview"],
                "adult": movie["adult"],
                "genre_ids": movie["genre_ids"],
                "poster_link": IMAGE_BASE_URL + movie["poster_path"] if movie["poster_path"] else ""
            }
            MOVIES_SET.add(movie["title"])   
    return final_data


def store_data(data, page):
    json_file = os.path.join(MOVIES_DIR, MOVIES_JSON.format(page))
    with open(json_file, "w") as f:
        json.dump(data, f, indent=4)
        

def main():
    page = 1
    while page and (page <= 200):
        response = fetch_url(URL, page)
        data = response.json()
        if not data.get("results"):
            break
        movies_data = process_per_page_data(data)
        store_data(movies_data, page)
        page += 1
        # time.sleep(2)
        print(f"Total movies extracted: {len(MOVIES_SET)}")
    print("Data stored successfully.")

if __name__ == '__main__':
    main()